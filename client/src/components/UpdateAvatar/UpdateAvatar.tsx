import { Button, Card, Descriptions, Form, message, Popconfirm, UploadFile } from "antd";
import { useEffect, useState } from "react";
import { INFO_MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants";
import UploadImg from "../../elements/UploadImg/UploadImg";
import useAppSelector from "../../redux/hooks/useAppSelector";
import { useRemoveAvatarMutation, useUpdateAvatarMutation } from "../../redux/store/api/apiSlice";

const UpdateAvatar = () => {
  const { avatar } = useAppSelector((state) => state.USER);
  const [removeAvatar, { isError, isLoading, isSuccess }] = useRemoveAvatarMutation();
  const [updateAvatar, { isError: isUpdateError, isLoading: isUpdateLoading, isSuccess: isUpdateSuccess }] =
    useUpdateAvatarMutation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const isImageSelected = Boolean(fileList.length);

  const handleUpdate = () => {
    if (!isImageSelected) {
      return;
    }

    const avatarImage = form.getFieldValue("avatar");
    const formData = new FormData();
    formData.append("avatar", avatarImage);
    updateAvatar(formData);
  };

  const confirm = () => {
    if (!avatar) {
      return;
    }

    removeAvatar(undefined);
  };

  const cancel = () => {
    message.info(INFO_MESSAGES.REMOVE_AVATAR_ABORT);
  };

  useEffect(() => {
    if (isError || isUpdateError) {
      message.error(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }, [isError, isUpdateError]);

  useEffect(() => {
    if (isSuccess) {
      message.success(SUCCESS_MESSAGES.AVATAR_REMOVED);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isUpdateSuccess) {
      form.resetFields();
      setFileList([]);
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    form.setFieldValue("avatar", fileList[0]);
  }, [fileList]);

  return (
    <Card
      title="Update avatar"
      style={{ width: "100%", maxWidth: "600px" }}
      bodyStyle={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
    >
      <Descriptions column={1} bordered style={{ width: "100%" }}>
        <Descriptions.Item label="Select a new avatar image">
          <Form form={form} layout="inline">
            <Form.Item name="avatar">
              <UploadImg fileList={fileList} setFileList={setFileList} />
            </Form.Item>
            <Button type="primary" disabled={!isImageSelected} onClick={handleUpdate} loading={isUpdateLoading}>
              Update
            </Button>
          </Form>
        </Descriptions.Item>
        <Descriptions.Item label="Remove avatar image">
          <Popconfirm
            title="Are you sure you want to remove avatar image?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
            disabled={!avatar}
          >
            <Button type="primary" danger disabled={!avatar} loading={isLoading}>
              Remove avatar
            </Button>
          </Popconfirm>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default UpdateAvatar;
