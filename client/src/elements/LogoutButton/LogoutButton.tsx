import { Typography } from "antd";
import { useLogoutMutation } from "../../redux/store/api/apiSlice";

const LogoutButton = () => {
  const [logout] = useLogoutMutation();
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
