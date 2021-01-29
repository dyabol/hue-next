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
      component: iro.ui.Wheel,
      options: {
        sliderType: "kelvin",
      },
    },
  ],
  color: [
    {
      component: iro.ui.Wheel,
    },
    {
      component: iro.ui.Slider,
    },
  ],
};

const IroColorPicker: React.FC<Props> = ({ layout = "color", ...props }) => {
  const { color } = props;
  const ref = useRef(null);
  const [colorPicker, setColorPicker] = useState<any>();

  useEffect(() => {
    // create a new iro color picker and pass component props to it
    // @ts-ignore
    const colorPicker = new iro.ColorPicker(ref.current, {
      layout: layoutSetting[layout],
    });
    // call onColorChange prop whenever the color changes
    colorPicker.on("input:end", (color: any) => {
      props?.onColorChange(color);
    });
    setColorPicker(colorPicker);
  }, []);

  useEffect(() => {
    // isolate color from the rest of the props
    const { color, ...colorPickerState } = props;
    // update color
    if (color) colorPicker?.color.set(color);
    // push rest of the component props to the colorPicker's state
    colorPicker?.setState(colorPickerState);
  }, [color, colorPicker]);

  return <div ref={ref} />;
};

export default IroColorPicker;
