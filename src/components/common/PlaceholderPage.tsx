import { Button, Col, Row, Space, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { AppRouteMeta } from '@/app/navigation';
import { ComponentPlayground } from './ComponentPlayground';
import { ModuleCard } from './ModuleCard';
import { StatCard } from './StatCard';

interface PlaceholderPageProps {
  route: AppRouteMeta;
}

export function PlaceholderPage({ route }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="placeholder-page">
      <div className="ui-card placeholder-hero">
        <Space direction="vertical" size={18}>
          <Tag color="blue" className="placeholder-tag">
            演示占位页
          </Tag>
          <Typography.Title level={2} className="placeholder-title">
            {route.title}
          </Typography.Title>
          <Typography.Paragraph className="placeholder-copy">
            {route.description}
          </Typography.Paragraph>
          <Space wrap>
            <Button type="primary">当前路由已接通</Button>
            <Button onClick={() => navigate('/home')}>返回首页工作台</Button>
          </Space>
        </Space>
      </div>

      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <StatCard
            title="当前模块"
            value={route.sectionLabel}
            description="页面头部、面包屑和侧边菜单已统一联动。"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="预留功能"
            value={route.features.length}
            suffix="项"
            description="功能点会在后续阶段逐步替换为完整业务数据和交互。"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="演示状态"
            value="可访问"
            description="所有主操作按钮和页面入口均保持可点击。"
          />
        </Col>
        {route.features.map((feature) => (
          <Col xs={24} md={8} key={feature}>
            <ModuleCard
              title={feature}
              description="对应页面结构已预留，后续阶段会接入通用组件、业务数据和交互逻辑。"
              icon={<span className="feature-dot" />}
              meta="组件已接入"
              actionLabel="查看首页"
              onAction={() => navigate('/home')}
            />
          </Col>
        ))}
      </Row>

      <ComponentPlayground route={route} />

      <div className="ui-card placeholder-note-card">
        <Typography.Paragraph className="placeholder-note">
          本系统结果仅用于产品演示和辅助分析，不构成正式法律意见、行政认定或监管申报结论。
        </Typography.Paragraph>
      </div>
    </div>
  );
}
