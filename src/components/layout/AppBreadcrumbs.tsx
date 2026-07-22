import { Breadcrumb } from 'antd';
import { Link, useMatches } from 'react-router-dom';

interface RouteHandle {
  breadcrumb?: string;
}

export function AppBreadcrumbs() {
  const matches = useMatches();

  const breadcrumbItems = matches
    .filter(
      (match): match is typeof match & { handle: RouteHandle } =>
        typeof match.handle === 'object' &&
        match.handle !== null &&
        'breadcrumb' in match.handle &&
        typeof match.handle.breadcrumb === 'string',
    )
    .map((match, index, list) => ({
      title:
        index === list.length - 1 ? (
          match.handle.breadcrumb
        ) : (
          <Link to={match.pathname}>{match.handle.breadcrumb}</Link>
        ),
    }));

  return <Breadcrumb className="app-breadcrumb" items={breadcrumbItems} />;
}
