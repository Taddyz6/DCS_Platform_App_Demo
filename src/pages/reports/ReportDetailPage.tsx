import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { EmptyState } from '@/components/common/EmptyState';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { ResultSummary } from '@/components/common/ResultSummary';
import { ReportCard } from '@/components/common/ReportCard';
import { downloadTextFile } from '@/utils/download';
import { getRelatedReports, getReportById, getReportCitations } from './data';

export function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = getReportById(id);

  if (!report) {
    return (
      <EmptyState
        title="未找到报告"
        description="当前报告不存在或链接无效，请返回报告中心重新选择。"
        actionLabel="返回报告中心"
        onAction={() => navigate('/reports')}
      />
    );
  }

  const relatedReports = getRelatedReports(report);

  return (
    <div className="reports-page">
      <ResultSummary
        title={report.name}
        riskLevel={
          report.type === '自动驾驶'
            ? 'high'
            : ['软件升级', '联网运行'].includes(report.type)
              ? 'medium'
              : 'low'
        }
        status={report.status === 'generated' ? 'completed' : 'draft'}
        description={report.summary}
        metrics={[
          { label: '报告类型', value: report.type },
          { label: '状态', value: report.status === 'generated' ? '已生成' : '草稿' },
          { label: '生成时间', value: report.createdAt.slice(0, 16) },
          { label: '章节数', value: String(report.sections.length) },
        ]}
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={16}>
          <DocumentPreview
            title={report.name}
            subtitle={`${report.type} · 报告预览`}
            sections={report.sections}
          />
        </Col>
        <Col xs={24} xl={8}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="reports-list-stack">
              <Typography.Title level={5} className="section-title">
                报告操作
              </Typography.Title>
              <Button
                type="primary"
                onClick={() => {
                  const markdown = [
                    `# ${report.name}`,
                    '',
                    ...report.sections.flatMap((section) => [
                      `## ${section.title}`,
                      section.content,
                      '',
                    ]),
                  ].join('\n');

                  downloadTextFile(`${report.name}.md`, markdown);
                }}
              >
                导出报告
              </Button>
              <Button onClick={() => navigate('/reports')}>返回报告列表</Button>
              <Typography.Paragraph className="reports-copy">
                报告结论与国内法规智库、数据治理结果和业务场景保持关联，可用于后续复核与申报准备。
              </Typography.Paragraph>
            </Space>
          </Card>
          <RegulationCitation
            title="相关法规"
            citations={getReportCitations(report)}
          />
        </Col>
      </Row>

      {relatedReports.length > 0 ? (
        <div className="reports-grid">
          {relatedReports.map((item) => (
            <ReportCard
              key={item.id}
              title={item.name}
              type={item.type}
              summary={item.summary}
              updatedAt={item.createdAt.slice(0, 10)}
              status={item.status === 'generated' ? 'completed' : 'draft'}
              onPreview={() => navigate(`/reports/${item.id}`)}
              onDownload={() => navigate(`/reports/${item.id}`)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
