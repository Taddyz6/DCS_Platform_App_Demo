import { CheckCircleOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import { startTransition, useEffect, useState } from 'react';
import { homeServiceFlowItems } from './demoData';

export function HomeServiceFlow() {
  const [activeKey, setActiveKey] = useState(homeServiceFlowItems[0]?.key ?? '');

  useEffect(() => {
    if (!activeKey) {
      return;
    }

    const timer = window.setInterval(() => {
      const currentIndex = homeServiceFlowItems.findIndex((item) => item.key === activeKey);
      const nextItem = homeServiceFlowItems[(currentIndex + 1) % homeServiceFlowItems.length];

      startTransition(() => {
        setActiveKey(nextItem.key);
      });
    }, 3200);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeKey]);

  return (
    <section className="home-service-flow">
      <div className="home-service-flow-header">
        <div>
          <Typography.Text className="home-section-eyebrow">
            Dynamic Service Loop
          </Typography.Text>
          <Typography.Title level={3} className="home-service-flow-title">
            横向动态服务闭环
          </Typography.Title>
        </div>
        <Typography.Paragraph className="home-service-flow-copy">
          将首页展示从静态时间线改成可轮播、可点选的横向流程图，
          更适合对外演示平台如何从规则识别走到治理落地与服务交付。
        </Typography.Paragraph>
      </div>

      <div className="home-service-flow-track" aria-label="平台服务闭环流程">
        {homeServiceFlowItems.map((item, index) => {
          const active = item.key === activeKey;

          return (
            <div key={item.key} className="home-service-flow-segment">
              <button
                type="button"
                className={active ? 'home-service-flow-card is-active' : 'home-service-flow-card'}
                style={{ ['--flow-accent' as string]: item.accent }}
                onClick={() => {
                  startTransition(() => {
                    setActiveKey(item.key);
                  });
                }}
              >
                <span className="home-service-flow-index">0{index + 1}</span>
                <Typography.Title level={5} className="home-service-flow-card-title">
                  {item.title}
                </Typography.Title>
                <Typography.Paragraph className="home-service-flow-card-copy">
                  {item.description}
                </Typography.Paragraph>
                <div className="home-service-flow-card-meta">
                  <span>{item.signal}</span>
                  <strong>{item.deliverable}</strong>
                </div>
                {active ? (
                  <span className="home-service-flow-active-tag">
                    <CheckCircleOutlined />
                    当前演示
                  </span>
                ) : null}
              </button>
              {index < homeServiceFlowItems.length - 1 ? (
                <div className={active ? 'home-service-flow-connector is-active' : 'home-service-flow-connector'}>
                  <span className="home-service-flow-pulse" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <Card className="home-service-flow-detail-card" bordered={false}>
        {homeServiceFlowItems
          .filter((item) => item.key === activeKey)
          .map((item) => (
            <div key={item.key} className="home-service-flow-detail">
              <div>
                <Typography.Text className="home-service-flow-detail-label">
                  当前阶段
                </Typography.Text>
                <Typography.Title level={4} className="home-service-flow-detail-title">
                  {item.title}
                </Typography.Title>
              </div>
              <Typography.Paragraph className="home-service-flow-detail-copy">
                {item.description}
              </Typography.Paragraph>
              <div className="home-service-flow-detail-grid">
                <div className="home-service-flow-detail-item">
                  <span>输入信号</span>
                  <strong>{item.signal}</strong>
                </div>
                <div className="home-service-flow-detail-item">
                  <span>输出结果</span>
                  <strong>{item.deliverable}</strong>
                </div>
              </div>
            </div>
          ))}
      </Card>
    </section>
  );
}
