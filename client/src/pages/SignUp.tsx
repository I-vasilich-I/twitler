import AuthForm from "../components/AuthForm/AuthForm";
import useAuthRedirect from "../hooks/useAuthRedirect";

const SignUp = () => {
  useAuthRedirect();

  return <AuthForm />;
};

export default SignUp;
