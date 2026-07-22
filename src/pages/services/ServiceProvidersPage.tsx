import { Button, Drawer, Space, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { DataTable } from '@/components/common/DataTable';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { serviceProviders } from '@/mock';
import type { ServiceProvider } from '@/types/domain';
import { getServiceProviderRegions, getServiceProviderTypes } from './data';

export function ServiceProvidersPage() {
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  const filtered = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    return serviceProviders.filter((item) => {
      const matchesKeyword =
        !normalized ||
        `${item.name} ${item.summary} ${item.tags.join(' ')}`.toLowerCase().includes(normalized);
      const matchesRegion = !region || item.regions.includes(region);
      const matchesType = !type || item.type === type;

      return matchesKeyword && matchesRegion && matchesType;
    });
  }, [keyword, region, type]);

  const columns: ColumnsType<ServiceProvider> = [
    {
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, item) => (
        <Button type="link" className="table-link-button" onClick={() => setSelectedProvider(item)}>
          {item.name}
        </Button>
      ),
    },
    { title: '机构类型', dataIndex: 'type', key: 'type', render: (value: string) => <Tag>{value}</Tag> },
    { title: '地区', key: 'regions', render: (_, item) => item.regions.join('、') },
    { title: '行业', key: 'industries', render: (_, item) => item.industries.join('、') },
    { title: '标签', key: 'tags', render: (_, item) => <Space wrap>{item.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</Space> },
    { title: '简介', dataIndex: 'summary', key: 'summary' },
    {
      title: '操作',
      key: 'actions',
      render: (_, item) => (
        <Button onClick={() => setSelectedProvider(item)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div className="services-page">
      <SearchFilterBar
        keyword={keyword}
        keywordPlaceholder="搜索机构名称、标签或简介"
        onKeywordChange={setKeyword}
        filters={[
          {
            key: 'region',
            label: '地区',
            placeholder: '选择地区',
            options: getServiceProviderRegions().map((item) => ({ label: item, value: item })),
          },
          {
            key: 'type',
            label: '机构类型',
            placeholder: '选择机构类型',
            options: getServiceProviderTypes().map((item) => ({ label: item, value: item })),
          },
        ]}
        values={{ region, type }}
        onFilterChange={(key, value) => {
          if (key === 'region') {
            setRegion(value);
          }
          if (key === 'type') {
            setType(value);
          }
        }}
        onReset={() => {
          setKeyword('');
          setRegion(undefined);
          setType(undefined);
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState title="暂无匹配机构" description="请调整筛选条件，或返回服务中心选择其他入口。" />
      ) : (
        <DataTable columns={columns} dataSource={filtered} rowKey="id" />
      )}

      <Drawer
        title={selectedProvider?.name}
        width={520}
        open={selectedProvider !== null}
        onClose={() => setSelectedProvider(null)}
      >
        {selectedProvider ? (
          <Space direction="vertical" size={16} className="services-list-stack">
            <Space wrap>
              <Tag>{selectedProvider.type}</Tag>
              {selectedProvider.industries.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </Space>
            <div>
              <Typography.Title level={5} className="section-title">
                机构简介
              </Typography.Title>
              <Typography.Paragraph className="services-copy">
                {selectedProvider.summary}
              </Typography.Paragraph>
            </div>
            <div>
              <Typography.Title level={5} className="section-title">
                服务地区
              </Typography.Title>
              <Typography.Paragraph className="services-copy">
                {selectedProvider.regions.join('、')}
              </Typography.Paragraph>
            </div>
            <div>
              <Typography.Title level={5} className="section-title">
                服务标签
              </Typography.Title>
              <Space wrap>
                {selectedProvider.tags.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </Space>
            </div>
          </Space>
        ) : null}
      </Drawer>
    </div>
  );
}
