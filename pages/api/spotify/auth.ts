import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const auth_id = Math.random().toString(36).slice(5, 11);
  res.statusCode = 200;
  res.json({ auth_id });
};
