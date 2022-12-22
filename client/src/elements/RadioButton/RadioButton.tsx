/* eslint-disable @typescript-eslint/no-explicit-any */
import { Radio } from "antd";

type Props = {
  value: any;
  title?: any;
};

const RadioButton = ({ value, title }: Props) => (
  <Radio.Button value={value}>
    <span style={{ textTransform: "capitalize" }}>{title ?? value}</span>
  </Radio.Button>
);

export default RadioButton;
