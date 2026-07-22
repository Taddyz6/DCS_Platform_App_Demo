import { Card, Col, Row, Space, Typography } from 'antd';
import { RiskLevelTag } from './RiskLevelTag';
import { StatusTag } from './StatusTag';
import type { BusinessStatus, RiskLevel } from '@/types/ui';

interface SummaryMetric {
  label: string;
  value: string;
}

interface ResultSummaryProps {
  title: string;
  riskLevel: RiskLevel;
  status: BusinessStatus;
  description: string;
  metrics: SummaryMetric[];
}

export function ResultSummary({
  title,
  riskLevel,
  status,
  description,
  metrics,
}: ResultSummaryProps) {
  return (
    <Card className="ui-card result-summary-card" bordered={false}>
      <Space direction="vertical" size={16} className="result-summary-stack">
        <Space wrap>
          <Typography.Title level={4} className="result-summary-title">
            {title}
          </Typography.Title>
          <RiskLevelTag level={riskLevel} />
          <StatusTag status={status} />
        </Space>
        <Typography.Paragraph className="result-summary-copy">
          {description}
        </Typography.Paragraph>
        <Row gutter={[16, 16]}>
          {metrics.map((metric) => (
            <Col span={12} key={metric.label}>
              <div className="result-summary-metric">
                <Typography.Text className="result-summary-label">
                  {metric.label}
                </Typography.Text>
                <Typography.Text className="result-summary-value">
                  {metric.value}
                </Typography.Text>
              </div>
            </Col>
          ))}
        </Row>
      </Space>
    </Card>
  );
}
