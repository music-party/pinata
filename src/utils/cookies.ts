import { serialize, CookieSerializeOptions } from "cookie";
import { NextApiResponse } from "next";

// https://nextjs.org/docs/api-routes/api-middlewares#extending-the-reqres-objects-with-typescript
export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  if ("maxAge" in options && options.maxAge) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  res.setHeader("Set-Cookie", serialize(name, stringValue, options));
};

// https://stackoverflow.com/questions/62101821/nextjs-api-routes-how-to-remove-a-cookie-from-header
export const clearCookie = (res: NextApiResponse, name: string) => {
  res.setHeader("Set-Cookie", serialize(name, "", { maxAge: -1, path: "/" }));
};
