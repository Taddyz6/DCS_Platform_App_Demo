import { Button, Card, Col, Row, Space, Typography, message } from 'antd';
import { useState } from 'react';
import { Timeline } from '@/components/common/Timeline';
import { transferSolutions } from './data';

export function SecurityTransferPage() {
  const [activeId, setActiveId] = useState<string>(transferSolutions[0]?.id ?? '');
  const [messageApi, contextHolder] = message.useMessage();
  const active = transferSolutions.find((item) => item.id === activeId) ?? transferSolutions[0];

  return (
    <div className="security-page">
      {contextHolder}
      <Row gutter={[20, 20]}>
        {transferSolutions.map((item) => (
          <Col xs={24} xl={8} key={item.id}>
            <Card className="ui-card" bordered={false}>
              <Space direction="vertical" size={16} className="security-list-stack">
                <Typography.Title level={5} className="section-title">
                  {item.title}
                </Typography.Title>
                <Typography.Paragraph className="security-copy">
                  {item.summary}
                </Typography.Paragraph>
                <Typography.Text>{item.type}</Typography.Text>
                <Space wrap>
                  {item.regions.map((region) => (
                    <Card key={region} className="security-info-card">
                      <Typography.Paragraph className="security-copy">
                        {region}
                      </Typography.Paragraph>
                    </Card>
                  ))}
                </Space>
                <Space wrap>
                  <Button onClick={() => setActiveId(item.id)}>查看路径</Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      setActiveId(item.id);
                      void messageApi.success(`已启用 ${item.title}`);
                    }}
                  >
                    启用方案
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {active ? (
        <Timeline
          title={`${active.title}路径示意`}
          items={[
            { color: '#18578f', title: '中国源系统', description: `按 ${active.type} 方案进行字段筛选与审批。` },
            { color: '#18578f', title: '安全网关/传输节点', description: active.strengths.join('；') },
            { color: '#2f7d4b', title: '境外接收方', description: `覆盖区域：${active.regions.join('、')}` },
          ]}
        />
      ) : null}
    </div>
  );
}
