import { useLocation } from "react-router-dom";
import { PATHS } from "../../constants";
import UpdateAvatar from "../UpdateAvatar/UpdateAvatar";
import UpdateInfo from "../UpdateInfo/UpdateInfo";
import UpdatePassword from "../UpdatePassword/UpdatePassword";
import ViewInfo from "../ViewInfo/ViewInfo";

const { SETTINGS, UPDATE_INFO, UPDATE_AVATAR, UPDATE_PASSWORD } = PATHS;

const SettingsCard = () => {
  const { pathname } = useLocation();

  switch (pathname) {
    case SETTINGS:
      return <ViewInfo />;
    case UPDATE_PASSWORD:
      return <UpdatePassword />;
    case UPDATE_AVATAR:
      return <UpdateAvatar />;
    case UPDATE_INFO:
      return <UpdateInfo />;
    default:
      return null;
  }
};

export default SettingsCard;
