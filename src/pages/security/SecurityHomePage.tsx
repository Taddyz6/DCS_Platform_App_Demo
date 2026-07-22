import { SafetyCertificateOutlined, GlobalOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Card, Col, List, Row, Space, Typography } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EChartsOption } from 'echarts';
import { ChartCard } from '@/components/charts/ChartCard';
import { ModuleCard } from '@/components/common/ModuleCard';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { ReportCard } from '@/components/common/ReportCard';
import { RiskLevelTag } from '@/components/common/RiskLevelTag';
import { StatCard } from '@/components/common/StatCard';
import { getNodeStatusSummary, getSecurityCitations, getSecurityHomeStats, getSecurityReports, getTrafficTrend, securityCapabilities } from './data';
import { securityEvents, securitySnapshot } from '@/mock';

export function SecurityHomePage() {
  const navigate = useNavigate();
  const stats = getSecurityHomeStats();
  const nodeSummary = getNodeStatusSummary();
  const reports = getSecurityReports();

  const trafficOption = useMemo<EChartsOption>(
    () => ({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: getTrafficTrend().map((item) => item.country),
      },
      yAxis: { type: 'value' },
      grid: { left: 32, right: 20, top: 36, bottom: 40 },
      color: ['#18578f'],
      series: [
        {
          type: 'line',
          smooth: true,
          data: getTrafficTrend().map((item) => item.traffic),
        },
      ],
    }),
    [],
  );

  return (
    <div className="security-page">
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8} key={stats[0].title}>
          <StatCard
            title={stats[0].title}
            value={stats[0].value}
            suffix={stats[0].suffix}
            description={stats[0].description}
            icon={<GlobalOutlined />}
          />
        </Col>
        <Col xs={24} md={8} key={stats[1].title}>
          <StatCard
            title={stats[1].title}
            value={stats[1].value}
            suffix={stats[1].suffix}
            description={stats[1].description}
            icon={<SafetyCertificateOutlined />}
          />
        </Col>
        <Col xs={24} md={8} key={stats[2].title}>
          <StatCard
            title={stats[2].title}
            value={stats[2].value}
            suffix={stats[2].suffix}
            description={stats[2].description}
            icon={<WarningOutlined />}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={14}>
          <ChartCard
            title="跨境链路传输趋势"
            subtitle={`当前链路总流量 ${securitySnapshot.trafficGb} GB`}
            option={trafficOption}
          />
        </Col>
        <Col xs={24} xl={10}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="security-list-stack">
              <Typography.Title level={5} className="section-title">
                核心安全能力
              </Typography.Title>
              {securityCapabilities.slice(0, 3).map((item) => (
                <Card key={item.title} className="security-info-card">
                  <Typography.Text strong>{item.title}</Typography.Text>
                  <Typography.Paragraph className="security-copy">
                    {item.description}
                  </Typography.Paragraph>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={4}>
          <ModuleCard
            title="技术方案"
            description="查看脱敏、访问控制、加密传输和日志审计能力方案。"
            icon={<span className="feature-dot" />}
            meta="4 项能力卡"
            actionLabel="进入方案"
            onAction={() => navigate('/security/solution')}
          />
        </Col>
        <Col xs={24} xl={4}>
          <ModuleCard
            title="传输方案"
            description="比较专线、网关和可信数据空间的链路配置思路。"
            icon={<span className="feature-dot" />}
            meta="3 种方案"
            actionLabel="查看方案"
            onAction={() => navigate('/security/transfer')}
          />
        </Col>
        <Col xs={24} xl={4}>
          <ModuleCard
            title="安全监测"
            description="聚合传输趋势、节点状态和风险事件。"
            icon={<span className="feature-dot" />}
            meta="实时视图"
            actionLabel="打开监测"
            onAction={() => navigate('/security/monitor')}
          />
        </Col>
        <Col xs={24} xl={4}>
          <ModuleCard
            title="审计日志"
            description="查看来源、目的地、主体和风险等级。"
            icon={<span className="feature-dot" />}
            meta="日志留痕"
            actionLabel="查看日志"
            onAction={() => navigate('/security/audit')}
          />
        </Col>
        <Col xs={24} xl={4}>
          <ModuleCard
            title="可信空间"
            description="查看多方参与、共享机制和隐私计算能力卡片。"
            icon={<span className="feature-dot" />}
            meta="方案展示"
            actionLabel="进入空间"
            onAction={() => navigate('/security/trusted-space')}
          />
        </Col>
        <Col xs={24} xl={4}>
          <ModuleCard
            title="服务中心"
            description="联动专业机构、咨询和培训课程入口。"
            icon={<span className="feature-dot" />}
            meta="跨模块联动"
            actionLabel="前往服务"
            onAction={() => navigate('/services')}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="security-list-stack">
              <div className="regulation-section-head">
                <Typography.Title level={5} className="section-title">
                  最近风险事件
                </Typography.Title>
                <Button type="link" onClick={() => navigate('/security/monitor')}>
                  查看全部
                </Button>
              </div>
              <List
                dataSource={securityEvents.slice(0, 4)}
                renderItem={(item) => (
                  <List.Item className="security-list-item">
                    <List.Item.Meta
                      title={item.type}
                      description={`${item.sourceCountry} -> ${item.destinationCountry} · ${item.summary}`}
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
                dataSource={nodeSummary}
                renderItem={(item) => (
                  <List.Item className="security-list-item">
                    <List.Item.Meta
                      title={item.name}
                      description={`${item.region} · 吞吐 ${item.throughputGb} GB`}
                    />
                    <Typography.Text>{item.label}</Typography.Text>
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={8}>
          <RegulationCitation
            title="安全流通法规依据"
            citations={getSecurityCitations([
              'reg-cn-dsl',
              'reg-cn-security-assessment',
              'reg-cn-pipl',
            ])}
          />
        </Col>
        {reports.slice(0, 2).map((report) => (
          <Col xs={24} xl={8} key={report.id}>
            <ReportCard
              title={report.name}
              type={report.type}
              summary={report.summary}
              updatedAt={report.createdAt.slice(0, 10)}
              status={report.status === 'generated' ? 'completed' : 'draft'}
              onPreview={() => navigate('/reports')}
              onDownload={() => navigate('/reports')}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
