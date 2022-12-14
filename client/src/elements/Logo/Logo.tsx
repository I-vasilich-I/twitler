import { Row, Typography } from "antd";

const Logo = () => (
  <Row style={{ alignItems: "center", gap: "10px", justifyContent: "center", minWidth: "105px", flexWrap: "nowrap" }}>
    <img src="/apple-touch-icon.png" alt="twitler" height={32} width={32} />
    <Typography.Title level={1} style={{ fontSize: "20px", margin: 0 }}>
      Twitler
    </Typography.Title>
  </Row>
);

export default Logo;
