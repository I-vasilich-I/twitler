import { Button, Card, Form, Input, message, Row, Typography } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthMutation } from "../../redux/store/api/apiSlice";
import Logo from "../../elements/Logo/Logo";
import { APIS, PATHS, ERROR_MESSAGES, PLACEHOLDERS } from "../../constants";
import { IAuthData } from "../../types";

const { useForm, Item } = Form;
const { Paragraph } = Typography;
const { SIGN_IN, SIGN_UP, HOME } = PATHS;
const { SIGN_UP: SIGN_UP_API, SIGN_IN: SIGN_IN_API } = APIS;
const {
  SOMETHING_WENT_WRONG,
  INVALID_EMAIL,
  EMAIL_REQUIRED,
  PASSWORD_REQUIRED,
  CONFIRM_PASSWORD,
  PASSWORDS_NOT_MATCH,
  USERNAME_REQUIRED,
} = ERROR_MESSAGES;

const AuthForm = () => {
  const [form] = useForm();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sign, { isLoading }] = useAuthMutation();
  const isSignIn = pathname === SIGN_IN;
  const buttonText = !isSignIn ? "Sign up" : "Sign in";
  const linkInfo = {
    link: isSignIn ? SIGN_UP : SIGN_IN,
    placeholder: isSignIn ? "Sign up" : "Sign in",
    text: isSignIn ? "Don't have an account?" : "Have an account?",
  };

  const url = isSignIn ? SIGN_IN_API : SIGN_UP_API;

  const onFinish = async ({ username, password, email }: IAuthData) => {
    const data: IAuthData = isSignIn ? { email, password } : { username, password, email };

    try {
      await sign({ data, url }).unwrap();
      navigate(HOME, { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(SOMETHING_WENT_WRONG);
    }
  };

  return (
    <Card
      style={{
        maxWidth: "405px",
        width: "100%",
        border: "1px solid #BDBDBD",
        borderRadius: "15px",
        margin: "10vh auto 0",
      }}
    >
      <Row justify="center" style={{ marginBottom: "50px" }}>
        <Logo />
      </Row>
      <Form form={form} onFinish={onFinish} name="Twitler" scrollToFirstError>
        {!isSignIn ? (
          <Item name="username" rules={[{ required: true, message: USERNAME_REQUIRED, whitespace: true }]}>
            <Input prefix={<UserOutlined style={{ color: "#BDBDBD" }} />} placeholder={PLACEHOLDERS.USERNAME} />
          </Item>
        ) : null}

        <Item
          name="email"
          rules={[
            {
              type: "email",
              message: INVALID_EMAIL,
            },
            {
              required: true,
              message: EMAIL_REQUIRED,
            },
          ]}
        >
          <Input prefix={<MailOutlined style={{ color: "#BDBDBD" }} />} placeholder={PLACEHOLDERS.EMAIL} />
        </Item>

        <Item
          name="password"
          rules={[
            {
              required: true,
              message: PASSWORD_REQUIRED,
            },
          ]}
          hasFeedback={!isSignIn}
        >
          <Input.Password prefix={<LockOutlined style={{ color: "#BDBDBD" }} />} placeholder={PLACEHOLDERS.PASSWORD} />
        </Item>

        {!isSignIn ? (
          <Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: CONFIRM_PASSWORD,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(PASSWORDS_NOT_MATCH));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#BDBDBD" }} />}
              placeholder={PLACEHOLDERS.CONFIRM_PASSWORD}
            />
          </Item>
        ) : null}

        <Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }} disabled={isLoading}>
            {buttonText}
          </Button>
        </Item>
      </Form>
      <Paragraph style={{ textAlign: "center" }}>
        {linkInfo.text}{" "}
        <Link to={linkInfo.link} style={{ color: "#0085FF" }}>
          {linkInfo.placeholder}
        </Link>
      </Paragraph>
    </Card>
  );
};

export default AuthForm;
