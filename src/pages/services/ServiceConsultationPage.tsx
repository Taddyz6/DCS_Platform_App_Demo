import { Button, Card, Col, Form, Input, Row, Select, Space, Typography, message } from 'antd';
import { ActivityLog } from '@/components/common/ActivityLog';
import { consultationCategories } from './data';
import { serviceProviders } from '@/mock';
import { useServicesWorkspace } from './useServicesWorkspace';

interface ConsultationValues {
  title: string;
  category: string;
  providerId?: string;
  question: string;
}

export function ServiceConsultationPage() {
  const [form] = Form.useForm<ConsultationValues>();
  const { consultations, createConsultation } = useServicesWorkspace();
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className="services-page">
      {contextHolder}
      <Card className="ui-card" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ category: consultationCategories[0] }}
          onFinish={(values) => {
            createConsultation({
              title: values.title,
              category: values.category,
              providerId: values.providerId,
              question: values.question,
              status: 'review',
            });
            void messageApi.success('咨询记录已保存到平台工作区');
            form.resetFields();
          }}
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={12}>
              <Form.Item label="咨询标题" name="title" rules={[{ required: true }]}>
                <Input placeholder="例如：欧盟研发场景重要数据边界咨询" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="咨询类型" name="category" rules={[{ required: true }]}>
                <Select options={consultationCategories.map((item) => ({ label: item, value: item }))} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="指定机构（可选）" name="providerId">
                <Select allowClear options={serviceProviders.map((item) => ({ label: item.name, value: item.id }))} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="问题描述" name="question" rules={[{ required: true }]}>
                <Input.TextArea rows={5} placeholder="例如：需要确认场景适用路径、补件清单和监管关注点。" />
              </Form.Item>
            </Col>
          </Row>
          <Space wrap>
            <Button type="primary" htmlType="submit">
              提交咨询
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        </Form>
      </Card>

      <ActivityLog
        title="咨询记录"
        entries={consultations.map((item) => ({
          id: item.id,
          title: item.title,
          time: item.createdAt,
          operator: item.category,
          status: item.status,
        }))}
      />
    </div>
  );
}
