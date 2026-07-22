import { Button, Card, Col, Form, Input, Row, Select, Space, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { scenarios } from '@/mock';
import { createCertificationPayload, getScenarioById } from './data';
import { useFilingWorkspace } from './useFilingWorkspace';

interface CertificationValues {
  scenarioId: string;
  applicant: string;
  governanceMaturity: string;
  auditReadiness: string;
  notes: string;
}

export function FilingCertificationPage() {
  const navigate = useNavigate();
  const { createEntry } = useFilingWorkspace();
  const [form] = Form.useForm<CertificationValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const submit = (values: CertificationValues) => {
    const scenario = getScenarioById(values.scenarioId);

    if (!scenario) {
      return;
    }

    const payload = createCertificationPayload({
      scenario,
      governanceMaturity: values.governanceMaturity,
      auditReadiness: values.auditReadiness,
      applicant: values.applicant,
      notes: values.notes,
    });
    const { materialId } = createEntry(payload);
    void messageApi.success('认证准备材料已创建');
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
            governanceMaturity: 'medium',
            auditReadiness: 'partial',
          }}
          onFinish={submit}
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={12}>
              <Form.Item label="适用场景" name="scenarioId" rules={[{ required: true }]}>
                <Select
                  options={scenarios.map((scenario) => ({
                    label: scenario.name,
                    value: scenario.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="准备责任人" name="applicant" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="治理成熟度" name="governanceMaturity" rules={[{ required: true }]}>
                <Select
                  options={[
                    { label: '较高', value: 'high' },
                    { label: '中等', value: 'medium' },
                    { label: '基础阶段', value: 'low' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="审计准备度" name="auditReadiness" rules={[{ required: true }]}>
                <Select
                  options={[
                    { label: '已准备就绪', value: 'ready' },
                    { label: '部分准备', value: 'partial' },
                    { label: '待建立', value: 'weak' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="补充说明" name="notes">
                <Input.TextArea
                  rows={4}
                  placeholder="例如：当前制度目录已完成汇总，待补充组织架构与审计闭环证据。"
                />
              </Form.Item>
            </Col>
          </Row>

          <Card className="filing-hint-card">
            <Typography.Paragraph className="filing-copy">
              认证页面会把自测准备结果转换成材料中心可继续编辑的准备包，并纳入办理记录。
            </Typography.Paragraph>
          </Card>

          <Space wrap>
            <Button type="primary" htmlType="submit">
              创建认证材料
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
