import type { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../lib/withSession";

export default withSessionRoute(logoutHandler);

async function logoutHandler(req: NextApiRequest, res: NextApiResponse) {
  // destroy session and redirect
  req.session.destroy();
  res.redirect("/");
}
