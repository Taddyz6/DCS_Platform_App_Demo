import { Button, Card, Col, Form, Input, Row, Select, Space, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { ResultSummary } from '@/components/common/ResultSummary';
import { Questionnaire } from '@/components/forms/Questionnaire';
import {
  createPiaPayload,
  getAssetById,
  getGovernanceCitations,
  governanceAssetOptions,
  piaQuestions,
} from './data';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';

interface PiaFormValues {
  assetId: string;
  processingPurpose: string;
}

export function GovernancePiaPage() {
  const [form] = Form.useForm<PiaFormValues>();
  const [answers, setAnswers] = useState<Record<string, string | undefined>>({});
  const [selectedRecordId, setSelectedRecordId] = useState<string | undefined>();
  const { createRecord, getDetailById, getRecordById, records } = useGovernanceWorkspace();
  const [messageApi, contextHolder] = message.useMessage();

  const latestRecord = useMemo(
    () => records.find((record) => record.type === 'pia'),
    [records],
  );
  const activeRecord = getRecordById(selectedRecordId) ?? latestRecord;
  const activeDetail = getDetailById(selectedRecordId) ?? (latestRecord ? getDetailById(latestRecord.id) : undefined);

  const submit = (values: PiaFormValues) => {
    const asset = getAssetById(values.assetId);

    if (!asset) {
      return;
    }

    const payload = createPiaPayload({
      asset,
      answers,
      processingPurpose: values.processingPurpose,
    });
    const recordId = createRecord(payload);
    setSelectedRecordId(recordId);
    void messageApi.success('PIA 结果已生成并写入平台工作区');
  };

  return (
    <div className="governance-page">
      {contextHolder}
      <Card className="ui-card" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            assetId: governanceAssetOptions[0]?.value,
            processingPurpose: '跨境协同分析与运维支持',
          }}
          onFinish={submit}
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={12}>
              <Form.Item
                label="选择资产"
                name="assetId"
                rules={[{ required: true, message: '请选择资产' }]}
              >
                <Select options={governanceAssetOptions} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label="处理目的"
                name="processingPurpose"
                rules={[{ required: true, message: '请输入处理目的' }]}
              >
                <Input placeholder="例如：全球客服、联合研发、运维监测或集团人力协同。" />
              </Form.Item>
            </Col>
          </Row>

          <Questionnaire
            title="PIA 问卷"
            questions={piaQuestions}
            values={answers}
            onChange={(id, value) =>
              setAnswers((current) => ({ ...current, [id]: value }))
            }
          />

          <Space wrap>
            <Button type="primary" htmlType="submit">
              生成 PIA
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setAnswers({});
              }}
            >
              重置
            </Button>
          </Space>
        </Form>
      </Card>

      {activeRecord && activeDetail ? (
        <>
          <ResultSummary
            title={`${activeRecord.name}结果`}
            riskLevel={activeRecord.riskLevel}
            status="completed"
            description={activeRecord.summary}
            metrics={[
              { label: '影响等级', value: activeDetail.outcomeLabel },
              { label: '综合分值', value: String(activeRecord.score) },
              { label: '建议动作', value: activeDetail.recommendedAction },
              { label: '更新时间', value: activeRecord.updatedAt.slice(0, 16) },
            ]}
          />

          <Row gutter={[20, 20]}>
            <Col xs={24} xl={16}>
              <DocumentPreview
                title={activeDetail.reportName}
                subtitle="PIA 文档预览"
                sections={activeDetail.sections}
              />
            </Col>
            <Col xs={24} xl={8}>
              <Space direction="vertical" size={20} className="governance-side-stack">
                <RegulationCitation
                  title="法规依据"
                  citations={getGovernanceCitations(activeRecord.citations)}
                />
                <Card className="ui-card" bordered={false}>
                  <Space direction="vertical" size={16} className="governance-list-stack">
                    <Typography.Title level={5} className="section-title">
                      待补充措施
                    </Typography.Title>
                    {activeDetail.pendingItems.map((item) => (
                      <Card key={item} className="governance-info-card">
                        <Typography.Paragraph className="governance-copy">
                          {item}
                        </Typography.Paragraph>
                      </Card>
                    ))}
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </>
      ) : null}
    </div>
  );
}
