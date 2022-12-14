import { Layout } from "antd";
import Logo from "../../elements/Logo/Logo";
import HeaderNav from "./HeaderNav/HeaderNav";
import UserMenu from "./UserMenu/UserMenu";

const Header = () => (
  <Layout.Header
    style={{
      background: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Logo />
    <HeaderNav />
    <UserMenu />
  </Layout.Header>
);

export default Header;
