import { AppstoreOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { StatCard } from '@/components/common/StatCard';
import {
  countryProfiles,
  dataAssets,
  materials,
  regulations,
  reports,
  scenarios,
  serviceProviders,
  trainingCourses,
} from '@/mock';

type SearchScope =
  | 'all'
  | 'regulations'
  | 'countries'
  | 'scenarios'
  | 'assets'
  | 'materials'
  | 'reports'
  | 'providers'
  | 'training';

interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  meta: string[];
  category: SearchScope;
  path?: string;
}

interface SearchSection {
  key: SearchScope;
  label: string;
  description: string;
}

const searchSections: SearchSection[] = [
  { key: 'regulations', label: '法规条目', description: '法规库与重点条款入口。' },
  { key: 'countries', label: '国家画像', description: '跨境机制、监管机构与风险画像。' },
  { key: 'scenarios', label: '研判场景', description: '用于快速进入合规研判链路。' },
  { key: 'assets', label: '数据资产', description: '资产分类、级别与出境目的。' },
  { key: 'materials', label: '备案材料', description: '材料状态、完整性与问题提示。' },
  { key: 'reports', label: '报告中心', description: '报告预览与导出入口。' },
  { key: 'providers', label: '服务机构', description: '机构类型、行业与区域覆盖。' },
  { key: 'training', label: '培训课程', description: '汽车数据课程与场景工作坊。' },
];

const createResults = (): SearchResultItem[] => [
  ...regulations.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.summary,
    meta: [item.country, item.level, item.topics.join(' / ')],
    category: 'regulations' as const,
    path: `/regulations/detail/${item.id}`,
  })),
  ...countryProfiles.map((item) => ({
    id: item.id,
    title: `${item.name} 合规画像`,
    description: item.keyRisks.join('；'),
    meta: [item.region, item.crossBorderMechanisms.join(' / ')],
    category: 'countries' as const,
    path: '/regulations/country',
  })),
  ...scenarios.map((item) => ({
    id: item.id,
    title: item.name,
    description: item.summary,
    meta: [item.industry, `${item.fromCountry} -> ${item.toCountry}`, item.recommendedPath],
    category: 'scenarios' as const,
    path: '/assessment/path',
  })),
  ...dataAssets.slice(0, 18).map((item) => ({
    id: item.id,
    title: item.name,
    description: `${item.system} · ${item.purpose}`,
    meta: [item.category, item.level, item.destination],
    category: 'assets' as const,
    path: item.id ? `/governance/assets/${item.id}` : '/governance/assets',
  })),
  ...materials.map((item) => ({
    id: item.id,
    title: item.name,
    description: `${item.completeness}% 完整度，最近更新 ${item.updatedAt.slice(0, 10)}`,
    meta: [item.filingType, item.status, `${item.issues.length} 个问题`],
    category: 'materials' as const,
    path: `/filing/materials/${item.id}`,
  })),
  ...reports.map((item) => ({
    id: item.id,
    title: item.name,
    description: item.summary,
    meta: [item.type, item.status === 'generated' ? '已生成' : '草稿', item.createdAt.slice(0, 10)],
    category: 'reports' as const,
    path: `/reports/${item.id}`,
  })),
  ...serviceProviders.map((item) => ({
    id: item.id,
    title: item.name,
    description: item.summary,
    meta: [item.type, item.regions.join(' / '), item.tags.join(' / ')],
    category: 'providers' as const,
    path: '/services/providers',
  })),
  ...trainingCourses.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.summary,
    meta: [item.category, item.level, item.duration],
    category: 'training' as const,
    path: '/services/training',
  })),
];

const allResults = createResults();

export function SearchPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [scope, setScope] = useState<SearchScope>('all');

  const filteredResults = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return allResults.filter((item) => {
      const matchesScope = scope === 'all' || item.category === scope;
      const matchesKeyword =
        !normalizedKeyword ||
        [item.title, item.description, ...item.meta].join(' ').toLowerCase().includes(normalizedKeyword);

      return matchesScope && matchesKeyword;
    });
  }, [keyword, scope]);

  const groupedResults = useMemo(
    () =>
      searchSections
        .map((section) => ({
          ...section,
          items: filteredResults.filter((item) => item.category === section.key),
        }))
        .filter((section) => section.items.length > 0),
    [filteredResults],
  );

  return (
    <div className="search-page">
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <StatCard
            title="搜索结果"
            value={filteredResults.length}
            suffix="项"
            description="统一检索法规、场景、资产、材料、报告和服务机构。"
            icon={<FileSearchOutlined />}
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="结果类型"
            value={groupedResults.length}
            suffix="类"
            description="按业务对象分组展示，减少跨模块跳转成本。"
            icon={<AppstoreOutlined />}
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="默认索引"
            value={allResults.length}
            suffix="项"
            description="当前接入平台展示数据索引，适合跨模块检索和路径联动。"
          />
        </Col>
      </Row>

      <SearchFilterBar
        keyword={keyword}
        keywordPlaceholder="搜索法规、国家、报告、资产、材料或服务机构"
        onKeywordChange={setKeyword}
        filters={[
          {
            key: 'scope',
            label: '结果范围',
            placeholder: '选择结果范围',
            options: [
              { label: '全部', value: 'all' },
              ...searchSections.map((item) => ({ label: item.label, value: item.key })),
            ],
          },
        ]}
        values={{ scope }}
        onFilterChange={(_, value) => setScope((value as SearchScope | undefined) ?? 'all')}
        onReset={() => {
          setKeyword('');
          setScope('all');
        }}
      />

      {filteredResults.length === 0 ? (
        <EmptyState
          title="没有找到匹配内容"
          description="请更换关键词，或将结果范围切回“全部”后重新搜索。"
          actionLabel="清空条件"
          onAction={() => {
            setKeyword('');
            setScope('all');
          }}
        />
      ) : (
        <Space direction="vertical" size={20} className="search-section-stack">
          <Typography.Paragraph className="search-copy">
            当前结果已按业务类型分组。点击“打开入口”会跳转到对应模块的详情页或列表页。
          </Typography.Paragraph>

          {groupedResults.map((section) => (
            <Card key={section.key} className="ui-card search-section-card" bordered={false}>
              <Space direction="vertical" size={16} className="search-section-stack">
                <div className="search-section-head">
                  <div>
                    <Typography.Title level={4} className="section-title">
                      {section.label}
                    </Typography.Title>
                    <Typography.Paragraph className="search-copy">
                      {section.description}
                    </Typography.Paragraph>
                  </div>
                  <Tag>{section.items.length} 项</Tag>
                </div>

                <div className="search-result-grid">
                  {section.items.slice(0, 6).map((item) => (
                    <article key={`${section.key}-${item.id}`} className="search-result-item">
                      <Space direction="vertical" size={12} className="search-section-stack">
                        <div>
                          <Typography.Title level={5} className="search-result-title">
                            {item.title}
                          </Typography.Title>
                          <Typography.Paragraph className="search-copy">
                            {item.description}
                          </Typography.Paragraph>
                        </div>
                        <Space wrap size={[8, 8]}>
                          {item.meta.map((metaItem) => (
                            <Tag key={metaItem}>{metaItem}</Tag>
                          ))}
                        </Space>
                        <Space wrap>
                          <Button
                            type="primary"
                            onClick={() => navigate(item.path ?? '/home')}
                          >
                            打开入口
                          </Button>
                        </Space>
                      </Space>
                    </article>
                  ))}
                </div>
              </Space>
            </Card>
          ))}
        </Space>
      )}
    </div>
  );
}
