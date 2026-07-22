import { Button, Card, Col, Form, Input, Row, Space, Typography, UploadFile, message } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { UploadPanel } from '@/components/documents/UploadPanel';
import { EmptyState } from '@/components/common/EmptyState';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { ResultSummary } from '@/components/common/ResultSummary';
import { StatusTag } from '@/components/common/StatusTag';
import { downloadTextFile } from '@/utils/download';
import { getFilingCitations, getFilingTypeLabel, getMaterialBusinessStatus } from './data';
import { useFilingWorkspace } from './useFilingWorkspace';

interface MaterialDetailValues {
  documentTitle: string;
  notes: string;
}

export function FilingMaterialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMaterialById, getDetailById, updateMaterialDetail, updateMaterialUploads } =
    useFilingWorkspace();
  const material = getMaterialById(id);
  const detail = getDetailById(id);
  const [form] = Form.useForm<MaterialDetailValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const fileList = useMemo<UploadFile[]>(
    () =>
      (detail?.uploads ?? []).map((file) => ({
        uid: file.uid,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'done',
      })),
    [detail?.uploads],
  );

  if (!material || !detail) {
    return (
      <EmptyState
        title="未找到材料"
        description="当前材料不存在或链接无效，请返回材料中心重新选择。"
        actionLabel="返回材料中心"
        onAction={() => navigate('/filing/materials')}
      />
    );
  }

  return (
    <div className="filing-page">
      {contextHolder}
      <ResultSummary
        title={`${material.name}编辑与预览`}
        riskLevel={
          material.completeness >= 90
            ? 'low'
            : material.completeness >= 76
              ? 'medium'
              : 'high'
        }
        status={getMaterialBusinessStatus(material.status)}
        description={`当前材料类型为 ${getFilingTypeLabel(material.filingType)}，可继续编辑文档标题、说明和上传元数据。`}
        metrics={[
          { label: '完成度', value: `${material.completeness}%` },
          { label: '材料状态', value: getFilingTypeLabel(material.filingType) },
          { label: '最近更新', value: material.updatedAt.slice(0, 16) },
          { label: '上传文件数', value: String(detail.uploads.length) },
        ]}
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={10}>
          <Card className="ui-card" bordered={false}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                documentTitle: detail.documentTitle,
                notes: detail.notes,
              }}
              onFinish={(values) => {
                const nextSections = detail.sections.map((section, index) =>
                  index === detail.sections.length - 1
                    ? { ...section, content: values.notes }
                    : section,
                );

                updateMaterialDetail(material.id, {
                  documentTitle: values.documentTitle,
                  notes: values.notes,
                  sections: nextSections,
                });
                void messageApi.success('材料说明已保存');
              }}
            >
              <Form.Item label="文档标题" name="documentTitle" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="补充说明" name="notes">
                <Input.TextArea rows={7} />
              </Form.Item>
              <Space wrap>
                <Button type="primary" htmlType="submit">
                  保存说明
                </Button>
                <Button
                  onClick={() => {
                    const markdown = [
                      `# ${detail.documentTitle}`,
                      '',
                      ...detail.sections.flatMap((section) => [
                        `## ${section.title}`,
                        section.content,
                        '',
                      ]),
                    ].join('\n');

                    downloadTextFile(`${detail.documentTitle}.md`, markdown);
                    void messageApi.success('已导出本地材料预览');
                  }}
                >
                  导出预览
                </Button>
              </Space>
            </Form>
          </Card>
        </Col>
        <Col xs={24} xl={14}>
          <DocumentPreview
            title={detail.documentTitle}
            subtitle={detail.subtitle}
            sections={detail.sections}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={14}>
          <UploadPanel
            title="材料上传元数据"
            fileList={fileList}
            onChange={(nextFileList) => {
              updateMaterialUploads(
                material.id,
                nextFileList.map((file) => ({
                  uid: file.uid,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                })),
              );
            }}
          />
        </Col>
        <Col xs={24} xl={10}>
          <Space direction="vertical" size={20} className="filing-side-stack">
            <Card className="ui-card" bordered={false}>
              <Space direction="vertical" size={16} className="filing-list-stack">
                <div className="regulation-section-head">
                  <Typography.Title level={5} className="section-title">
                    材料状态
                  </Typography.Title>
                  <StatusTag status={getMaterialBusinessStatus(material.status)} />
                </div>
                {detail.checklist.map((item) => (
                  <Card key={item} className="filing-info-card">
                    <Typography.Paragraph className="filing-copy">
                      {item}
                    </Typography.Paragraph>
                  </Card>
                ))}
              </Space>
            </Card>
            <RegulationCitation
              title="法规依据"
              citations={getFilingCitations(detail.citations)}
            />
            <Button type="primary" onClick={() => navigate('/filing/material-check')}>
              前往完整性检查
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
