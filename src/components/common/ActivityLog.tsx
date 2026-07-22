import { Card, List, Space, Typography } from 'antd';
import { StatusTag } from './StatusTag';
import type { BusinessStatus } from '@/types/ui';

interface ActivityLogEntry {
  id: string;
  title: string;
  time: string;
  operator: string;
  status: BusinessStatus;
}

interface ActivityLogProps {
  title: string;
  entries: ActivityLogEntry[];
}

export function ActivityLog({ title, entries }: ActivityLogProps) {
  return (
    <Card className="ui-card activity-log-card" bordered={false}>
      <Space direction="vertical" size={16} className="activity-log-stack">
        <Typography.Title level={5} className="section-title">
          {title}
        </Typography.Title>
        <List
          dataSource={entries}
          renderItem={(entry) => (
            <List.Item className="activity-log-item">
              <div className="activity-log-row">
                <div>
                  <Typography.Text strong>{entry.title}</Typography.Text>
                  <Typography.Paragraph className="activity-log-copy">
                    {entry.operator} · {entry.time}
                  </Typography.Paragraph>
                </div>
                <StatusTag status={entry.status} />
              </div>
            </List.Item>
          )}
        />
      </Space>
    </Card>
  );
}
