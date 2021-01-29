import { Form, Spin, Switch } from "antd";
import Head from "next/head";
import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import IconSlider from "./components/IconSlider";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLightbulb as fasLightbulb,
  faSun,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";
import iro from "@jaames/iro";
import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
import IroColorPicker from "./components/IroColorPicker";
config.autoAddCss = false;
library.add(fasLightbulb, farLightbulb, faSun, faSnowflake);

export default function Home() {
  const [status, setStatus] = useState("OK");
  const [loading, setLoading] = useState(false);

  const hueFetch = async (url: string) => {
    try {
      setLoading(true);
      const res = await fetch(url);
      await res.json();
      setStatus("OK");
    } catch (e) {
      console.log(e);
      setStatus("ERROR");
    } finally {
      setLoading(false);
    }
  };

  const onColorChnageHandler = (color: iro.Color) => {
    console.log(color.hsl);
    //hueFetch(`/api/hsl?h=${color.hsl.h}&s=${color.hsl.s}&l=${color.hsl.l}`);
  };

  const switchHandler = (checked: boolean) => {
    if (checked) {
      hueFetch("/api/on");
    } else {
      hueFetch("/api/off");
    }
  };

  const colorTeperatureHandler = (value: number) => {
    hueFetch(`/api/ct?value=${value}`);
  };

  const brightnessHandler = (value: number) => {
    hueFetch(`/api/brightness?value=${value}`);
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
          <Form.Item label="Status">{status}</Form.Item>
          <Form.Item label="Vyp./Zap.">
            <Switch defaultChecked onChange={switchHandler} />
          </Form.Item>
          <Form.Item label="Teplota">
            <IconSlider
              defaultValue={30}
              onAfterChange={colorTeperatureHandler}
              min={153}
              max={500}
              minIcon={["fas", "snowflake"]}
              maxIcon={["fas", "sun"]}
              minColor="#2196f3"
              maxColor="#ffc107"
            />
          </Form.Item>
          <Form.Item label="Intenzita">
            <IconSlider
              defaultValue={30}
              onAfterChange={brightnessHandler}
              min={1}
              max={100}
              minIcon={["far", "lightbulb"]}
              maxIcon={["fas", "lightbulb"]}
              maxColor="#ffc107"
            />
          </Form.Item>
          {/* <Form.Item label="Barva">
            <IroColorPicker
              color={"#fff"}
              onColorChange={onColorChnageHandler}
            />
          </Form.Item> */}
        </Form>
      </Spin>
    </div>
  );
}
