import { Button, Card, Col, Form, Input, Radio, Row, Select, Space, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { scenarios } from '@/mock';
import { createSecurityAssessmentPayload, getScenarioById } from './data';
import { useFilingWorkspace } from './useFilingWorkspace';

interface SecurityAssessmentValues {
  scenarioId: string;
  applicant: string;
  dataScale: string;
  includesImportantData: string;
  notes: string;
}

export function FilingSecurityAssessmentPage() {
  const navigate = useNavigate();
  const { createEntry } = useFilingWorkspace();
  const [form] = Form.useForm<SecurityAssessmentValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const submit = (values: SecurityAssessmentValues) => {
    const scenario = getScenarioById(values.scenarioId);

    if (!scenario) {
      return;
    }

    const payload = createSecurityAssessmentPayload({
      scenario,
      dataScale: values.dataScale,
      includesImportantData: values.includesImportantData,
      applicant: values.applicant,
      notes: values.notes,
    });
    const { materialId } = createEntry(payload);
    void messageApi.success('安全评估申报材料已创建');
    navigate(`/filing/materials/${materialId}`);
  };

  return (
    <div className="filing-page">
      {contextHolder}
      <Card className="ui-card" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            scenarioId: scenarios[0]?.id,
            applicant: '平台项目负责人',
            dataScale: 'medium',
            includesImportantData: 'yes',
          }}
          onFinish={submit}
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={12}>
              <Form.Item label="业务场景" name="scenarioId" rules={[{ required: true }]}>
                <Select
                  options={scenarios.map((scenario) => ({
                    label: scenario.name,
                    value: scenario.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="申报责任人" name="applicant" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="拟出境数据规模" name="dataScale" rules={[{ required: true }]}>
                <Select
                  options={[
                    { label: '较小', value: 'small' },
                    { label: '中等', value: 'medium' },
                    { label: '较大', value: 'large' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label="是否涉及重要数据或高敏感数据"
                name="includesImportantData"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Space wrap>
                    <Radio value="yes">是</Radio>
                    <Radio value="no">否</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="补充说明" name="notes">
                <Input.TextArea
                  rows={4}
                  placeholder="例如：当前场景已完成重要数据辅助识别，待补充接收方保护能力证明。"
                />
              </Form.Item>
            </Col>
          </Row>

          <Card className="filing-hint-card">
            <Typography.Paragraph className="filing-copy">
              生成后会自动落入材料中心，包含材料清单、问题项、文档预览和上传元数据入口。
            </Typography.Paragraph>
          </Card>

          <Space wrap>
            <Button type="primary" htmlType="submit">
              创建申报材料
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
