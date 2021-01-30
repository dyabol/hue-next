import React, { useEffect, useRef, useState } from "react";
import iro from "@jaames/iro";

type LayoutSetings = { color: any; kelvin: any };

type Props = {
  onColorChange?: (value: iro.Color) => void;
  color?: string;
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

const IroColorPicker: React.FC<Props> = ({ layout = "color", ...props }) => {
  const { color } = props;
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
      props?.onColorChange(color);
    });
    setColorPicker(colorPicker);
    return () => {
      colorPicker.base.remove();
    };
  }, []);

  useEffect(() => {
    const { color, ...colorPickerState } = props;
    if (color) colorPicker?.color.set(color);
    colorPicker?.setState(colorPickerState);
  }, [color, colorPicker]);

  return <div className="color-picker" ref={ref} />;
};

export default IroColorPicker;
