import getApi from "../../utils/hueApi";
import {v3}  from 'node-hue-api';
const Light = v3.lightStates.LightState;
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  status: 'OK' | 'ERROR'
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    try {
      //const state = new Light().on(true).hue(req.query.value).sat(100);
      //console.log(req.query.value);
      //const state = new Light().on(true).hsl(req.query.value,50,100);
      //const state = new Light().on(true).hsl(100,50,50);
      const state = new Light().on(true).hsl(parseInt(req.query.h as string, 10), parseInt(req.query.s as string, 10), parseInt(req.query.l as string, 10));
      //const state = new Light().on(true).rgb(req.query.r, req.query.g, req.query.b);
      const hueApi = await getApi();
      await hueApi?.lights.setLightState(1, state);
      res.statusCode = 200
      res.json({ status: 'OK' })
    } catch(e) {
      console.log(e);
      res.statusCode = 500
      res.json({ status: 'ERROR' })
    }
}
