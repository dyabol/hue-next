import { getApi } from "../../../utils/hueApi";
import type { NextApiRequest, NextApiResponse } from "next";
import { v3 } from "node-hue-api";
import { rgb_to_cie } from "../../../utils/cie_rgb_converter";
const Light = v3.lightStates.LightState;

type Data =
  | {
      status: "OK";
    }
  | { error: string };

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    query: { id, on },
    cookies: { hueIpAdress, hueUser },
  } = req;
  try {
    const lightId = parseInt(id as string, 10);
    const hueApi = await getApi(hueIpAdress, hueUser);
    const state = new Light().effect(on == "true" ? "colorloop" : "none");
    await hueApi?.lights.setLightState(lightId, state);
    res.statusCode = 200;
    res.json({ status: "OK" });
  } catch (e) {
    res.statusCode = 500;
    res.json({ error: e.message });
  }
};
