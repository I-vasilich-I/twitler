import useAppSelector from "../redux/hooks/useAppSelector";
import { useGetUserInfoQuery } from "../redux/store/api/apiSlice";

const useUserInfo = (userId?: string) => {
  const { id } = useAppSelector((state) => state.USER);
  const data = useGetUserInfoQuery(userId ?? id);

  return data;
};

export default useUserInfo;
