import { Row } from "antd";

type Props = {
  text: string;
};

const TweetText = ({ text }: Props) => <Row style={{ marginBottom: "10px" }}>{text}</Row>;

export default TweetText;
