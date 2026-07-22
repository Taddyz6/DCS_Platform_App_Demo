import { Button, Card, Col, Row, Space, Tag, Typography, message } from 'antd';
import { trainingCourses } from '@/mock';

export function ServiceTrainingPage() {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className="services-page">
      {contextHolder}
      <Row gutter={[20, 20]}>
        {trainingCourses.map((course) => (
          <Col xs={24} xl={8} key={course.id}>
            <Card className="ui-card" bordered={false}>
              <Space direction="vertical" size={16} className="services-list-stack">
                <Typography.Text>{course.category}</Typography.Text>
                <Typography.Title level={5} className="section-title">
                  {course.title}
                </Typography.Title>
                <Typography.Paragraph className="services-copy">
                  {course.summary}
                </Typography.Paragraph>
                <Space wrap>
                  <Tag>{course.level}</Tag>
                  <Tag>{course.duration}</Tag>
                </Space>
                <Space wrap>
                  {course.downloads.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </Space>
                <Space wrap>
                  <Button onClick={() => void messageApi.info(`已打开 ${course.title} 详情`)}>
                    查看详情
                  </Button>
                  <Button type="primary" onClick={() => void messageApi.success(`已提交 ${course.title} 报名申请`)}>
                    提交报名
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
