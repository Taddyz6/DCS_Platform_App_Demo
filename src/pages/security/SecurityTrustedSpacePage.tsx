import { Card, Col, Row, Space, Typography } from 'antd';
import { Timeline } from '@/components/common/Timeline';
import { trustedSpaceCapabilities, trustedSpaceParticipants } from './data';

export function SecurityTrustedSpacePage() {
  return (
    <div className="security-page">
      <Row gutter={[20, 20]}>
        <Col xs={24} xl={10}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="security-list-stack">
              <Typography.Title level={5} className="section-title">
                参与方
              </Typography.Title>
              {trustedSpaceParticipants.map((item) => (
                <Card key={item.name} className="security-info-card">
                  <Typography.Text strong>{item.name}</Typography.Text>
                  <Typography.Paragraph className="security-copy">
                    {item.description}
                  </Typography.Paragraph>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={14}>
          <Timeline
            title="可信数据空间流转"
            items={[
              { color: '#18578f', title: '数据提供方策略授权', description: '限定字段、时间窗和可见范围。' },
              { color: '#18578f', title: '空间内联合计算', description: '在受控环境中完成查询、统计或分析。' },
              { color: '#2f7d4b', title: '结果输出与留痕', description: '仅输出最小必要结果，并记录操作日志。' },
            ]}
          />
        </Col>
      </Row>

      <Card className="ui-card" bordered={false}>
        <Space direction="vertical" size={16} className="security-list-stack">
          <Typography.Title level={5} className="section-title">
            能力清单
          </Typography.Title>
          <div className="security-board">
            {trustedSpaceCapabilities.map((item) => (
              <Card key={item} className="security-info-card">
                <Typography.Paragraph className="security-copy">
                  {item}
                </Typography.Paragraph>
              </Card>
            ))}
          </div>
        </Space>
      </Card>
    </div>
  );
}
