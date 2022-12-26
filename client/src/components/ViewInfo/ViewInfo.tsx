import { Avatar, Button, Card, Descriptions, Empty, message, Popconfirm } from "antd";
import { useEffect } from "react";
import { ERROR_MESSAGES, INFO_MESSAGES, SUCCESS_MESSAGES } from "../../constants";
import useAppSelector from "../../redux/hooks/useAppSelector";
import { useDeleteUserMutation } from "../../redux/store/api/apiSlice";

const ViewInfo = () => {
  const { username, bio, email, avatar } = useAppSelector((state) => state.USER);
  const [deleteUser, { isError, isSuccess }] = useDeleteUserMutation();
  const confirm = () => {
    deleteUser(undefined);
  };

  const cancel = () => {
    message.info(INFO_MESSAGES.DELETE_ACCOUNT_ABORT);
  };

  useEffect(() => {
    if (isError) {
      message.error(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      message.success(SUCCESS_MESSAGES.ACCOUNT_DELETED);
    }
  }, [isSuccess]);

  return (
    <Card
      title="User Info"
      style={{ width: "100%", maxWidth: "600px" }}
      bodyStyle={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
    >
      <Descriptions column={1} bordered style={{ width: "100%" }}>
        <Descriptions.Item label="Avatar">
          <Avatar src={avatar} shape="square" size={150} />
        </Descriptions.Item>
        <Descriptions.Item label="User name">{username}</Descriptions.Item>
        <Descriptions.Item label="Email">{email}</Descriptions.Item>
        <Descriptions.Item label="Bio">{bio || <Empty />}</Descriptions.Item>
        <Descriptions.Item label="Delete the account">
          <Popconfirm
            title="Are you sure you want to delete the account?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ViewInfo;
