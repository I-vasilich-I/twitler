import { useEffect } from "react";
import { TWITLER_TOKEN_KEY } from "../constants";
import useAppSelector from "../redux/hooks/useAppSelector";
import { useLazyCheckAuthQuery } from "../redux/store/api/apiSlice";

const useCheckAuth = () => {
  const { email } = useAppSelector((state) => state.USER);
  const [checkAuth, { isLoading }] = useLazyCheckAuthQuery();
  const token = localStorage.getItem(TWITLER_TOKEN_KEY);

  useEffect(() => {
    if (!email && token) {
      checkAuth(null);
    }
  }, [email]);

  return { isLoading };
};

export default useCheckAuth;
