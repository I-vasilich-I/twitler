import { FormInstance, Row } from "antd";
import { useGetCommentsQuery } from "../../../redux/store/api/apiSlice";
import CommentForm from "./CommentForm/CommentForm";
import Comment from "./Comment/Comment";

type Props = {
  tweetId: number;
  form: FormInstance;
};

const TweetComments = ({ form, tweetId }: Props) => {
  const { data: comments = [] } = useGetCommentsQuery(tweetId);

  return (
    <Row style={{ gap: "5px" }}>
      <CommentForm form={form} />
      {comments.map((commentProps) => (
        <Comment key={commentProps.id} {...commentProps} />
      ))}
    </Row>
  );
};

export default TweetComments;
