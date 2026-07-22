import { Card, Col, Row, Space, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EChartsOption } from 'echarts';
import { ChartCard } from '@/components/charts/ChartCard';
import { RiskLevelTag } from '@/components/common/RiskLevelTag';
import { StatCard } from '@/components/common/StatCard';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { dataAssets } from '@/mock';
import { getCategoryDistribution, getClassificationSummary, getGovernanceCitations } from './data';

const levelDescriptions: Record<string, string> = {
  一级: '核心或重要汽车数据，涉及道路环境、智驾算法、运行安全或 OTA 核心能力。',
  二级: '敏感个人信息或高关注汽车数据，需要强化访问控制和人工复核。',
  三级: '一般汽车业务数据或已完成有效去标识化的数据。',
};

export function GovernanceClassificationPage() {
  const navigate = useNavigate();
  const summary = getClassificationSummary();

  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: getCategoryDistribution().map((item) => item.category),
        axisLabel: { interval: 0, rotate: 18 },
      },
      yAxis: { type: 'value' },
      grid: { left: 32, right: 20, top: 36, bottom: 52 },
      color: ['#18578f'],
      series: [
        {
          type: 'line',
          smooth: true,
          data: getCategoryDistribution().map((item) => item.count),
        },
      ],
    }),
    [],
  );

  const reviewAssets = dataAssets.filter(
    (asset) =>
      asset.riskLevel !== 'low' ||
      asset.sensitivePersonalInfo ||
      asset.suspectedImportantData,
  );

  return (
    <div className="governance-page">
      <Row gutter={[20, 20]}>
        {summary.map((item) => (
          <Col xs={24} md={8} key={item.level}>
            <StatCard
              title={`${item.level}资产`}
              value={item.count}
              suffix="项"
              description={levelDescriptions[item.level]}
            />
          </Col>
        ))}
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={14}>
          <ChartCard
            title="汽车数据类别分布"
            subtitle="按研发制造、道路测试、驾驶自动化、联网运行和 OTA 场景统计"
            option={option}
          />
        </Col>
        <Col xs={24} xl={10}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="governance-list-stack">
              <Typography.Title level={5} className="section-title">
                汽车数据分类分级规则
              </Typography.Title>
              <Card className="governance-info-card">
                <Typography.Paragraph className="governance-copy">
                  先依据《汽车数据出境安全指引（2026版）》识别研发设计、道路测试、驾驶自动化、联网运行和 OTA 场景，再确定一级、二级或三级基线。
                </Typography.Paragraph>
              </Card>
              <Card className="governance-info-card">
                <Typography.Paragraph className="governance-copy">
                  再依据 GB/T 39335-2020 表 C.1-C.4 登记处理活动、数据生命周期和风险源，并通过表 D.5 的可能性 × 影响程度矩阵形成风险等级。
                </Typography.Paragraph>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {summary.map((item) => (
          <Col xs={24} xl={8} key={item.level}>
            <Card className="ui-card" bordered={false}>
              <Space direction="vertical" size={16} className="governance-list-stack">
                <Typography.Title level={5} className="section-title">
                  {item.level}汽车数据样例
                </Typography.Title>
                {item.assets.map((asset) => (
                  <Card key={asset.id} className="governance-info-card">
                    <Space direction="vertical" size={8}>
                      <Typography.Text strong>{asset.name}</Typography.Text>
                      <Typography.Paragraph className="governance-copy">
                        {asset.system} · {asset.category} · {asset.destination}
                      </Typography.Paragraph>
                      <Space wrap>
                        <RiskLevelTag level={asset.riskLevel} />
                        {asset.personalInfo ? <Tag color="blue">个人信息</Tag> : null}
                        {asset.suspectedImportantData ? (
                          <Tag color="gold">疑似重要数据</Tag>
                        ) : null}
                      </Space>
                    </Space>
                  </Card>
                ))}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="ui-card" bordered={false}>
        <Space direction="vertical" size={16} className="governance-list-stack">
          <Typography.Title level={5} className="section-title">
            待人工复核资产
          </Typography.Title>
          <div className="governance-board">
            {reviewAssets.slice(0, 12).map((asset) => (
              <Card key={asset.id} className="governance-info-card">
                <Space direction="vertical" size={8}>
                  <Typography.Text strong>{asset.name}</Typography.Text>
                  <Typography.Paragraph className="governance-copy">
                    {asset.category} · {asset.purpose}
                  </Typography.Paragraph>
                  <Space wrap>
                    <Tag>{asset.level}</Tag>
                    <RiskLevelTag level={asset.riskLevel} />
                  </Space>
                </Space>
              </Card>
            ))}
          </div>
        </Space>
      </Card>

      <RegulationCitation
        title="分类分级法规支撑"
        citations={getGovernanceCitations([
          'reg-cn-auto-guide-2026',
          'reg-cn-gbt39335',
          'reg-cn-dsl',
          'reg-cn-data-flow',
        ])}
        onCitationClick={(citation) => navigate(`/regulations/detail/${citation.id}`)}
      />
    </div>
  );
}
