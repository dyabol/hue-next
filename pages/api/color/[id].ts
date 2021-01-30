import getApi from "../../../utils/hueApi";
import { v3 } from "node-hue-api";
const Light = v3.lightStates.LightState;
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: "OK" | "ERROR";
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    query: { id },
  } = req;
  try {
    const state = new Light()
      .on(true)
      .hsb(
        parseInt(req.query.hue as string, 10),
        parseInt(req.query.saturation as string, 10),
        parseInt(req.query.brightness as string, 10)
      )
      .transitionSlow();
    const hueApi = await getApi();
    await hueApi?.lights.setLightState(id, state);
    res.statusCode = 200;
    res.json({ status: "OK" });
  } catch (e) {
    console.log(e);
    res.statusCode = 500;
    res.json({ status: "ERROR" });
  }
};
