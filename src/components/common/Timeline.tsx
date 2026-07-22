import { Card, Space, Timeline as AntTimeline, Typography } from 'antd';

interface TimelineEntry {
  color?: string;
  title: string;
  description: string;
}

interface TimelineProps {
  title: string;
  items: TimelineEntry[];
}

export function Timeline({ title, items }: TimelineProps) {
  return (
    <Card className="ui-card timeline-card" bordered={false}>
      <Space direction="vertical" size={16} className="timeline-stack">
        <Typography.Title level={5} className="section-title">
          {title}
        </Typography.Title>
        <AntTimeline
          items={items.map((item) => ({
            color: item.color,
            children: (
              <Space direction="vertical" size={4}>
                <Typography.Text strong>{item.title}</Typography.Text>
                <Typography.Paragraph className="timeline-copy">
                  {item.description}
                </Typography.Paragraph>
              </Space>
            ),
          }))}
        />
      </Space>
    </Card>
  );
}
