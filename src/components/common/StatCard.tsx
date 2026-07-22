import type { ReactNode } from 'react';
import { Card, Space, Statistic, Typography } from 'antd';

interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  icon?: ReactNode;
  description?: string;
}

export function StatCard({
  title,
  value,
  suffix,
  icon,
  description,
}: StatCardProps) {
  return (
    <Card className="ui-card stat-card" bordered={false}>
      <Space direction="vertical" size={14} className="stat-card-stack">
        <div className="stat-card-head">
          <Typography.Text className="stat-card-title">{title}</Typography.Text>
          {icon ? <span className="stat-card-icon">{icon}</span> : null}
        </div>
        <Statistic value={value} suffix={suffix} />
        {description ? (
          <Typography.Paragraph className="stat-card-description">
            {description}
          </Typography.Paragraph>
        ) : null}
      </Space>
    </Card>
  );
}
