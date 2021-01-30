import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import iro from "@jaames/iro";
import IroColorPicker from "./components/IroColorPicker";
import Spin from "antd/lib/spin";
import Form from "antd/lib/form";
import Switch from "antd/lib/switch";
import Tabs from "antd/lib/tabs";
import useFetch from "../utils/hooks/useFetch";
import Select from "antd/lib/select";

export default function Home() {
  const { fetch, loading } = useFetch();
  const [lights, setLights] = useState<any[]>();
  const [selectedLight, setSelectedLight] = useState<number>();

  useEffect(() => {
    const fetchLights = async () => {
      const l = await fetch("/api/getLights");
      setLights(l.data);
      setSelectedLight(l?.data[0]?._data.id);
    };
    fetchLights();
  }, []);

  const onColorChnageHandler = useCallback(
    (color: iro.Color) => {
      fetch(
        `/api/color/${selectedLight}?hue=${color.hsv.h}&saturation=${color.hsv.s}&brightness=${color.hsv.v}`
      );
    },
    [selectedLight]
  );

  const switchHandler = (checked: boolean) => {
    if (checked) {
      fetch(`/api/on/${selectedLight}`);
    } else {
      fetch(`/api/off/${selectedLight}`);
    }
  };

  const colorTeperatureHandler = useCallback(
    (color: iro.Color) => {
      const bried = Math.round(
        1000000 /
          (color.kelvin < 6500 && color.kelvin > 2000 ? color.kelvin : 2000)
      );
      fetch(
        `/api/white/${selectedLight}?bried=${bried}&brightness=${color.value}`
      );
    },
    [selectedLight]
  );

  const onLightsSelectChange = (value: any) => {
    setSelectedLight(value);
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
          <Form.Item label="Světlo">
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
          <Form.Item label="Vyp./Zap.">
            <Switch defaultChecked onChange={switchHandler} />
          </Form.Item>
        </Form>
        <Tabs defaultActiveKey="2">
          <Tabs.TabPane tab="Barva" key="1">
            <IroColorPicker
              color={"#fff"}
              onColorChange={onColorChnageHandler}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Bílá" key="2">
            <IroColorPicker
              color={"#fff"}
              layout="kelvin"
              onColorChange={colorTeperatureHandler}
            />
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    </div>
  );
}
