import { Button, Card, Col, Form, Input, Radio, Row, Select, Space, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { scenarios } from '@/mock';
import { createStandardContractPayload, getScenarioById } from './data';
import { useFilingWorkspace } from './useFilingWorkspace';

interface StandardContractValues {
  scenarioId: string;
  applicant: string;
  personalInfoVolume: string;
  recipientType: string;
  notes: string;
}

export function FilingStandardContractPage() {
  const navigate = useNavigate();
  const { createEntry } = useFilingWorkspace();
  const [form] = Form.useForm<StandardContractValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const submit = (values: StandardContractValues) => {
    const scenario = getScenarioById(values.scenarioId);

    if (!scenario) {
      return;
    }

    const payload = createStandardContractPayload({
      scenario,
      personalInfoVolume: values.personalInfoVolume,
      recipientType: values.recipientType,
      applicant: values.applicant,
      notes: values.notes,
    });
    const { materialId } = createEntry(payload);
    void messageApi.success('标准合同备案材料已创建');
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
            scenarioId: scenarios[1]?.id,
            applicant: '平台项目负责人',
            personalInfoVolume: 'medium',
            recipientType: 'internal',
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
              <Form.Item label="备案责任人" name="applicant" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="个人信息量级" name="personalInfoVolume" rules={[{ required: true }]}>
                <Select
                  options={[
                    { label: '较低', value: 'low' },
                    { label: '中等', value: 'medium' },
                    { label: '较高', value: 'high' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="接收方类型" name="recipientType" rules={[{ required: true }]}>
                <Radio.Group>
                  <Space wrap>
                    <Radio value="internal">集团内部接收方</Radio>
                    <Radio value="external">外部接收方</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="补充说明" name="notes">
                <Input.TextArea
                  rows={4}
                  placeholder="例如：当前已形成标准合同文本草案，待补充联系人和字段清单。"
                />
              </Form.Item>
            </Col>
          </Row>

          <Card className="filing-hint-card">
            <Typography.Paragraph className="filing-copy">
              生成后会自动创建备案材料，便于继续编辑合同附件说明、上传文件元数据并执行完整性检查。
            </Typography.Paragraph>
          </Card>

          <Space wrap>
            <Button type="primary" htmlType="submit">
              创建备案材料
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
