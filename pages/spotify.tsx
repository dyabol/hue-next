import { Button } from "antd";
import React, { useEffect, useState } from "react";
import HueVisualizer from "../utils/classes/hue";
import { auth } from "../utils/classes/sync";

const Spotify = () => {
  const [hue, setHue] = useState(null);
  const spotifyAuth = () => {
    auth();
  };
  const spotifyStart = () => {
    if (hue === null) {
      const hue = new HueVisualizer({});
      setHue(hue);
    }
  };
  return (
    <div>
      Spotify <Button onClick={spotifyAuth}>Auth</Button>
      <Button onClick={spotifyStart}>Start</Button>
      <div
        id="test"
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: 50,
          height: 50,
          background: "red",
          transition: "width 150ms, background 1000ms",
        }}
      />
    </div>
  );
};

export default Spotify;
