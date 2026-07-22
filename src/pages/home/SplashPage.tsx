import { useEffect } from 'react';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

export function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/home', { replace: true });
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <main className="splash-screen">
      <section className="splash-panel">
        <img
          src="/logo-mark.svg"
          alt="数据跨境服务平台标识"
          className="splash-logo"
        />
        <Typography.Text className="splash-eyebrow">
          Data Cross-Border Service Platform
        </Typography.Text>
        <Typography.Title level={1} className="splash-title">
          数据跨境服务平台
        </Typography.Title>
        <Typography.Paragraph className="splash-subtitle">
          展示环境已就绪，正在进入首页工作台。
        </Typography.Paragraph>
      </section>
    </main>
  );
}
