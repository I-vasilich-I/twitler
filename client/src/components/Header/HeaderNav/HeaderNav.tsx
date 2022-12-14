import type { MenuProps } from "antd";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { PATHS } from "../../../constants";

const items: MenuProps["items"] = [
  {
    label: <Link to={PATHS.HOME}>Home</Link>,
    key: "home",
  },
  {
    label: <Link to={PATHS.EXPLORE}>Explore</Link>,
    key: "explore",
  },
  {
    label: <Link to={PATHS.BOOKMARKS}>Bookmarks</Link>,
    key: "bookmarks",
  },
];

const HeaderNav = () => <Menu mode="horizontal" items={items} />;

export default HeaderNav;
