import { Layout } from "antd";
import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "../../constants";
import useAppSelector from "../../redux/hooks/useAppSelector";

const ProtectedRoutes = () => {
  const { email } = useAppSelector((state) => state.USER);

  if (!email) {
    return <Navigate to={PATHS.SIGN_IN} replace />;
  }

  return (
    <>
      <Layout.Header style={{ background: "#FFFFFF" }}>
        <div>Header</div>
      </Layout.Header>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </>
  );
};

export default ProtectedRoutes;
