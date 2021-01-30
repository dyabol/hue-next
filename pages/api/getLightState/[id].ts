import getApi from "../../../utils/hueApi";
import type { NextApiRequest, NextApiResponse } from "next";
import iro from "@jaames/iro";
import { cie_to_rgb } from "../../../utils/cie_rgb_converter";

type Data = {} | { error: string };

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    query: { id },
    cookies: { hueIpAdress, hueUser },
  } = req;
  try {
    const hueApi = await getApi(hueIpAdress, hueUser);
    const {
      on,
      colormode,
      xy,
      bri,
      ct,
      effect,
    } = (await hueApi?.lights.getLightState(parseInt(id as string, 10))) as any;
    const brightness = Math.round(bri / (254 / 100));
    let rgb = {};
    if (colormode === "ct") {
      rgb = iro.Color.kelvinToRgb(Math.round(1000000 / ct));
    } else {
      const ar = cie_to_rgb(xy[0], xy[1], undefined);
      rgb = { r: ar[0], g: ar[1], b: ar[2] };
    }
    res.statusCode = 200;
    res.json({
      on,
      colormode,
      ...rgb,
      bri,
      brightness,
      loop: effect === "colorloop",
    });
  } catch (e) {
    console.log(e);
    res.statusCode = 500;
    res.json({ error: e.message });
  }
};
