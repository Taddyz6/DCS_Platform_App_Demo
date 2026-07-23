import { Button, Card, Col, Form, Input, Radio, Row, Select, Space, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingState } from '@/components/common/LoadingState';
import { scenarios } from '@/mock';
import { createAssessmentPayloadFromPrecheck, getScenarioById } from './data';
import { useAssessmentWorkspace } from './useAssessmentWorkspace';

interface PrecheckFormValues {
  scenarioId: string;
  dataCount: string;
  destinationPurpose: string;
  containsSensitiveInfo: string;
}

export function AssessmentPrecheckPage() {
  const navigate = useNavigate();
  const { createRecord } = useAssessmentWorkspace();
  const [form] = Form.useForm<PrecheckFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = (values: PrecheckFormValues) => {
    const scenario = getScenarioById(values.scenarioId);

    if (!scenario) {
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      const payload = createAssessmentPayloadFromPrecheck({
        scenario,
        dataCount: values.dataCount,
        destinationPurpose: values.destinationPurpose,
        containsSensitiveInfo: values.containsSensitiveInfo,
      });
      const recordId = createRecord(payload);
      setSubmitting(false);
      navigate(`/assessment/result/${recordId}`);
    }, 700);
  };

  if (submitting) {
    return (
      <LoadingState
        title="正在执行跨境场景预检"
        description="系统正在根据场景、数据范围和敏感度生成预检结果。"
      />
    );
  }

  return (
    <div className="assessment-page">
      <Card className="ui-card" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            scenarioId: scenarios[0]?.id,
            dataCount: '中等',
            containsSensitiveInfo: 'yes',
          }}
          onFinish={onFinish}
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={12}>
              <Form.Item
                label="业务场景"
                name="scenarioId"
                rules={[{ required: true, message: '请选择业务场景' }]}
              >
                <Select
                  options={scenarios.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label="拟出境数据量级类别"
                name="dataCount"
                rules={[{ required: true, message: '请选择数据量级' }]}
              >
                <Select
                  options={[
                    { label: '较小', value: '较小' },
                    { label: '中等', value: '中等' },
                    { label: '较大', value: '较大' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="出境目的说明"
                name="destinationPurpose"
                rules={[{ required: true, message: '请输入出境目的说明' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="例如：用于整车研发协同、道路测试分析、OTA 全球运维或供应链质量改进。"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="是否涉及敏感个人信息或高敏感数据"
                name="containsSensitiveInfo"
                rules={[{ required: true, message: '请选择敏感度' }]}
              >
                <Radio.Group>
                  <Space wrap>
                    <Radio value="yes">是，涉及敏感信息或高敏感数据</Radio>
                    <Radio value="no">否，仅涉及一般信息</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Card className="assessment-hint-card">
            <Typography.Paragraph className="assessment-copy">
              预检结果至少会输出是否构成数据出境、初步风险等级、推荐后续事项、需补充信息和相关法规。
            </Typography.Paragraph>
          </Card>

          <Space wrap>
            <Button type="primary" htmlType="submit">
              开始预检
            </Button>
            <Button onClick={() => form.resetFields()}>重置表单</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
