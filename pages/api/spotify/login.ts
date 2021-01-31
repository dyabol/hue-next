import type { NextApiRequest } from "next";
import querystring from "querystring";
import cookie, { NextApiResponseWithCookie } from "../../../utils/cookies";

const login = (req: NextApiRequest, res: NextApiResponseWithCookie) => {
  const auth_id = req.query.auth_id;
  const query = querystring.stringify({
    response_type: "code",
    client_id: process.env.CLIENT_ID,
    scope: "user-read-playback-state",
    redirect_uri: process.env.REDIRECT_URI,
    state: auth_id,
  });
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.cookie("SPOTIFY_AUTH_ID", auth_id, {
    path: "/",
  });
  res.redirect("https://accounts.spotify.com/authorize?" + query);
};

export default cookie(login);
