import { BankOutlined, FileSearchOutlined, SafetyCertificateOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  primaryNavigation,
} from '@/app/navigation';
import { ModuleCard } from '@/components/common/ModuleCard';
import {
  companyHighlights,
  homeHeroMetrics,
  homeHeroTags,
} from './demoData';
import { HomeServiceFlow } from './HomeServiceFlow';

export function HomePage() {
  const navigate = useNavigate();
  const featuredNavigation = primaryNavigation.filter(
    (section) => !['home', 'services', 'settings'].includes(section.key),
  );

  return (
    <div className="dashboard-page">
      <section className="home-hero">
        <div className="home-hero-grid">
          <div className="home-hero-copy-block">
            <Tag className="home-hero-tag">Automotive Data Cross-Border Platform</Tag>
            <Typography.Text className="home-hero-kicker">
              面向汽车产业协同、跨境流通与合规治理的一体化服务入口
            </Typography.Text>
            <Typography.Title level={1} className="home-hero-title">
              一站式汽车数据跨境管理服务平台
            </Typography.Title>
            <Typography.Title level={2} className="home-hero-subtitle">
              共建数据合作新范式
            </Typography.Title>
            <Typography.Paragraph className="home-hero-copy">
              在全球化数据流通时代，提供专业的汽车数据跨境管理综合解决方案，
              确保研发、测试、制造等关键数据传输安全、合规、高效。
            </Typography.Paragraph>
            <Space wrap size={[10, 10]} className="home-hero-pills">
              {homeHeroTags.map((item) => (
                <span key={item} className="home-hero-pill">
                  {item}
                </span>
              ))}
            </Space>
          </div>

          <Card className="home-hero-panel" bordered={false}>
            <Space direction="vertical" size={18} className="home-hero-panel-stack">
              <div>
                <Typography.Text className="home-section-eyebrow">
                  Platform Snapshot
                </Typography.Text>
                <Typography.Title level={4} className="section-title">
                  平台概览
                </Typography.Title>
              </div>
              <div className="home-hero-metric-grid">
                {homeHeroMetrics.map((item) => (
                  <article key={item.label} className="home-hero-metric-card">
                    <Typography.Text className="home-hero-metric-label">
                      {item.label}
                    </Typography.Text>
                    <Typography.Title level={3} className="home-hero-metric-value">
                      {item.value}
                    </Typography.Title>
                    <Typography.Paragraph className="home-hero-metric-copy">
                      {item.description}
                    </Typography.Paragraph>
                  </article>
                ))}
              </div>
              <div className="home-hero-note">
                <BankOutlined />
                <Typography.Text>
                  平台围绕法规识别、路径研判、评估分析、申报备案与安全流通构建统一业务视图。
                </Typography.Text>
              </div>
            </Space>
          </Card>
        </div>
      </section>

      <section className="home-company-section">
        <div className="home-section-head">
          <div>
            <Typography.Text className="home-section-eyebrow">
              Company
            </Typography.Text>
            <Typography.Title level={3} className="section-title">
              中汽研临港数据科技（上海）有限公司
            </Typography.Title>
          </div>
        </div>
        <Card className="home-company-card" bordered={false}>
          <div className="home-company-grid">
            <div className="home-company-copy-block">
              <Typography.Paragraph className="home-company-copy">
                平台以汽车数据跨境合规、数据治理与安全流通为核心展示方向，
                面向汽车研发、测试验证、制造协同等重点场景，提供覆盖法规识别、
                合规路径研判、数据资产治理、申报备案协同与安全流通建设的一体化解决方案。
              </Typography.Paragraph>
              <Typography.Paragraph className="home-company-copy">
                通过统一的平台能力编排，帮助企业在复杂跨境业务中建立更稳健的规则理解、
                更清晰的协作流程，以及更高效的服务交付模式。
              </Typography.Paragraph>
              <Space wrap size={[12, 12]}>
                <span className="home-company-badge">
                  <SafetyCertificateOutlined />
                  安全合规
                </span>
                <span className="home-company-badge">
                  <FileSearchOutlined />
                  规则洞察
                </span>
                <span className="home-company-badge">
                  <TeamOutlined />
                  产业协同
                </span>
              </Space>
            </div>

            <div className="home-company-highlight-grid">
              {companyHighlights.map((item) => (
                <article key={item.title} className="home-company-highlight-card">
                  <Typography.Text className="home-company-highlight-label">
                    {item.title}
                  </Typography.Text>
                  <Typography.Title level={4} className="home-company-highlight-value">
                    {item.value}
                  </Typography.Title>
                  <Typography.Paragraph className="home-company-highlight-copy">
                    {item.description}
                  </Typography.Paragraph>
                </article>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="home-capability-section">
        <div className="home-section-head">
          <div>
            <Typography.Text className="home-section-eyebrow">
              Capability Matrix
            </Typography.Text>
            <Typography.Title level={3} className="section-title">
              平台能力矩阵
            </Typography.Title>
          </div>
          <Typography.Paragraph className="home-section-copy">
            从法规到治理、从申报到流通，将跨境数据服务能力组织为可协同、可落地、可展示的统一平台。
          </Typography.Paragraph>
        </div>
        <Row gutter={[20, 20]}>
          {featuredNavigation.map((section) => (
            <Col xs={24} xl={8} key={section.key}>
              <ModuleCard
                title={section.label}
                description={section.description}
                icon={section.icon}
                meta={`${section.children?.length ?? 1} 个页面入口`}
                onAction={() => navigate(section.path)}
              />
            </Col>
          ))}
        </Row>
      </section>

      <HomeServiceFlow />
    </div>
  );
}
