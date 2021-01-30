import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import iro from "@jaames/iro";
import IroColorPicker from "../components/IroColorPicker";
import Spin from "antd/lib/spin";
import Form from "antd/lib/form";
import Switch from "antd/lib/switch";
import Tabs from "antd/lib/tabs";
import useFetch from "../utils/hooks/useFetch";
import Select from "antd/lib/select";
import { useRouter } from "next/router";
import Button from "antd/lib/button";
import Alert from "antd/lib/alert";
import { useCookies } from "react-cookie";

type RGB = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export default function Home() {
  const [on, setOn] = useState(true);
  const [colorMode, setColorMode] = useState<string>("xy");
  const [rgb, setRgb] = useState<RGB>({ r: 255, g: 255, b: 255, a: 100 });
  const [ctv, setCtv] = useState<RGB>({ r: 255, g: 255, b: 255, a: 100 });
  const [cookies, setCookie, removeCookie] = useCookies([
    "hueIpAdress",
    "hueUser",
  ]);
  const { fetch, loading, error } = useFetch();
  const [lights, setLights] = useState<any[]>();
  const [selectedLight, setSelectedLight] = useState<number>();
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      if (!cookies["hueIpAdress"] || !cookies["hueUser"]) {
        await router.push("/discovery");
      }
    };

    const fetchLights = async () => {
      const l = await fetch("/api/getLights");
      setLights(l?.data);
      onLightsSelectChange(l?.data[0]?._data.id);
    };
    redirect();
    fetchLights();
  }, []);

  const onColorChnageHandler = useCallback(
    ({ rgb, value }: iro.Color) => {
      setRgb({ a: value, ...rgb });
      fetch(
        `/api/color/${selectedLight}?red=${rgb.r}&green=${rgb.g}&blue=${rgb.b}&brightness=${value}`
      );
    },
    [selectedLight]
  );

  const switchHandler = (checked: boolean) => {
    setOn(checked);
    if (checked) {
      fetch(`/api/on/${selectedLight}`);
    } else {
      fetch(`/api/off/${selectedLight}`);
    }
  };

  const colorTeperatureHandler = useCallback(
    ({ rgb, value, kelvin }: iro.Color) => {
      setRgb({ a: value, ...rgb });
      fetch(`/api/white/${selectedLight}?kelvin=${kelvin}&brightness=${value}`);
    },
    [selectedLight]
  );

  const onLightsSelectChange = (value: any) => {
    setSelectedLight(value);
    setDefaultValues(value);
  };

  const setDefaultValues = async (lightId: number) => {
    const { on, colormode, r, g, b, brightness } = await fetch(
      `/api/getLightState/${lightId}`
    );
    setOn(on);
    setColorMode(colormode);
    if (colormode === "ct") {
      setCtv({ r, g, b, a: brightness });
    } else {
      setRgb({ r, g, b, a: brightness });
    }
  };

  const disconnectBridge = () => {
    removeCookie("hueIpAdress");
    removeCookie("hueUser");
    router.push("/discovery");
  };

  return (
    <div>
      <Head>
        <title>Hue next</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Spin spinning={loading}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          {error && (
            <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
              <Alert message={error} type="error" showIcon />
            </Form.Item>
          )}
          <Form.Item label="Bridge">
            <Button onClick={disconnectBridge}>Disconnect</Button>
          </Form.Item>
          <Form.Item label="Light">
            <Select
              value={selectedLight}
              style={{ width: 120 }}
              onChange={onLightsSelectChange}
            >
              {lights?.map((light, key) => (
                <Select.Option key={key} value={light._data.id}>
                  {light._data.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Off/On">
            <Switch checked={on} onChange={switchHandler} />
          </Form.Item>
        </Form>
        <Tabs activeKey={colorMode} onChange={setColorMode}>
          <Tabs.TabPane tab="Color" key="xy">
            <IroColorPicker color={rgb} onColorChange={onColorChnageHandler} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="White" key="ct">
            <IroColorPicker
              color={ctv}
              layout="kelvin"
              onColorChange={colorTeperatureHandler}
            />
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    </div>
  );
}
