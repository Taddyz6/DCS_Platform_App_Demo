import { InboxOutlined } from '@ant-design/icons';
import { Card, Space, Typography, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';

interface UploadPanelProps {
  title: string;
  fileList: UploadFile[];
  onChange: (fileList: UploadFile[]) => void;
}

export function UploadPanel({
  title,
  fileList,
  onChange,
}: UploadPanelProps) {
  const uploadProps: UploadProps = {
    multiple: true,
    fileList,
    beforeUpload: () => false,
    onChange: (info) => onChange(info.fileList),
  };

  return (
    <Card className="ui-card upload-panel-card" bordered={false}>
      <Space direction="vertical" size={16} className="upload-panel-stack">
        <Typography.Title level={5} className="section-title">
          {title}
        </Typography.Title>
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">拖拽文件到此处或点击选择本地材料</p>
          <p className="ant-upload-hint">
            仅保存文件名、大小和类型等基础元数据，不做真实解析。
          </p>
        </Upload.Dragger>
      </Space>
    </Card>
  );
}
