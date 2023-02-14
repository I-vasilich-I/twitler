import AuthForm from "../components/AuthForm/AuthForm";
import useAuthRedirect from "../hooks/useAuthRedirect";

const SignIn = () => {
  useAuthRedirect();

  return <AuthForm />;
};

export default SignIn;
