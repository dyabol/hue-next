import getApi from "../../../utils/hueApi";
import { v3 } from "node-hue-api";
const Light = v3.lightStates.LightState;
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | {
      status: "OK";
    }
  | { error: string };

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    query: { id },
    cookies: { hueIpAdress, hueUser },
  } = req;
  try {
    const state = new Light().on(true);
    const hueApi = await getApi(hueIpAdress, hueUser);
    await hueApi?.lights.setLightState(parseInt(id as string, 10), state);
    res.statusCode = 200;
    res.json({ status: "OK" });
  } catch (e) {
    console.log(e);
    res.statusCode = 500;
    res.json({ error: e.message });
  }
};
