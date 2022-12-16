import { CommentOutlined } from "@ant-design/icons";
import { message, Button, FormInstance } from "antd";
import { useEffect } from "react";
import { ERROR_MESSAGES } from "../../../../constants";
import { useCreateCommentMutation } from "../../../../redux/store/api/apiSlice";

type Props = {
  tweetId: number;
  form: FormInstance;
};

const CommentButton = ({ form, tweetId }: Props) => {
  const [createComment, { isLoading, isError, isSuccess }] = useCreateCommentMutation();

  const handleCommentClick = () => {
    const commentText = form.getFieldValue("comment");
    const commentImage = form.getFieldValue("image");
    const isCommentEmpty = !commentImage && !commentText;

    if (isCommentEmpty) {
      message.error(ERROR_MESSAGES.EMPTY_COMMENT);
      return;
    }

    const formData = new FormData();

    if (commentImage) {
      formData.append("image", commentImage);
    }

    if (commentText) {
      formData.append("text", commentText);
    }

    createComment({ tweetId, data: formData });
  };

  useEffect(() => {
    if (isError) {
      message.error(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
    }
  }, [isSuccess]);

  return (
    <Button
      type="text"
      icon={<CommentOutlined />}
      onClick={handleCommentClick}
      loading={isLoading}
      style={{ color: "#4F4F4F" }}
    >
      Comment
    </Button>
  );
};

export default CommentButton;
