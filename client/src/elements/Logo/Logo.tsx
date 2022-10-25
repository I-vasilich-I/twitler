import { Image, Row, Typography } from "antd";

const Logo = () => (
  <Row style={{ alignItems: "center", gap: "10px", justifyContent: "center" }}>
    <Image preview={false} src="/apple-touch-icon.png" alt="twitler" height={32} width={32} />
    <Typography.Title level={1} style={{ fontSize: "20px", margin: 0 }}>
      Twitler
    </Typography.Title>
  </Row>
);

export default Logo;
