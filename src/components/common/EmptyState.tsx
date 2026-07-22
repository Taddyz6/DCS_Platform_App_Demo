import type { ReactNode } from 'react';
import { Button, Empty, Space, Typography } from 'antd';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="state-panel">
      <Empty image={icon ? <div>{icon}</div> : Empty.PRESENTED_IMAGE_SIMPLE}>
        <Space direction="vertical" size={8}>
          <Typography.Title level={5} className="state-panel-title">
            {title}
          </Typography.Title>
          <Typography.Paragraph className="state-panel-copy">
            {description}
          </Typography.Paragraph>
          {actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
        </Space>
      </Empty>
    </div>
  );
}
