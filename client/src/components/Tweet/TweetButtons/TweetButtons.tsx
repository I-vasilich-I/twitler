import { Divider, FormInstance, Row } from "antd";
import { ReactionButtonTypes } from "../../../types";
import CommentButton from "./CommentButton/CommentButton";
import ReactionButton from "./ReactionButton/ReactionButton";

type Props = {
  hasMyRetweet: boolean;
  hasMyLike: boolean;
  hasMyBookmark: boolean;
  tweetId: number;
  form: FormInstance;
};

const TweetButtons = ({ hasMyRetweet, hasMyLike, hasMyBookmark, form, tweetId }: Props) => (
  <>
    <Divider style={{ margin: "0 0 5px 0" }} />
    <Row
      style={{
        maxWidth: "540px",
        width: "100%",
        alignSelf: "center",
        justifyContent: "space-between",
      }}
    >
      <CommentButton form={form} tweetId={tweetId} />
      <ReactionButton type={ReactionButtonTypes.RETWEET} hasMyReaction={hasMyRetweet} tweetId={tweetId} />
      <ReactionButton type={ReactionButtonTypes.LIKE} hasMyReaction={hasMyLike} tweetId={tweetId} />
      <ReactionButton type={ReactionButtonTypes.SAVE} hasMyReaction={hasMyBookmark} tweetId={tweetId} />
    </Row>
    <Divider style={{ margin: "5px 0" }} />
  </>
);

export default TweetButtons;
