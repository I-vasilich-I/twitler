import { CheckSquareOutlined, PictureOutlined } from "@ant-design/icons";
import { Button, Upload, UploadFile, UploadProps } from "antd";

interface Props {
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}

const UploadImg = ({ fileList, setFileList }: Props) => {
  const isFileSelected = Boolean(fileList.length);

  const props: UploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);

      return false;
    },
    fileList,
    maxCount: 1,
  };

  return (
    <Upload {...props}>
      <Button icon={isFileSelected ? <CheckSquareOutlined /> : <PictureOutlined />} />
    </Upload>
  );
};

export default UploadImg;
