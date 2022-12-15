import { HeartOutlined } from "@ant-design/icons";
import { Card, Row, Col, Avatar, Button, Image } from "antd";
import { formatTimestamp } from "../../../../helpers";
import { useLikeCommentMutation } from "../../../../redux/store/api/apiSlice";
import { IComment } from "../../../../types";

const Comment = ({ id, avatar, username, timestamp, text, imageLink, hasMyLike, likes, loading = false }: IComment) => {
  const [likeComment, { isLoading }] = useLikeCommentMutation();
  const date = formatTimestamp(timestamp);
  const likeColor = hasMyLike ? "#EB5757" : "#B3B3B3";

  const handleLikeClick = () => {
    likeComment({ commentId: id, like: !hasMyLike });
  };

  return (
    <Card style={{ width: "100%" }} bodyStyle={{ padding: "5px" }} bordered={false} loading={loading}>
      <Row style={{ gap: "5px", flexWrap: "nowrap" }}>
        <Col style={{ width: "45px", padding: "5px 0" }}>
          <Avatar shape="square" src={avatar} />
        </Col>
        <Col style={{ padding: "5px 12px" }}>
          <Row style={{ alignItems: "baseline" }}>
            <>
              <span style={{ marginRight: "10px", fontWeight: 700, fontSize: "16px", lineHeight: "19px" }}>
                {username}
              </span>
              <span style={{ fontWeight: 300, fontSize: "12px", lineHeight: "15px", color: "#000000" }}>{date}</span>
            </>
          </Row>
          <Row>{text}</Row>
          {imageLink ? <Image src={imageLink} /> : null}
        </Col>
      </Row>
      <Row style={{ alignItems: "baseline", gap: "10px", paddingInline: "45px" }}>
        <Button
          type="text"
          icon={<HeartOutlined color={likeColor} />}
          style={{ fontWeight: 400, fontSize: "14px", lineHeight: "17px", color: likeColor }}
          loading={isLoading}
          onClick={handleLikeClick}
        >
          {hasMyLike ? "Liked" : "Like"}
        </Button>
        <span style={{ fontWeight: 400, fontSize: "14px", lineHeight: "17px", color: "#B3B3B3" }}>{likes} Likes</span>
      </Row>
    </Card>
  );
};

export default Comment;
