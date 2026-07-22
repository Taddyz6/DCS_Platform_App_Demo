import { AuditOutlined, FileTextOutlined, ProfileOutlined } from '@ant-design/icons';
import { Button, Card, Col, List, Row, Space, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EChartsOption } from 'echarts';
import { ChartCard } from '@/components/charts/ChartCard';
import { ModuleCard } from '@/components/common/ModuleCard';
import { ReportCard } from '@/components/common/ReportCard';
import { StatCard } from '@/components/common/StatCard';
import { scenarios } from '@/mock';
import { getAssessmentRelatedReports, getAssessmentTypeLabel } from './data';
import { useAssessmentWorkspace } from './useAssessmentWorkspace';

export function AssessmentHomePage() {
  const navigate = useNavigate();
  const { records } = useAssessmentWorkspace();
  const relatedReports = getAssessmentRelatedReports();

  const riskOption = useMemo<EChartsOption>(
    () => ({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['低风险', '中风险', '高风险'],
      },
      yAxis: { type: 'value' },
      color: ['#18578f'],
      series: [
        {
          type: 'bar',
          barWidth: 36,
          data: [
            records.filter((item) => item.riskLevel === 'low').length,
            records.filter((item) => item.riskLevel === 'medium').length,
            records.filter((item) => item.riskLevel === 'high').length,
          ],
        },
      ],
    }),
    [records],
  );

  return (
    <div className="assessment-page">
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <StatCard
            title="研判记录"
            value={records.length}
            suffix="条"
            description="包含跨境合规研判、清单识别、风险评估和 PIA 记录。"
            icon={<AuditOutlined />}
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="常见出境场景"
            value={scenarios.length}
            suffix="个"
            description="涵盖汽车研发设计、道路测试、驾驶自动化、联网运行和 OTA 等重点场景。"
            icon={<ProfileOutlined />}
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="研判报告样例"
            value={relatedReports.length}
            suffix="份"
            description="结果页支持一键生成研判报告并下载。"
            icon={<FileTextOutlined />}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={14}>
          <ChartCard
            title="风险等级分布"
            subtitle="按当前研判记录统计"
            option={riskOption}
          />
        </Col>
        <Col xs={24} xl={10}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="assessment-list-stack">
              <div className="regulation-section-head">
                <Typography.Title level={5} className="section-title">
                  最近研判记录
                </Typography.Title>
                <Button type="link" onClick={() => navigate('/assessment/history')}>
                  查看全部
                </Button>
              </div>
              <List
                dataSource={records.slice(0, 5)}
                renderItem={(item) => (
                  <List.Item
                    className="regulation-home-list-item"
                    actions={[
                      <Button
                        key="view"
                        type="link"
                        onClick={() => navigate(`/assessment/result/${item.id}`)}
                      >
                        查看结果
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.name}
                      description={`${getAssessmentTypeLabel(item.type)} · ${item.updatedAt}`}
                    />
                    <Tag color={item.status === 'completed' ? 'success' : 'default'}>
                      {item.status === 'completed' ? '已完成' : '草稿'}
                    </Tag>
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <ModuleCard
            title="跨境合规研判"
            description="统一完成汽车跨境场景确认、数据分类、数量门槛判断和合规路径推荐。"
            icon={<span className="feature-dot" />}
            meta="场景预检 + 路径研判"
            actionLabel="开始研判"
            onAction={() => navigate('/assessment/path')}
          />
        </Col>
        <Col xs={24} xl={12}>
          <ModuleCard
            title="清单政策识别"
            description="识别负面清单、正面清单、豁免条件、自贸区政策和绿色通道线索。"
            icon={<span className="feature-dot" />}
            meta="政策扫描 + 差异提示"
            actionLabel="开始识别"
            onAction={() => navigate('/assessment/list-policy')}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {relatedReports.slice(0, 2).map((report) => (
          <Col xs={24} xl={12} key={report.id}>
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
