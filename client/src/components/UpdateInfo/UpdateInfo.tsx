import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ERROR_MESSAGES, PATHS, PLACEHOLDERS, SUCCESS_MESSAGES } from "../../constants";
import useAppSelector from "../../redux/hooks/useAppSelector";
import { useUpdateInfoMutation } from "../../redux/store/api/apiSlice";

type FormValues = {
  username: string;
  email: string;
  bio: string;
};

const { useForm, Item } = Form;

const { SOMETHING_WENT_WRONG, INVALID_EMAIL, USERNAME_REQUIRED, EMAIL_REQUIRED, NO_CHANGES } = ERROR_MESSAGES;

const UpdateInfo = () => {
  const [updateInfo, { isError, isLoading, isSuccess }] = useUpdateInfoMutation();
  const { username, email, bio } = useAppSelector((state) => state.USER);
  const [form] = useForm();
  const navigate = useNavigate();
  form.setFieldsValue({ username, email, bio });

  const onFinish = ({ username: name, email: mail, bio: info }: FormValues) => {
    const isSameName = username === name;
    const isSameEmail = email === mail;
    const isSameBio = bio === info;
    if (isSameBio && isSameEmail && isSameName) {
      message.info(NO_CHANGES);
      return;
    }

    updateInfo({ username: name, email: mail, bio: info });
  };

  useEffect(() => {
    if (isError) {
      message.error(SOMETHING_WENT_WRONG);
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      message.success(SUCCESS_MESSAGES.INFO_UPDATED);
      navigate(PATHS.SETTINGS, { replace: true });
    }
  }, [isSuccess]);

  return (
    <Card
      title="Update info"
      style={{
        maxWidth: "500px",
        width: "100%",
      }}
    >
      <Form form={form} onFinish={onFinish} name="Twitler" scrollToFirstError>
        <Item name="username" rules={[{ required: true, message: USERNAME_REQUIRED, whitespace: true }]}>
          <Input prefix={<UserOutlined style={{ color: "#BDBDBD" }} />} placeholder={PLACEHOLDERS.USERNAME} />
        </Item>
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
        <Item name="bio" rules={[{ whitespace: true }]}>
          <Input.TextArea placeholder={PLACEHOLDERS.BIO} />
        </Item>
        <Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }} loading={isLoading}>
            Update
          </Button>
        </Item>
      </Form>
    </Card>
  );
};

export default UpdateInfo;
