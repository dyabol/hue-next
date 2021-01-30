import { getLights } from "../../utils/hueApi";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  data: any[];
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const lights = await getLights();
    res.statusCode = 200;
    res.json({ data: lights });
  } catch (e) {
    console.log(e);
    res.statusCode = 500;
    res.json(null);
  }
};
