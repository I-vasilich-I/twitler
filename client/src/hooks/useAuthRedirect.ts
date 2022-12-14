import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "../constants";
import useAppSelector from "../redux/hooks/useAppSelector";

const useAuthRedirect = () => {
  const { email } = useAppSelector((state) => state.USER);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      if (location.state?.from) {
        navigate(location.state.from, { replace: true });
        return;
      }

      navigate(PATHS.HOME, { replace: true });
    }
  }, [email]);
};

export default useAuthRedirect;
