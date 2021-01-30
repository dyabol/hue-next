import React from "react";
import iro from "@jaames/iro";

type LayoutSetings = { color: any; kelvin: any };

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

type Props = {
  onColorChange?: (value: iro.Color) => void;
  color?: string;
  layout?: keyof LayoutSetings;
};

class IroColorPicker extends React.Component<Props> {
  el: HTMLDivElement;
  colorPicker: iro.ColorPicker;

  componentDidMount() {
    //@ts-ignore
    this.colorPicker = new iro.ColorPicker(this.el, {
      layout: layoutSetting[this.props.layout],
      width: 250,
      height: 250,
      //layoutDirection: "horizontal",
    });
    this.colorPicker.on("input:end", (color: any) => {
      this.props?.onColorChange(color);
    });
  }

  componentWillUnmount() {
    while (this.el?.firstChild) {
      this.el.firstChild.remove();
    }
  }

  componentDidUpdate() {
    // isolate color from the rest of the props
    const {
      color,
      onColorChange,
      layout,
      children,
      ...colorPickerState
    } = this.props;
    // update color
    if (color) this.colorPicker.color.set(color);
    // push rest of the component props to the colorPicker's state
    this.colorPicker.setState(colorPickerState);
    this.colorPicker.on("input:end", (color: any) => {
      this.props?.onColorChange(color);
    });
  }

  render() {
    return <div className="color-picker" ref={(el) => (this.el = el)} />;
  }
}

export default IroColorPicker;
