import Button from "antd/lib/button";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Alert from "antd/lib/alert";
import Form from "antd/lib/form";
import Input from "antd/lib/input/Input";
import useFetch from "../utils/hooks/useFetch";
import Spin from "antd/lib/spin";
import { useCookies } from "react-cookie";

const Discovery = () => {
  const [appName, setAppName] = useState("hue-next");
  const [deviceName, setDeviceName] = useState("My PC");
  const router = useRouter();
  const { fetch, loading, error } = useFetch();
  const [cookies, setCookie, removeCookie] = useCookies([
    "hueIpAdress",
    "hueUser",
  ]);

  const appNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAppName(event.target.value);
  };

  const deviceNameChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeviceName(event.target.value);
  };

  const onClickHandler = async () => {
    const info = await fetch(
      `/api/discovery?appName=${appName}&deviceName=${deviceName}`
    );
    if (info) {
      setCookie("hueIpAdress", info.ipAddress);
      setCookie("hueUser", info.username);
      router.push("/");
    }
  };

  return (
    <Spin spinning={loading}>
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
        {error && (
          <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
            <Alert message={error} type="error" showIcon />
          </Form.Item>
        )}
        <Form.Item label="App name" required={true}>
          <Input
            required={true}
            onChange={appNameChangeHandler}
            value={appName}
          />
        </Form.Item>
        <Form.Item label="Device name" required={true}>
          <Input
            required={true}
            onChange={deviceNameChangeHandler}
            value={deviceName}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
          Please push the Hue Bridge button and click search.
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
          <Button type="primary" onClick={onClickHandler}>
            Search
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default Discovery;
