import { SolutionOutlined, TeamOutlined, UserSwitchOutlined, ReadOutlined } from '@ant-design/icons';
import { Button, Card, Col, List, Row, Space, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ActivityLog } from '@/components/common/ActivityLog';
import { ModuleCard } from '@/components/common/ModuleCard';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { ReportCard } from '@/components/common/ReportCard';
import { StatCard } from '@/components/common/StatCard';
import { getFeaturedCourses, getFeaturedProviders, getServicesCitations, getServicesOverview } from './data';
import { useServicesWorkspace } from './useServicesWorkspace';

export function ServicesHomePage() {
  const navigate = useNavigate();
  const { consultations, applications } = useServicesWorkspace();
  const overview = getServicesOverview(consultations, applications);
  const featuredProviders = getFeaturedProviders();
  const featuredCourses = getFeaturedCourses();

  return (
    <div className="services-page">
      <Row gutter={[20, 20]}>
        <Col xs={24} md={12} xl={6}>
          <StatCard title="专业机构" value={overview.providerCount} suffix="家" description="覆盖法务、咨询、认证和安全技术服务商。" icon={<TeamOutlined />} />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <StatCard title="培训课程" value={overview.trainingCount} suffix="门" description="覆盖基础课程、实务课程和工作坊。" icon={<ReadOutlined />} />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <StatCard title="咨询记录" value={overview.consultationCount} suffix="条" description="保存专家咨询问题和处理状态。" icon={<UserSwitchOutlined />} />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <StatCard title="服务申请" value={overview.applicationCount} suffix="项" description="用于展示服务申请、需求说明和后续跟进。" icon={<SolutionOutlined />} />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={4}>
          <ModuleCard title="专业机构" description="按地区、类型和行业查看专业机构列表。" icon={<span className="feature-dot" />} meta="机构筛选" actionLabel="查看机构" onAction={() => navigate('/services/providers')} />
        </Col>
        <Col xs={24} xl={4}>
          <ModuleCard title="专家咨询" description="提交咨询问题并在平台工作区留存记录。" icon={<span className="feature-dot" />} meta="咨询表单" actionLabel="发起咨询" onAction={() => navigate('/services/consultation')} />
        </Col>
        <Col xs={24} xl={4}>
          <ModuleCard title="培训课程" description="查看课程摘要、级别和资料下载项。" icon={<span className="feature-dot" />} meta="课程列表" actionLabel="查看课程" onAction={() => navigate('/services/training')} />
        </Col>
        <Col xs={24} xl={4}>
          <ModuleCard title="服务申请" description="提交项目化需求并跟踪申请状态。" icon={<span className="feature-dot" />} meta="申请记录" actionLabel="创建申请" onAction={() => navigate('/services/application')} />
        </Col>
        <Col xs={24} xl={8}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="services-list-stack">
              <Typography.Title level={5} className="section-title">
                当前建议
              </Typography.Title>
              <Typography.Paragraph className="services-copy">
                高风险跨境场景建议优先结合专业机构和安全技术方案；材料不完整场景建议直接进入专家咨询或服务申请。
              </Typography.Paragraph>
              <Space wrap>
                <Button type="primary" onClick={() => navigate('/services/application')}>
                  提交服务申请
                </Button>
                <Button onClick={() => navigate('/services/consultation')}>
                  发起咨询
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="services-list-stack">
              <div className="regulation-section-head">
                <Typography.Title level={5} className="section-title">
                  推荐机构
                </Typography.Title>
                <Button type="link" onClick={() => navigate('/services/providers')}>
                  查看全部
                </Button>
              </div>
              <List
                dataSource={featuredProviders}
                renderItem={(item) => (
                  <List.Item className="services-list-item">
                    <List.Item.Meta
                      title={item.name}
                      description={`${item.type} · ${item.regions.join('、')}`}
                    />
                    <Space wrap>
                      {item.tags.slice(0, 2).map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <ActivityLog
            title="最近服务动作"
            entries={[
              ...consultations.slice(0, 2).map((item) => ({
                id: item.id,
                title: item.title,
                time: item.createdAt,
                operator: item.category,
                status: item.status,
              })),
              ...applications.slice(0, 2).map((item) => ({
                id: item.id,
                title: item.serviceType,
                time: item.createdAt,
                operator: item.contactName,
                status: item.status,
              })),
            ]}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={8}>
          <RegulationCitation
            title="服务相关法规"
            citations={getServicesCitations(['reg-cn-pipl', 'reg-cn-standard-contract', 'reg-cn-dsl'])}
          />
        </Col>
        {featuredCourses.slice(0, 2).map((course) => (
          <Col xs={24} xl={8} key={course.id}>
            <ReportCard
              title={course.title}
              type={course.category}
              summary={course.summary}
              updatedAt={course.duration}
              status="completed"
              onPreview={() => navigate('/services/training')}
              onDownload={() => navigate('/services/training')}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
