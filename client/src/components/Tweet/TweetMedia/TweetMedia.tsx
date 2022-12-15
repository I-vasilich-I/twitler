import { Image } from "antd";

type Props = {
  src: string | null;
};

const TweetMedia = ({ src }: Props) => (src ? <Image src={src} /> : null);

export default TweetMedia;
