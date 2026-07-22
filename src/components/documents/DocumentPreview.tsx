import { Card, Divider, Space, Typography } from 'antd';

interface DocumentSection {
  title: string;
  content: string;
}

interface DocumentPreviewProps {
  title: string;
  subtitle?: string;
  sections: DocumentSection[];
}

export function DocumentPreview({
  title,
  subtitle,
  sections,
}: DocumentPreviewProps) {
  return (
    <Card className="ui-card document-preview-card" bordered={false}>
      <Space direction="vertical" size={16} className="document-preview-stack">
        <div className="document-preview-head">
          <Typography.Text className="document-preview-kicker">
            文档预览
          </Typography.Text>
          <Typography.Title level={4} className="document-preview-title">
            {title}
          </Typography.Title>
          {subtitle ? (
            <Typography.Paragraph className="document-preview-subtitle">
              {subtitle}
            </Typography.Paragraph>
          ) : null}
        </div>
        <div className="document-preview-body">
          {sections.map((section, index) => (
            <div key={section.title}>
              <Typography.Title level={5}>{section.title}</Typography.Title>
              <Typography.Paragraph className="document-preview-copy">
                {section.content}
              </Typography.Paragraph>
              {index < sections.length - 1 ? <Divider /> : null}
            </div>
          ))}
        </div>
      </Space>
    </Card>
  );
}
