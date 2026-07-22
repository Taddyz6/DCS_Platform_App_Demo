import { Typography } from 'antd';

export function GovernanceFlowDashboard() {
  return (
    <section className="home-cockpit home-cockpit-showcase governance-flow-showcase">
      <div className="home-cockpit-header">
        <div>
          <Typography.Text className="home-section-eyebrow">
            Governance Data Flow
          </Typography.Text>
          <Typography.Title level={3} className="home-cockpit-title">
            汽车数据治理流转全景
          </Typography.Title>
        </div>
        <Typography.Paragraph className="home-cockpit-copy">
          将汽车数据资产、分类分级结果与跨境接收节点映射到全球链路，动态呈现数据流向、节点覆盖和实时传输状态。
        </Typography.Paragraph>
      </div>

      <div className="home-cockpit-showcase-frame">
        <iframe
          className="home-cockpit-showcase-embed"
          src="/home-global-data-flow.html"
          title="汽车数据治理流转全景"
        />
      </div>
    </section>
  );
}
