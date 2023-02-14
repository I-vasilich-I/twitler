import type { MenuProps } from "antd";
import { Menu } from "antd";

type Props = {
  items: MenuProps["items"];
};

const SubNav = ({ items }: Props) => (
  <Menu
    mode="horizontal"
    items={items}
    style={{ width: "100%", maxWidth: "825px", display: "flex", justifyContent: "center" }}
  />
);

export default SubNav;
