import { Avatar, Button, Dropdown, MenuProps } from "antd";
import { Link } from "react-router-dom";
import { PATHS } from "../../../constants";
import LogoutButton from "../../../elements/LogoutButton/LogoutButton";
import useAppSelector from "../../../redux/hooks/useAppSelector";

const items: MenuProps["items"] = [
  {
    label: <Link to={PATHS.PROFILE}>My profile</Link>,
    key: "profile",
  },
  {
    label: <Link to={PATHS.SETTINGS}>Settings</Link>,
    key: "settings",
  },
  {
    type: "divider",
  },
  {
    label: <LogoutButton />,
    key: "logout",
  },
];

const UserMenu = () => {
  const { username, avatar } = useAppSelector((state) => state.USER);

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Button type="dashed" size="large">
        <Avatar size={24} src={avatar} />
        <span style={{ marginLeft: "12px" }}>{username ?? "User"}</span>
      </Button>
    </Dropdown>
  );
};

export default UserMenu;
