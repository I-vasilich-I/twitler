import { Layout, MenuProps } from "antd";
import { Link } from "react-router-dom";
import SettingsCard from "../components/SettingsCard/SettingsCard";
import SubNav from "../components/SubNav/SubNav";
import { PATHS } from "../constants";

const { SETTINGS, UPDATE_INFO, UPDATE_AVATAR, UPDATE_PASSWORD } = PATHS;

const items: MenuProps["items"] = [
  {
    label: <Link to={SETTINGS}>View user</Link>,
    key: "view_info",
  },
  {
    label: <Link to={UPDATE_AVATAR}>Update avatar</Link>,
    key: "update_avatar",
  },
  {
    label: <Link to={UPDATE_INFO}>Update info</Link>,
    key: "update_info",
  },
  {
    label: <Link to={UPDATE_PASSWORD}>Update password</Link>,
    key: "update_password",
  },
];

const Settings = () => (
  <Layout
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
    }}
  >
    <SubNav items={items} />
    <SettingsCard />
  </Layout>
);

export default Settings;
