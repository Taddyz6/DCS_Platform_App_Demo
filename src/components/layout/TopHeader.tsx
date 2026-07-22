import { useEffect, useState } from 'react';
import {
  ClockCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Layout, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import type { AppRouteMeta } from '@/app/navigation';

const { Header } = Layout;

interface TopHeaderProps {
  route: AppRouteMeta;
}

export function TopHeader({ route }: TopHeaderProps) {
  const navigate = useNavigate();
  const [now, setNow] = useState(() => dayjs().format('YYYY-MM-DD HH:mm:ss'));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <Header className="top-header">
      <div>
        <Typography.Text className="top-header-label">
          当前模块
        </Typography.Text>
        <Typography.Title level={4} className="top-header-title">
          {route.sectionLabel}
        </Typography.Title>
      </div>

      <Space size={12}>
        <Tag color="cyan" className="top-header-tag">
          产品展示环境
        </Tag>
        <Tag icon={<ClockCircleOutlined />} className="top-header-time">
          {now}
        </Tag>
        <Button
          icon={<SearchOutlined />}
          onClick={() => navigate('/search')}
        >
          全局搜索
        </Button>
      </Space>
    </Header>
  );
}
