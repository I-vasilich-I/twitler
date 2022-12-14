import { Layout } from "antd";
import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "../../constants";
import useAppSelector from "../../redux/hooks/useAppSelector";
import Header from "../Header/Header";

const ProtectedRoutes = () => {
  const { email } = useAppSelector((state) => state.USER);

  if (!email) {
    return <Navigate to={PATHS.SIGN_IN} replace />;
  }

  return (
    <>
      <Header />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </>
  );
};

export default ProtectedRoutes;
