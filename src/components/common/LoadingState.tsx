import { LoadingOutlined } from '@ant-design/icons';
import { Space, Spin, Typography } from 'antd';

interface LoadingStateProps {
  title: string;
  description: string;
}

export function LoadingState({ title, description }: LoadingStateProps) {
  return (
    <div className="state-panel state-panel-loading">
      <Space direction="vertical" size={14} align="center">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
        <Typography.Title level={5} className="state-panel-title">
          {title}
        </Typography.Title>
        <Typography.Paragraph className="state-panel-copy">
          {description}
        </Typography.Paragraph>
      </Space>
    </div>
  );
}
