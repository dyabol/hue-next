import type { NextApiRequest } from "next";
import querystring from "querystring";
import cookie, { NextApiResponseWithCookie } from "../../../utils/cookies";
import { post } from "request-promise";

const callback = async (
  req: NextApiRequest,
  res: NextApiResponseWithCookie
) => {
  const code = req.query.code || null;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
        ).toString("base64"),
    },
    json: true,
  };

  //   res.setHeader("Set-Cookie", "test=aaaaaaa; Path=/");
  //   res.end(res.getHeader("Set-Cookie"));
  //   return;

  try {
    const body = await post(authOptions);
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    res.setHeader("Set-Cookie", `SPOTIFY_REFRESH_CODE=${code}; Path=/`);
    res.setHeader(
      "Set-Cookie",
      `SPOTIFY_REFRESH_TOKEN=${body.refresh_token}; Path=/`
    );
    res.setHeader(
      "Set-Cookie",
      `SPOTIFY_ACCESS_TOKEN=${body.access_token}; Path=/`
    );
    if (process.env.NODE_ENV === "development") {
      res.redirect("http://localhost:3000/spotify");
    } else {
      res.redirect(process.env.PROJECT_ROOT + "/spotify");
    }
    res.end();
  } catch (e) {
    res.redirect(
      "/spotify" + querystring.stringify({ error: "invalid_token" })
    );
  }
};

export default cookie(callback);
