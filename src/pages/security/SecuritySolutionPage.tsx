import { Card, Col, Row, Space, Typography } from 'antd';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { Timeline } from '@/components/common/Timeline';
import { getSecurityCitations, securityCapabilities } from './data';

export function SecuritySolutionPage() {
  return (
    <div className="security-page">
      <Row gutter={[20, 20]}>
        {securityCapabilities.map((item) => (
          <Col xs={24} xl={12} key={item.title}>
            <Card className="ui-card" bordered={false}>
              <Space direction="vertical" size={16} className="security-list-stack">
                <Typography.Title level={5} className="section-title">
                  {item.title}
                </Typography.Title>
                <Typography.Paragraph className="security-copy">
                  {item.description}
                </Typography.Paragraph>
                {item.points.map((point) => (
                  <Card key={point} className="security-info-card">
                    <Typography.Paragraph className="security-copy">
                      {point}
                    </Typography.Paragraph>
                  </Card>
                ))}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={8}>
          <Timeline
            title="方案落地步骤"
            items={[
              { color: '#18578f', title: '识别场景与链路', description: '确认跨境方向、数据类型和接收方边界。' },
              { color: '#18578f', title: '配置策略', description: '配置脱敏、访问控制、加密和审计策略。' },
              { color: '#2f7d4b', title: '持续监测', description: '联动日志审计、节点健康和整改事项。' },
            ]}
          />
        </Col>
        <Col xs={24} xl={16}>
          <RegulationCitation
            title="方案相关法规"
            citations={getSecurityCitations([
              'reg-cn-dsl',
              'reg-cn-pipl',
              'reg-cn-security-assessment',
            ])}
          />
        </Col>
      </Row>
    </div>
  );
}
