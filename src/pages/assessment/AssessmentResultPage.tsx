import {
  CheckCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Steps, Tag, Typography, message } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { EmptyState } from '@/components/common/EmptyState';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { downloadTextFile } from '@/utils/download';
import {
  getAssessmentCitations,
  getAssessmentReportPreview,
  getAssessmentTypeLabel,
  getScenarioById,
} from './data';
import { useAssessmentWorkspace } from './useAssessmentWorkspace';

const riskPresentation = {
  low: {
    label: '低风险',
    note: '当前未触发安全评估显著条件',
    className: 'low',
  },
  medium: {
    label: '中风险',
    note: '需补充材料并复核适用路径',
    className: 'medium',
  },
  high: {
    label: '高风险',
    note: '已触发安全评估或专项复核条件',
    className: 'high',
  },
} as const;

const normalizeAssessmentText = (value: string) =>
  value
    .replace(/\bnegative\b/g, '负面清单')
    .replace(/\bpositive\b/g, '正面清单')
    .replace(/\bexemption\b/g, '豁免条件')
    .replace(/\bftz\b/g, '自贸区便利化政策')
    .replace(/\bgreen\b/g, '绿色通道');

export function AssessmentResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDetailById, getRecordById } = useAssessmentWorkspace();
  const [messageApi, contextHolder] = message.useMessage();
  const record = getRecordById(id);
  const detail = getDetailById(id);

  const scenario = useMemo(() => getScenarioById(record?.scenarioId), [record?.scenarioId]);

  if (!record || !detail) {
    return (
      <EmptyState
        title="未找到研判结果"
        description="当前结果记录不存在，可能已被删除或链接无效。"
        actionLabel="返回研判记录"
        onAction={() => navigate('/assessment/history')}
      />
    );
  }

  const riskLevel = record.riskLevel ?? 'medium';
  const risk = riskPresentation[riskLevel];
  const rawReportPreview = getAssessmentReportPreview(detail);
  const reportPreview = {
    ...rawReportPreview,
    sections: rawReportPreview.sections.map((section) => ({
      ...section,
      content: normalizeAssessmentText(section.content),
    })),
  };
  const citationIds =
    record.type === 'listPolicy'
      ? riskLevel === 'low'
        ? ['reg-cn-data-flow', 'reg-cn-pipl']
        : ['reg-cn-auto-guide-2026', 'reg-cn-security-assessment']
      : detail.citations;
  const citations = getAssessmentCitations(citationIds);

  const downloadReport = () => {
    const markdown = [
      `# ${reportPreview.title}`,
      '',
      ...reportPreview.sections.flatMap((section) => [
        `## ${section.title}`,
        section.content,
        '',
      ]),
    ].join('\n');

    downloadTextFile(`${reportPreview.title}.md`, markdown);
    void messageApi.success('研判报告已生成并下载');
  };

  return (
    <div className="assessment-page assessment-result-page">
      {contextHolder}

      <Card
        className={`ui-card assessment-result-hero assessment-result-hero-${risk.className}`}
        bordered={false}
      >
        <div className="assessment-result-hero-grid">
          <div className="assessment-result-hero-copy">
            <Typography.Text className="assessment-result-eyebrow">
              ASSESSMENT OUTCOME
            </Typography.Text>
            <Space wrap size={10}>
              <Typography.Title level={3} className="assessment-result-title">
                {record.name}结果
              </Typography.Title>
              <Tag color={record.status === 'completed' ? 'success' : 'default'}>
                {record.status === 'completed' ? '已完成' : '草稿'}
              </Tag>
            </Space>
            <Typography.Paragraph className="assessment-result-summary">
              {record.resultSummary}
            </Typography.Paragraph>
          </div>

          <div className="assessment-result-risk-panel">
            <span>综合风险等级</span>
            <strong>{risk.label}</strong>
            <small>{risk.note}</small>
          </div>
        </div>

        <div className="assessment-result-decision">
          <SafetyCertificateOutlined />
          <div>
            <span>推荐合规路径</span>
              <strong>{normalizeAssessmentText(detail.recommendedPath)}</strong>
          </div>
        </div>

        <div className="assessment-result-meta-grid">
          <div>
            <span>研判类型</span>
            <strong>{getAssessmentTypeLabel(record.type)}</strong>
          </div>
          <div>
            <span>目标国家或地区</span>
            <strong>{scenario?.toCountry ?? '-'}</strong>
          </div>
          <div>
            <span>更新时间</span>
            <strong>{record.updatedAt.slice(0, 16)}</strong>
          </div>
        </div>
      </Card>

      <Card className="ui-card assessment-result-section" bordered={false}>
        <div className="assessment-result-section-head">
          <div className="assessment-result-section-icon assessment-result-section-icon-blue">
            <CheckCircleOutlined />
          </div>
          <div>
            <Typography.Title level={5} className="section-title">
              判定依据
            </Typography.Title>
            <Typography.Text>本次研判实际命中的场景、数据与规则条件</Typography.Text>
          </div>
        </div>
        <div className="assessment-result-condition-grid">
          {detail.hitConditions.map((item, index) => (
            <article key={item} className="assessment-result-condition-item">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <Typography.Text>{normalizeAssessmentText(item)}</Typography.Text>
            </article>
          ))}
        </div>
      </Card>

      <Row gutter={[20, 20]} align="stretch">
        <Col xs={24} xl={12}>
          <Card className="ui-card assessment-result-section assessment-result-equal-card" bordered={false}>
            <div className="assessment-result-section-head">
              <div className="assessment-result-section-icon assessment-result-section-icon-amber">
                <ExclamationCircleOutlined />
              </div>
              <div>
                <Typography.Title level={5} className="section-title">
                  待补充材料
                </Typography.Title>
                <Typography.Text>完成最终路径判断前仍需补齐的证明</Typography.Text>
              </div>
            </div>
            <div className="assessment-result-list">
              {detail.unmetConditions.map((item) => (
                <div key={item} className="assessment-result-list-item">
                  <span className="assessment-result-list-bullet" />
                  <Typography.Text>{normalizeAssessmentText(item)}</Typography.Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card className="ui-card assessment-result-section assessment-result-equal-card" bordered={false}>
            <div className="assessment-result-section-head">
              <div className="assessment-result-section-icon assessment-result-section-icon-red">
                <SafetyCertificateOutlined />
              </div>
              <div>
                <Typography.Title level={5} className="section-title">
                  下一步事项
                </Typography.Title>
                <Typography.Text>根据当前风险结论安排后续工作</Typography.Text>
              </div>
            </div>
            <div className="assessment-result-list">
              {detail.pendingItems.map((item) => (
                <div key={item} className="assessment-result-list-item">
                  <span className="assessment-result-list-bullet" />
                  <Typography.Text>{normalizeAssessmentText(item)}</Typography.Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="ui-card assessment-result-section" bordered={false}>
        <div className="assessment-result-section-head">
          <div className="assessment-result-section-icon assessment-result-section-icon-blue">
            <FileTextOutlined />
          </div>
          <div>
            <Typography.Title level={5} className="section-title">
              规则路径
            </Typography.Title>
            <Typography.Text>从数据识别到形成研判结论的处理链路</Typography.Text>
          </div>
        </div>
        <Steps
          className="assessment-result-steps"
          current={detail.rulePath.length - 1}
          responsive
          items={detail.rulePath.map((item) => ({ title: item }))}
        />
      </Card>

      <Row gutter={[20, 20]} align="stretch">
        <Col xs={24} xl={10}>
          <RegulationCitation title="法规依据" citations={citations} />
        </Col>
        <Col xs={24} xl={14}>
          <DocumentPreview
            title={reportPreview.title}
            subtitle={reportPreview.subtitle}
            sections={reportPreview.sections}
          />
        </Col>
      </Row>

      <Card className="ui-card assessment-result-actions" bordered={false}>
        <div>
          <Typography.Title level={5} className="section-title">
            结果输出
          </Typography.Title>
          <Typography.Paragraph className="assessment-copy">
            结果用于辅助分析，不构成正式法律意见、行政认定或监管申报结论。
          </Typography.Paragraph>
        </div>
        <Space wrap>
          <Button type="primary" icon={<FileTextOutlined />} onClick={downloadReport}>
            生成研判报告
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => {
              downloadTextFile(
                `${record.id}.json`,
                JSON.stringify({ record, detail }, null, 2),
                'application/json;charset=utf-8',
              );
              void messageApi.success('结果数据已下载');
            }}
          >
            下载结果数据
          </Button>
          <Button onClick={() => navigate('/assessment/history')}>返回研判记录</Button>
        </Space>
      </Card>
    </div>
  );
}
