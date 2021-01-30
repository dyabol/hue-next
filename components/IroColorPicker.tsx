import React, { useEffect, useRef, useState } from "react";
import iro from "@jaames/iro";

type LayoutSetings = { color: any; kelvin: any };

type RGB = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type Props = {
  onColorChange?: (value: iro.Color) => void;
  color?: RGB;
  layout?: keyof LayoutSetings;
};

const layoutSetting: LayoutSetings = {
  kelvin: [
    {
      component: iro.ui.Slider,
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: "kelvin",
        sliderShape: "circle",
        minTemperature: 2000,
        maxTemperature: 6500,
      },
    },
  ],
  color: [
    {
      component: iro.ui.Slider,
    },
    {
      component: iro.ui.Wheel,
    },
  ],
};

const IroColorPicker: React.FC<Props> = ({
  layout = "color",
  color,
  onColorChange,
  ...props
}) => {
  const ref = useRef(null);
  const [colorPicker, setColorPicker] = useState<any>(null);

  useEffect(() => {
    // @ts-ignore
    const colorPicker = new iro.ColorPicker(ref.current, {
      layout: layoutSetting[layout],
      width: 250,
      height: 250,
      //layoutDirection: "horizontal",
    });
    colorPicker.on("input:end", (color: any) => {
      onColorChange(color);
    });
    setColorPicker(colorPicker);
    return () => {
      colorPicker.base.remove();
    };
  }, []);

  useEffect(() => {
    const hsv = iro.Color.rgbToHsv(color);
    hsv.v = color.a;
    colorPicker?.color.set(hsv);
    colorPicker?.setState(props);
    if (colorPicker) {
      colorPicker.events = {};
    }
    colorPicker?.on("input:end", (color: any) => {
      onColorChange(color);
    });
  }, [color, colorPicker, onColorChange]);

  return <div className="color-picker" ref={ref} />;
};

export default IroColorPicker;
