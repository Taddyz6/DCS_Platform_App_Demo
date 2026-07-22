import { useEffect, useMemo, useState } from 'react';
import { Layout } from 'antd';
import dayjs from 'dayjs';
import { Outlet, useLocation } from 'react-router-dom';
import {
  getSectionByKey,
  matchRouteMeta,
  routeCatalog,
} from '@/app/navigation';
import { pushRecentVisit } from '@/app/preferences';
import { useAppStore } from '@/app/store';
import { AppBreadcrumbs } from './AppBreadcrumbs';
import { RoutePageHeader } from './RoutePageHeader';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

const { Content } = Layout;

const defaultRoute = routeCatalog[0];

export function AppLayout() {
  const location = useLocation();
  const setLastVisitedRoute = useAppStore((state) => state.setLastVisitedRoute);
  const currentRoute = matchRouteMeta(location.pathname) ?? defaultRoute;
  const [openKeys, setOpenKeys] = useState<string[]>(
    getSectionByKey(currentRoute.sectionKey)?.children
      ? [currentRoute.sectionKey]
      : [],
  );

  useEffect(() => {
    setLastVisitedRoute(location.pathname);
    pushRecentVisit(
      location.pathname,
      currentRoute.title,
      dayjs().format('YYYY-MM-DD HH:mm:ss'),
    );
  }, [currentRoute, location.pathname, setLastVisitedRoute]);

  useEffect(() => {
    setOpenKeys(
      getSectionByKey(currentRoute.sectionKey)?.children
        ? [currentRoute.sectionKey]
        : [],
    );
  }, [currentRoute.sectionKey]);

  const selectedKeys = useMemo(
    () => [currentRoute.activeMenuKey],
    [currentRoute.activeMenuKey],
  );

  return (
    <Layout className="app-shell">
      <Sidebar
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys as string[])}
      />
      <Layout className="app-main">
        <TopHeader route={currentRoute} />
        <Content className="app-content">
          <div className="app-content-inner">
            <AppBreadcrumbs />
            <RoutePageHeader route={currentRoute} />
            <div className="app-page-body">
              <Outlet />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
