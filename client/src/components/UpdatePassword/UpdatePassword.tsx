import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ERROR_MESSAGES, PATHS, PLACEHOLDERS, SUCCESS_MESSAGES } from "../../constants";
import { useUpdatePasswordMutation } from "../../redux/store/api/apiSlice";

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const { Item } = Form;
const { PASSWORD_REQUIRED, NEW_PASSWORD_REQUIRED, CONFIRM_NEW_PASSWORD, PASSWORDS_NOT_MATCH, SHORT_PASSWORD } =
  ERROR_MESSAGES;

const UpdatePassword = () => {
  const [updatePassword, { isLoading, isError, isSuccess }] = useUpdatePasswordMutation();
  const navigate = useNavigate();

  const handleFinish = ({ currentPassword, newPassword }: FormValues) => {
    updatePassword({ oldPassword: currentPassword, newPassword });
  };

  useEffect(() => {
    if (isError) {
      message.error(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      message.success(SUCCESS_MESSAGES.PASSWORD_UPDATED);
      navigate(PATHS.SETTINGS, { replace: true });
    }
  });

  return (
    <Card
      title="Update password"
      style={{ width: "100%", maxWidth: "600px" }}
      bodyStyle={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
    >
      <Form onFinish={handleFinish}>
        <Item
          name="currentPassword"
          rules={[
            {
              required: true,
              message: PASSWORD_REQUIRED,
            },
            {
              min: 8,
              message: SHORT_PASSWORD(8),
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#BDBDBD" }} />}
            placeholder={PLACEHOLDERS.CURRENT_PASSWORD}
          />
        </Item>
        <Item
          name="newPassword"
          rules={[
            {
              required: true,
              message: NEW_PASSWORD_REQUIRED,
            },
            {
              min: 8,
              message: SHORT_PASSWORD(8),
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#BDBDBD" }} />}
            placeholder={PLACEHOLDERS.NEW_PASSWORD}
          />
        </Item>
        <Item
          name="confirmNewPassword"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: CONFIRM_NEW_PASSWORD,
            },
            {
              min: 8,
              message: SHORT_PASSWORD(8),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(PASSWORDS_NOT_MATCH));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#BDBDBD" }} />}
            placeholder={PLACEHOLDERS.CONFIRM_NEW_PASSWORD}
          />
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

export default UpdatePassword;
