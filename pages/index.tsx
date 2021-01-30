import { Form, Spin, Switch, Tabs } from "antd";
import Head from "next/head";
import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import iro from "@jaames/iro";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
import IroColorPicker from "./components/IroColorPicker";
config.autoAddCss = false;

export default function Home() {
  const [loading, setLoading] = useState(false);

  const hueFetch = async (url: string) => {
    try {
      setLoading(true);
      const res = await fetch(url);
      await res.json();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onColorChnageHandler = (color: iro.Color) => {
    hueFetch(
      `/api/color?hue=${color.hsl.h}&saturation=${color.hsl.s}&lightnes=${color.hsl.l}&brightness=${color.value}`
    );
  };

  const switchHandler = (checked: boolean) => {
    if (checked) {
      hueFetch("/api/on");
    } else {
      hueFetch("/api/off");
    }
  };

  const colorTeperatureHandler = (color: iro.Color) => {
    const bried = Math.round(
      1000000 /
        (color.kelvin < 6500 && color.kelvin > 2000 ? color.kelvin : 2000)
    );
    hueFetch(`/api/white?bried=${bried}&brightness=${color.value}`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Hue next</title>
        <link rel="icon" href="/favicon.ico" />
        <style>{dom.css()}</style>
      </Head>
      <Spin spinning={loading}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item label="Vyp./Zap.">
            <Switch defaultChecked onChange={switchHandler} />
          </Form.Item>
        </Form>
        <Tabs defaultActiveKey="1">
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
