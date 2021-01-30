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
    query: { id },
    cookies: { hueIpAdress, hueUser },
  } = req;
  try {
    const lightId = parseInt(id as string, 10);
    const hueApi = await getApi(hueIpAdress, hueUser);
    const red = rgb_to_cie(255, 0, 0);
    const green = rgb_to_cie(0, 255, 0);
    //const redState = new Light().xy(red[0], red[1]).transitionInMillis(1000);
    //const redState = new Light().effectColorLoop();
    const redState = new Light().effectNone();
    //const redState = new Light().alertShort();
    const greenState = new Light().xy(green[0], green[1]);
    await hueApi?.lights.setLightState(lightId, redState);
    //hueApi?.lights.setLightState(lightId, greenState);
    res.statusCode = 200;
    res.json({ status: "OK" });
  } catch (e) {
    res.statusCode = 500;
    res.json({ error: e.message });
  }
};
