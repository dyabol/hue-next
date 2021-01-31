import getApi from "../../../utils/hueApi";
import { v3 } from "node-hue-api";
const Light = v3.lightStates.LightState;
import type { NextApiRequest, NextApiResponse } from "next";
import { rgb_to_cie } from "../../../utils/cie_rgb_converter";

type Data =
  | {
      status: "OK";
    }
  | { error: string };

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    query: { id, red, green, blue, brightness },
    cookies: { hueIpAdress, hueUser },
  } = req;
  try {
    const [x, y] = rgb_to_cie(
      parseInt(red as string, 10),
      parseInt(green as string, 10),
      parseInt(blue as string, 10)
    );
    const state = new Light()
      .on(true)
      .xy(x, y)
      .brightness(parseInt(brightness as string, 10));
    //.transitionInstant();
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
