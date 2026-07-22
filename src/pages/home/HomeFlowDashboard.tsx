import { Typography } from 'antd';

export function HomeFlowDashboard() {
  return (
    <section className="home-cockpit home-cockpit-showcase">
      <div className="home-cockpit-header">
        <div>
          <Typography.Text className="home-section-eyebrow">
            Interactive Data Flow
          </Typography.Text>
          <Typography.Title level={3} className="home-cockpit-title">
            数据流转态势驾驶舱
          </Typography.Title>
        </div>
        <Typography.Paragraph className="home-cockpit-copy">
          当前模块已切换为全屏化数据流转大屏展示，直接承载跨境链路、节点分布与实时流转态势，
          保持首页结构不变，只替换这一块展示内容。
        </Typography.Paragraph>
      </div>

      <div className="home-cockpit-showcase-frame">
        <iframe
          className="home-cockpit-showcase-embed"
          src="/home-global-data-flow.html"
          title="全球数据流转态势"
        />
      </div>
    </section>
  );
}
