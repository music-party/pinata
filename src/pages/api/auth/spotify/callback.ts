import type { NextApiRequest, NextApiResponse } from "next";
import type { SpotifyProfile } from "../../../../types/spotify";
import { withSessionRoute } from "../../../../lib/withSession";
import { clearCookie } from "../../../../utils/cookies";

export default withSessionRoute(callbackHandler);

async function callbackHandler(req: NextApiRequest, res: NextApiResponse) {
  const state = req.query.state ?? null;
  const code = (req.query.code as string) ?? null;
  const storedState = req.cookies["spotify_auth_state"];

  // check the auth state matches
  if (!state || state !== storedState) {
    res.redirect("/?error=state_mismatch");
  } else if (req.query.error) {
    res.redirect("/?error=" + encodeURIComponent(req.query.error as string));
  } else {
    // successful authorization request
    // clear auth state cookie
    clearCookie(res, "spotify_auth_state");

    // fetch an access token using the code
    let response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });
    if (!response.ok) res.status(500).send(await response.json());
    const { access_token, refresh_token } = await response.json();

    // fetch the current user to populate the session using the access token
    response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: "Bearer " + access_token },
    });
    if (!response.ok) res.status(500).send(await response.json());
    const profile: SpotifyProfile = await response.json();

    // check that user has premium
    if (profile.product !== "premium") {
      res.redirect("/?error=invalid_product");
    }

    // save the user in the session
    req.session.user = {
      profile: {
        country: profile.country,
        display_name: profile.display_name ?? "",
        email: profile.email,
        explicit_content: profile.explicit_content.filter_enabled,
        external_urls: profile.external_urls,
        id: profile.id,
        image_url: profile.images?.[0].url ?? null,
        product: profile.product,
      },
      access_token,
      refresh_token,
    };
    await req.session.save();

    res.redirect("/home");
  }
}
