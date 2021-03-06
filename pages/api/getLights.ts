import { getLights } from "../../utils/hueApi";
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | {
      data: any[];
    }
  | { error: string };

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    cookies: { hueIpAdress, hueUser },
  } = req;
  try {
    const lights = await getLights(hueIpAdress, hueUser);
    res.statusCode = 200;
    res.json({ data: lights });
  } catch (e) {
    res.statusCode = 500;
    res.json({ error: e.message });
  }
};
