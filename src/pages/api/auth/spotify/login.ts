import type { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../../lib/withSession";
import { setCookie } from "../../../../utils/cookies";

export default withSessionRoute(loginHandler);

async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  // generate auth state and save in a cookie
  const generateRandomString = (length: number): string => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  const state = generateRandomString(16);
  setCookie(res, "spotify_auth_state", state);

  // create authorization url and redirect
  let url = new URL("https://accounts.spotify.com/authorize");
  url.searchParams.append("response_type", "code");
  url.searchParams.append("client_id", process.env.SPOTIFY_CLIENT_ID!);
  url.searchParams.append("scope", process.env.SPOTIFY_SCOPE!);
  url.searchParams.append("redirect_uri", process.env.SPOTIFY_REDIRECT_URI!);
  url.searchParams.append("state", state);
  if (process.env.NODE_ENV !== "production")
    url.searchParams.append("show_dialog", "true");

  res.redirect(url.toString());
}
