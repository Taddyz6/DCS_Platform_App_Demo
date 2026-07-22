import { Tag, Typography } from 'antd';
import type { AppRouteMeta } from '@/app/navigation';

interface RoutePageHeaderProps {
  route: AppRouteMeta;
}

export function RoutePageHeader({ route }: RoutePageHeaderProps) {
  return (
    <div className="route-page-header">
      <div>
        <Typography.Title level={2} className="route-page-title">
          {route.title}
        </Typography.Title>
        <Typography.Paragraph className="route-page-description">
          {route.description}
        </Typography.Paragraph>
      </div>
      <Tag color="processing" className="route-page-tag">
        {route.path}
      </Tag>
    </div>
  );
}
