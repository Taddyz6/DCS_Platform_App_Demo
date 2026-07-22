import { Card, Col, List, Row, Space, Typography } from 'antd';
import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { ChartCard } from '@/components/charts/ChartCard';
import { RiskLevelTag } from '@/components/common/RiskLevelTag';
import { securityEvents, securityNodeStatuses } from '@/mock';

export function SecurityMonitorPage() {
  const nodeOption = useMemo<EChartsOption>(
    () => ({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: securityNodeStatuses.map((item) => item.name),
        axisLabel: { interval: 0, rotate: 18 },
      },
      yAxis: { type: 'value' },
      grid: { left: 32, right: 20, top: 36, bottom: 52 },
      color: ['#2f7d4b'],
      series: [
        {
          type: 'bar',
          barWidth: 22,
          data: securityNodeStatuses.map((item) => item.throughputGb),
        },
      ],
    }),
    [],
  );

  return (
    <div className="security-page">
      <ChartCard
        title="节点吞吐与健康"
        subtitle="按节点输出当前吞吐量"
        option={nodeOption}
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="security-list-stack">
              <Typography.Title level={5} className="section-title">
                风险事件
              </Typography.Title>
              <List
                dataSource={securityEvents}
                renderItem={(item) => (
                  <List.Item className="security-list-item">
                    <List.Item.Meta
                      title={item.type}
                      description={`${item.time} · ${item.summary}`}
                    />
                    <RiskLevelTag level={item.riskLevel} />
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="security-list-stack">
              <Typography.Title level={5} className="section-title">
                节点状态
              </Typography.Title>
              <List
                dataSource={securityNodeStatuses}
                renderItem={(item) => (
                  <List.Item className="security-list-item">
                    <List.Item.Meta
                      title={item.name}
                      description={`${item.region} · 状态 ${item.status}`}
                    />
                    <Typography.Text>{item.throughputGb} GB</Typography.Text>
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
