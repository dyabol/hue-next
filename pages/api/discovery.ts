import { discoverAndCreateUser } from "../../utils/hueApi";
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | {
      ipAddress: string;
      username: string;
    }
  | { error: string };

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    query: { appName, deviceName },
  } = req;
  try {
    const info = await discoverAndCreateUser(
      appName as string,
      deviceName as string
    );
    res.statusCode = 200;
    res.json(info);
  } catch (e) {
    res.statusCode = 500;
    res.json({ error: e.message });
  }
};
