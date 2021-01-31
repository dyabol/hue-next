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
    </div>
  );
};

export default Spotify;
