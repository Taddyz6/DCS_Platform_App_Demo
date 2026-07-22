import { BookOutlined } from '@ant-design/icons';
import { Card, List, Space, Typography } from 'antd';
import type { CitationItem } from '@/types/ui';

interface RegulationCitationProps {
  title?: string;
  citations: CitationItem[];
  onCitationClick?: (citation: CitationItem) => void;
}

export function RegulationCitation({
  title = '法规依据',
  citations,
  onCitationClick,
}: RegulationCitationProps) {
  return (
    <Card className="ui-card citation-card" bordered={false}>
      <Space direction="vertical" size={16} className="citation-stack">
        <Typography.Title level={5} className="section-title">
          {title}
        </Typography.Title>
        <List
          dataSource={citations}
          renderItem={(citation) => (
            <List.Item
              className={`citation-item${onCitationClick ? ' citation-item-clickable' : ''}`}
              role={onCitationClick ? 'button' : undefined}
              tabIndex={onCitationClick ? 0 : undefined}
              onClick={() => onCitationClick?.(citation)}
              onKeyDown={(event) => {
                if (onCitationClick && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  onCitationClick(citation);
                }
              }}
            >
              <Space align="start">
                <BookOutlined className="citation-icon" />
                <div>
                  <Typography.Text strong>{citation.title}</Typography.Text>
                  <Typography.Paragraph className="citation-article">
                    {citation.article}
                  </Typography.Paragraph>
                  <Typography.Paragraph className="citation-summary">
                    {citation.summary}
                  </Typography.Paragraph>
                  {onCitationClick ? (
                    <Typography.Text className="citation-detail-link">
                      查看法规详情 →
                    </Typography.Text>
                  ) : null}
                </div>
              </Space>
            </List.Item>
          )}
        />
      </Space>
    </Card>
  );
}
