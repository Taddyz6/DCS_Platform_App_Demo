import { Layout, Menu, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { navigationMenuItems, primaryNavigation } from '@/app/navigation';

const { Sider } = Layout;

interface SidebarProps {
  selectedKeys: string[];
  openKeys: string[];
  onOpenChange: MenuProps['onOpenChange'];
}

export function Sidebar({
  selectedKeys,
  openKeys,
  onOpenChange,
}: SidebarProps) {
  const navigate = useNavigate();

  return (
    <Sider width={272} className="app-sidebar">
      <div className="sidebar-brand">
        <img
          src="/logo-mark.svg"
          alt="汽车数据跨境管理服务平台标识"
          className="sidebar-logo"
        />
        <div>
          <Typography.Title level={4} className="sidebar-title">
            汽车数据跨境管理服务平台
          </Typography.Title>
          <Typography.Text className="sidebar-subtitle">
            Automotive Data Cross-Border Management Service Platform
          </Typography.Text>
        </div>
      </div>

      <button
        type="button"
        className="sidebar-home-link"
        onClick={() => navigate('/home')}
      >
        返回首页工作台
      </button>

      <Menu
        mode="inline"
        className="sidebar-menu"
        items={navigationMenuItems}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={({ key }) => {
          const childPath = primaryNavigation
            .flatMap((section) => section.children ?? [])
            .find((child) => child.key === key)?.path;

          if (childPath) {
            navigate(childPath);
            return;
          }

          const sectionPath = primaryNavigation.find((item) => item.key === key)?.path;

          if (sectionPath) {
            navigate(sectionPath);
          }
        }}
      />
    </Sider>
  );
}
