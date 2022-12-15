import { GlobalOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Divider, Form, Input, message, Radio, Row, UploadFile } from "antd";
import { useEffect, useState } from "react";
import { ERROR_MESSAGES } from "../../constants";
import UploadImg from "../../elements/UploadImg/UploadImg";
import useAppSelector from "../../redux/hooks/useAppSelector";
import { useCreateTweetMutation } from "../../redux/store/api/apiSlice";

const enum Visibility {
  PUBLIC,
  PRIVATE,
}

const TweetForm = () => {
  const { avatar } = useAppSelector((state) => state.USER);
  const [createTweet, { isError, isSuccess }] = useCreateTweetMutation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTweetClick = (values: any) => {
    const tweetImage = form.getFieldValue("image");
    const { tweet: tweetText, visibility } = values;
    const formData = new FormData();

    if (tweetImage) {
      formData.append("image", tweetImage);
    }

    if (tweetText) {
      formData.append("text", tweetText);
    }

    formData.append("isPublic", Boolean(!visibility).toString());

    createTweet(formData);
  };

  useEffect(() => {
    form.setFieldValue("image", fileList[0]);
  }, [fileList]);

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      message.error(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }, [isError]);

  return (
    <Card
      style={{ maxWidth: "825px", width: "100%" }}
      bodyStyle={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      <Card.Meta
        title="Tweet something"
        description={<Divider style={{ margin: "5px 0" }} />}
        style={{
          fontWeight: 600,
          fontSize: "12px",
          lineHeight: "18px",
          letterSpacing: "-0.035em",
          color: "#4F4F4F",
          marginBottom: "10px",
        }}
      />
      <Form style={{ width: "100%" }} form={form} layout="vertical" onFinish={handleTweetClick}>
        <Row
          style={{
            width: "100%",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <Col>
            <Avatar shape="square" src={avatar} size={45} />
          </Col>
          <Form.Item style={{ width: "100%", marginBottom: 0 }} name="tweet">
            <Input.TextArea
              maxLength={500}
              autoSize={{ minRows: 2 }}
              style={{ width: "100%" }}
              placeholder="What's going on?"
            />
          </Form.Item>
        </Row>
        <Row
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "10px",
          }}
        >
          <Col style={{ display: "flex", gap: 10 }}>
            <Form.Item
              name="visibility"
              label="Who can reply?"
              style={{ marginBottom: 0 }}
              initialValue={Visibility.PUBLIC}
            >
              <Radio.Group>
                <Radio.Button value={Visibility.PUBLIC}>
                  <>
                    <GlobalOutlined />
                    <span style={{ marginLeft: "5px" }}>Everyone</span>
                  </>
                </Radio.Button>
                <Radio.Button value={Visibility.PRIVATE}>
                  <>
                    <UserOutlined />
                    <span style={{ marginLeft: "5px" }}>People you follow</span>
                  </>
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item style={{ alignSelf: "flex-end", marginBottom: 0 }} name="image" onReset={() => setFileList([])}>
              <UploadImg fileList={fileList} setFileList={setFileList} />
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              Tweet
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default TweetForm;
