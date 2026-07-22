import type { ReactNode } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  meta: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ModuleCard({
  title,
  description,
  icon,
  meta,
  actionLabel = '进入模块',
  onAction,
}: ModuleCardProps) {
  return (
    <Card className="ui-card module-card" bordered={false}>
      <Space direction="vertical" size={14} className="module-card-body">
        <div className="module-card-icon">{icon}</div>
        <Typography.Title level={4} className="module-card-title">
          {title}
        </Typography.Title>
        <Typography.Paragraph className="module-card-copy">
          {description}
        </Typography.Paragraph>
        <Typography.Text className="module-card-meta">{meta}</Typography.Text>
        <Button type="link" className="module-card-link" onClick={onAction}>
          {actionLabel}
          <ArrowRightOutlined />
        </Button>
      </Space>
    </Card>
  );
}
