import {
  ApartmentOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, List, Row, Space, Typography } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EChartsOption } from 'echarts';
import { ActivityLog } from '@/components/common/ActivityLog';
import { ModuleCard } from '@/components/common/ModuleCard';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { RiskLevelTag } from '@/components/common/RiskLevelTag';
import { StatCard } from '@/components/common/StatCard';
import { ChartCard } from '@/components/charts/ChartCard';
import {
  getCategoryDistribution,
  getGovernanceActivityEntries,
  getGovernanceCitations,
  getGovernanceOverview,
  getHighRiskAssets,
} from './data';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';
import { GovernanceFlowDashboard } from './GovernanceFlowDashboard';

export function GovernanceHomePage() {
  const navigate = useNavigate();
  const { records } = useGovernanceWorkspace();
  const overview = getGovernanceOverview();
  const highRiskAssets = getHighRiskAssets();
  const activityEntries = getGovernanceActivityEntries(records);

  const categoryOption = useMemo<EChartsOption>(
    () => ({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: getCategoryDistribution().map((item) => item.category),
        axisLabel: { interval: 0, rotate: 18 },
      },
      yAxis: { type: 'value' },
      grid: { left: 32, right: 20, top: 36, bottom: 52 },
      color: ['#2f7d4b'],
      series: [
        {
          type: 'bar',
          barWidth: 20,
          data: getCategoryDistribution().map((item) => item.count),
        },
      ],
    }),
    [],
  );

  return (
    <div className="governance-page">
      <Row gutter={[20, 20]}>
        <Col xs={24} md={12} xl={6}>
          <StatCard
            title="数据资产"
            value={overview.totalAssets}
            suffix="项"
            description="覆盖系统、目的地、等级、敏感属性和保留周期。"
            icon={<ApartmentOutlined />}
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <StatCard
            title="高风险资产"
            value={overview.highRiskAssets}
            suffix="项"
            description="建议优先进入整改或专项复核。"
            icon={<WarningOutlined />}
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <StatCard
            title="疑似重要数据"
            value={overview.importantCandidates}
            suffix="项"
            description="用于辅助识别，不构成行政认定。"
            icon={<SafetyCertificateOutlined />}
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <StatCard
            title="法规支撑"
            value={5}
            suffix="部"
            description="与国内法规智库共用法规记录和条款依据。"
            icon={<BankOutlined />}
          />
        </Col>
      </Row>

      <GovernanceFlowDashboard />

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={14}>
          <ChartCard
            title="资产类别分布"
            subtitle="按资产清单中的业务类别统计"
            option={categoryOption}
          />
        </Col>
        <Col xs={24} xl={10}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="governance-list-stack">
              <Typography.Title level={5} className="section-title">
                当前关注重点
              </Typography.Title>
              <Card className="governance-info-card">
                <Typography.Paragraph className="governance-copy">
                  当前识别到 {overview.importantCandidates} 项疑似重要数据资产，优先核查汽车研发设计、道路测试、驾驶自动化、联网运行和 OTA 场景。
                </Typography.Paragraph>
              </Card>
              <Card className="governance-info-card">
                <Typography.Paragraph className="governance-copy">
                  治理规则直接引用国内法规智库中的《数据安全法》《数据出境安全评估办法》和《汽车数据出境安全指引（2026版）》。
                </Typography.Paragraph>
              </Card>
              <Space wrap>
                <Button type="primary" onClick={() => navigate('/governance/assets')}>
                  查看资产清单
                </Button>
                <Button onClick={() => navigate('/regulations')}>
                  打开国内法规智库
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <ModuleCard
            title="分类分级"
            description="查看一级、二级、三级资产分布，结合敏感属性和业务目的快速确定治理优先级。"
            icon={<span className="feature-dot" />}
            meta="分布总览与待复核资产"
            actionLabel="进入分类分级"
            onAction={() => navigate('/governance/classification')}
          />
        </Col>
        <Col xs={24} xl={12}>
          <ModuleCard
            title="重要数据识别"
            description="基于分类分级、行业规则和风险矩阵，直接展示疑似重要数据结论与复核建议。"
            icon={<span className="feature-dot" />}
            meta="识别结论与规则路径"
            actionLabel="查看识别结果"
            onAction={() => navigate('/governance/important-data')}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="governance-list-stack">
              <div className="regulation-section-head">
                <Typography.Title level={5} className="section-title">
                  高关注资产
                </Typography.Title>
                <Button type="link" onClick={() => navigate('/governance/assets')}>
                  查看全部
                </Button>
              </div>
              <List
                dataSource={highRiskAssets}
                renderItem={(asset) => (
                  <List.Item
                    className="governance-list-item"
                    actions={[
                      <Button
                        key="detail"
                        type="link"
                        onClick={() => navigate(`/governance/assets/${asset.id}`)}
                      >
                        详情
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={asset.name}
                      description={`${asset.system} · ${asset.destination} · ${asset.purpose}`}
                    />
                    <RiskLevelTag level={asset.riskLevel} />
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <ActivityLog
            title="最近治理动作"
            entries={
              activityEntries.length > 0
                ? activityEntries
                : [
                    {
                      id: 'governance-empty',
                      title: '尚未生成治理结果',
                      time: '等待操作',
                      operator: '平台工作区',
                      status: 'pending',
                    },
                  ]
            }
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={14}>
          <RegulationCitation
            title="国内法规智库支撑"
            citations={getGovernanceCitations([
              'reg-cn-auto-guide-2026',
              'reg-cn-gbt39335',
              'reg-cn-dsl',
              'reg-cn-security-assessment',
              'reg-cn-data-flow',
            ])}
            onCitationClick={(citation) => navigate(`/regulations/detail/${citation.id}`)}
          />
        </Col>
        <Col xs={24} xl={10}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="governance-list-stack">
              <Typography.Title level={5} className="section-title">
                法规联动机制
              </Typography.Title>
              <Card className="governance-info-card">
                <Typography.Paragraph className="governance-copy">
                  法规智库更新后，治理页面引用的法规标题、摘要和条款依据同步更新。
                </Typography.Paragraph>
              </Card>
              <Card className="governance-info-card">
                <Typography.Paragraph className="governance-copy">
                  重要数据识别结果保留法规 ID，可直接回溯到法规详情和对应条款。
                </Typography.Paragraph>
              </Card>
              <Button type="primary" onClick={() => navigate('/regulations')}>
                查看全部国内法规
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
