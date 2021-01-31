import { CookieSerializeOptions, serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export type NextApiResponseWithCookie = NextApiResponse & {
  cookie: (name: string, value: any, options?: CookieSerializeOptions) => void;
};

/**
 * This sets `cookie` on `res` object
 */
const cookie = (
  res: NextApiResponse,
  name: string,
  value: any,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  if ("maxAge" in options) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  res.setHeader("Set-Cookie", serialize(name, String(stringValue), options));
};

/**
 * Adds `cookie` function on `res.cookie` to set cookies for response
 */
const cookies = (handler: any) => (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  (res as NextApiResponseWithCookie).cookie = (
    name: string,
    value: any,
    options?: CookieSerializeOptions
  ) => cookie(res, name, value, options);

  return handler(req, res);
};

export default cookies;
