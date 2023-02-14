import { Avatar, Card, Col, Form, FormInstance, Input, Row, UploadFile } from "antd";
import { useEffect, useState } from "react";
import UploadImg from "../../../../elements/UploadImg/UploadImg";
import useAppSelector from "../../../../redux/hooks/useAppSelector";

interface Props {
  form: FormInstance;
}

const CommentForm = ({ form }: Props) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { avatar } = useAppSelector((state) => state.USER);

  useEffect(() => {
    form.setFieldValue("image", fileList[0]);
  }, [fileList]);

  return (
    <Card style={{ width: "100%" }} bodyStyle={{ padding: "5px" }} bordered={false}>
      <Form style={{ width: "100%" }} form={form}>
        <Row style={{ width: "100%", justifyContent: "space-between", flexWrap: "nowrap", gap: "10px" }}>
          <Col>
            <Avatar shape="square" src={avatar} />
          </Col>
          <Form.Item style={{ width: "100%", marginBottom: 0 }} name="comment">
            <Input.TextArea maxLength={500} autoSize style={{ width: "100%" }} placeholder="Tweet your reply..." />
          </Form.Item>
          <Form.Item style={{ alignSelf: "flex-end", marginBottom: 0 }} name="image" onReset={() => setFileList([])}>
            <UploadImg fileList={fileList} setFileList={setFileList} />
          </Form.Item>
        </Row>
      </Form>
    </Card>
  );
};

export default CommentForm;
