import { Button, Card, Col, Form, Input, Row, Select, Space, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DataTable } from '@/components/common/DataTable';
import { StatusTag } from '@/components/common/StatusTag';
import { serviceProviders } from '@/mock';
import type { ServiceApplicationRecord } from './data';
import { serviceTypeOptions } from './data';
import { useServicesWorkspace } from './useServicesWorkspace';

interface ApplicationValues {
  serviceType: string;
  providerId?: string;
  contactName: string;
  summary: string;
}

export function ServiceApplicationPage() {
  const [form] = Form.useForm<ApplicationValues>();
  const { applications, createApplication } = useServicesWorkspace();
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<ServiceApplicationRecord> = [
    { title: '服务类型', dataIndex: 'serviceType', key: 'serviceType', render: (value: string) => <Tag>{value}</Tag> },
    { title: '联系人', dataIndex: 'contactName', key: 'contactName' },
    { title: '申请时间', dataIndex: 'createdAt', key: 'createdAt' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (value) => <StatusTag status={value} /> },
    { title: '需求摘要', dataIndex: 'summary', key: 'summary' },
  ];

  return (
    <div className="services-page">
      {contextHolder}
      <Card className="ui-card" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ serviceType: serviceTypeOptions[0] }}
          onFinish={(values) => {
            createApplication({
              serviceType: values.serviceType,
              providerId: values.providerId,
              contactName: values.contactName,
              summary: values.summary,
              status: 'pending',
            });
            void messageApi.success('服务申请已保存到平台工作区');
            form.resetFields();
          }}
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={12}>
              <Form.Item label="服务类型" name="serviceType" rules={[{ required: true }]}>
                <Select options={serviceTypeOptions.map((item) => ({ label: item, value: item }))} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="联系人" name="contactName" rules={[{ required: true }]}>
                <Input placeholder="例如：平台项目负责人" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="指定机构（可选）" name="providerId">
                <Select allowClear options={serviceProviders.map((item) => ({ label: item.name, value: item.id }))} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="需求说明" name="summary" rules={[{ required: true }]}>
                <Input.TextArea rows={5} placeholder="例如：需要跨境链路方案评估、日志审计能力规划和工作坊支持。" />
              </Form.Item>
            </Col>
          </Row>
          <Space wrap>
            <Button type="primary" htmlType="submit">
              提交申请
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        </Form>
      </Card>

      <DataTable columns={columns} dataSource={applications} rowKey="id" />
    </div>
  );
}
