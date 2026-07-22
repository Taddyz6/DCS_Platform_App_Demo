import { Button, Card, Col, List, Row, Space, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { EmptyState } from '@/components/common/EmptyState';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { ResultSummary } from '@/components/common/ResultSummary';
import { RiskLevelTag } from '@/components/common/RiskLevelTag';
import { Timeline } from '@/components/common/Timeline';
import { getAssetDetail, getRelatedMockReports } from './data';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';

export function GovernanceAssetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { records } = useGovernanceWorkspace();
  const detail = getAssetDetail(id);

  const localRecords = useMemo(
    () => records.filter((record) => record.assetId === id).slice(0, 4),
    [id, records],
  );
  const relatedItems = useMemo(
    () =>
      (localRecords.length > 0 ? localRecords : detail?.relatedAssessments ?? []).map(
        (record) => ({
          id: record.id,
          name: record.name,
          updatedAt: record.updatedAt,
          sourceLabel:
            'assetId' in record ? '治理记录' : '合规研判记录',
          riskLevel: record.riskLevel ?? 'medium',
        }),
      ),
    [detail?.relatedAssessments, localRecords],
  );

  if (!detail) {
    return (
      <EmptyState
        title="未找到数据资产"
        description="当前资产不存在或链接无效，请返回资产清单重新选择。"
        actionLabel="返回资产清单"
        onAction={() => navigate('/governance/assets')}
      />
    );
  }

  const relatedReports = getRelatedMockReports(id);

  return (
    <div className="governance-page">
      <ResultSummary
        title={`${detail.asset.name}资产详情`}
        riskLevel={detail.asset.riskLevel}
        status="completed"
        description={`该资产位于 ${detail.asset.system}，用于 ${detail.asset.purpose}，当前流向 ${detail.asset.destination}。`}
        metrics={[
          { label: '资产分级', value: detail.asset.level },
          { label: '主体类型', value: detail.asset.subjectType },
          { label: '留存周期', value: detail.asset.retentionPeriod },
          { label: '评估记录', value: `${localRecords.length} 条` },
        ]}
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={8}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="governance-list-stack">
              <Typography.Title level={5} className="section-title">
                基本属性
              </Typography.Title>
              <Card className="governance-info-card">
                <Typography.Paragraph className="governance-copy">
                  分类：{detail.asset.category}
                </Typography.Paragraph>
                <Typography.Paragraph className="governance-copy">
                  目的地：{detail.asset.destination}
                </Typography.Paragraph>
                <Typography.Paragraph className="governance-copy">
                  处理目的：{detail.asset.purpose}
                </Typography.Paragraph>
              </Card>
              <Space wrap>
                {detail.asset.personalInfo ? <Tag color="blue">个人信息</Tag> : null}
                {detail.asset.sensitivePersonalInfo ? (
                  <Tag color="red">敏感个人信息</Tag>
                ) : null}
                {detail.asset.suspectedImportantData ? (
                  <Tag color="gold">疑似重要数据</Tag>
                ) : null}
                <RiskLevelTag level={detail.asset.riskLevel} />
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="governance-list-stack">
              <Typography.Title level={5} className="section-title">
                字段示例
              </Typography.Title>
              {detail.fields.map((field) => (
                <Card key={field} className="governance-info-card">
                  <Typography.Paragraph className="governance-copy">
                    {field}
                  </Typography.Paragraph>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <RegulationCitation title="相关法规" citations={detail.citations} />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={8}>
          <Timeline
            title="数据流向"
            items={detail.timeline.map((item, index) => ({
              color: index === detail.timeline.length - 1 ? '#2f7d4b' : '#18578f',
              title: item,
              description: '用于展示资产从源系统到跨境使用场景的流转路径。',
            }))}
          />
        </Col>
        <Col xs={24} xl={8}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="governance-list-stack">
              <Typography.Title level={5} className="section-title">
                控制措施
              </Typography.Title>
              {detail.controls.map((item) => (
                <Card key={item} className="governance-info-card">
                  <Typography.Paragraph className="governance-copy">
                    {item}
                  </Typography.Paragraph>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="governance-list-stack">
              <div className="regulation-section-head">
                <Typography.Title level={5} className="section-title">
                  相关评估
                </Typography.Title>
                <Button type="link" onClick={() => navigate('/governance/risk')}>
                  发起评估
                </Button>
              </div>
              <List
                dataSource={relatedItems}
                renderItem={(record) => (
                  <List.Item className="governance-list-item">
                    <List.Item.Meta
                      title={record.name}
                      description={`${record.updatedAt} · ${record.sourceLabel}`}
                    />
                    <RiskLevelTag level={record.riskLevel} />
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={16}>
          <DocumentPreview
            title={`${detail.asset.name}资产治理说明`}
            subtitle="用于展示资产详情、流向边界和控制措施的治理预览。"
            sections={[
              {
                title: '一、资产概况',
                content: `${detail.asset.name} 位于 ${detail.asset.system}，分类为 ${detail.asset.category}，用于 ${detail.asset.purpose}。`,
              },
              {
                title: '二、跨境流向',
                content: `当前目标地区为 ${detail.asset.destination}，主体类型为 ${detail.asset.subjectType}，留存周期为 ${detail.asset.retentionPeriod}。`,
              },
              {
                title: '三、控制建议',
                content: detail.controls.join('；'),
              },
            ]}
          />
        </Col>
        <Col xs={24} xl={8}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="governance-list-stack">
              <Typography.Title level={5} className="section-title">
                关联报告
              </Typography.Title>
              <List
                dataSource={relatedReports}
                renderItem={(report) => (
                  <List.Item className="governance-list-item">
                    <List.Item.Meta
                      title={report.name}
                      description={`${report.type} · ${report.createdAt.slice(0, 10)}`}
                    />
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
