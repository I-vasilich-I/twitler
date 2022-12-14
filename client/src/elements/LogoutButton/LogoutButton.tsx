import { Typography } from "antd";
import { useLazyLogoutQuery } from "../../redux/store/api/apiSlice";

const LogoutButton = () => {
  const [logout] = useLazyLogoutQuery();
  const handleClick = () => {
    logout(null);
  };

  return (
    <Typography.Text onClick={handleClick} style={{ color: "#FF0000" }}>
      Logout
    </Typography.Text>
  );
};

export default LogoutButton;
