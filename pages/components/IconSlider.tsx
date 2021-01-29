import { Slider } from "antd";
import React from "react";
import { SliderSingleProps } from "antd/lib/slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type Props = {
  minIcon: IconProp;
  maxIcon: IconProp;
  minColor?: string;
  maxColor?: string;
} & SliderSingleProps;

const IconSlider: React.FC<Props> = ({
  minColor = "rgba(0, 0, 0, 0.25)",
  maxColor = "rgba(0, 0, 0, 0.25)",
  minIcon,
  maxIcon,
  ...props
}) => {
  return (
    <div className="icon-wrapper">
      <FontAwesomeIcon className="faicon" icon={minIcon} color={minColor} />
      <Slider {...props} />
      <FontAwesomeIcon className="faicon" icon={maxIcon} color={maxColor} />
    </div>
  );
};

export default IconSlider;
