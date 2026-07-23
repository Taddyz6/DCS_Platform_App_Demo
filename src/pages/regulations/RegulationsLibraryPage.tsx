import { StarFilled, StarOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { DataTable } from '@/components/common/DataTable';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { StatCard } from '@/components/common/StatCard';
import type { Regulation } from '@/types/domain';
import { regulationStatusLabels } from './data';
import {
  regulationCountries,
  regulationIndustries,
  regulationLevels,
  regulations,
  regulationTopics,
} from './data';
import { useFavoriteRegulations } from './useFavoriteRegulations';

type RegulationFilterState = Record<string, string | undefined>;

export function RegulationsLibraryPage() {
  const navigate = useNavigate();
  const { isFavorite, favorites, toggleFavorite } = useFavoriteRegulations();
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState<RegulationFilterState>({});

  const filteredRegulations = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return regulations.filter((item) => {
      const matchesKeyword =
        !normalizedKeyword ||
        [
          item.title,
          item.summary,
          item.country,
          item.authority,
          ...item.topics,
          ...item.industries,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedKeyword);

      const matchesCountry = !filters.country || item.country === filters.country;
      const matchesIndustry =
        !filters.industry || item.industries.includes(filters.industry);
      const matchesLevel = !filters.level || item.level === filters.level;
      const matchesTopic = !filters.topic || item.topics.includes(filters.topic);
      const matchesStatus = !filters.status || item.status === filters.status;

      return (
        matchesKeyword &&
        matchesCountry &&
        matchesIndustry &&
        matchesLevel &&
        matchesTopic &&
        matchesStatus
      );
    });
  }, [filters, keyword]);

  const columns: ColumnsType<Regulation> = [
    {
      title: '法规名称',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => (
        <Button
          type="link"
          className="table-link-button"
          onClick={() => navigate(`/regulations/detail/${record.id}`)}
        >
          {record.title}
        </Button>
      ),
    },
    {
      title: '国家/地区',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: '法规层级',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: '生效状态',
      dataIndex: 'status',
      key: 'status',
      render: (value: Regulation['status']) => (
        <Tag color={value === 'effective' ? 'success' : value === 'draft' ? 'warning' : 'default'}>
          {regulationStatusLabels[value]}
        </Tag>
      ),
    },
    {
      title: '主题',
      dataIndex: 'topics',
      key: 'topics',
      render: (value: string[]) => (
        <Space wrap size={[4, 4]}>
          {value.map((topic) => (
            <Tag key={topic}>{topic}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space wrap>
          <Button onClick={() => navigate(`/regulations/detail/${record.id}`)}>
            查看详情
          </Button>
          <Button
            icon={isFavorite(record.id) ? <StarFilled /> : <StarOutlined />}
            onClick={() => toggleFavorite(record.id)}
          >
            {isFavorite(record.id) ? '已收藏' : '收藏'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="regulations-page">
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <StatCard
            title="筛选结果"
            value={filteredRegulations.length}
            suffix="条"
            description="支持按关键词、国家、行业、层级、主题和状态组合筛选。"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="已收藏法规"
            value={favorites.length}
            suffix="条"
            description="收藏状态已保存到本地存储，可用于后续快捷访问。"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="覆盖行业"
            value={regulationIndustries.length}
            suffix="类"
            description="包含汽车研发、工业制造、智能驾驶、车联网和 OTA 等重点领域。"
          />
        </Col>
      </Row>

      <SearchFilterBar
        keyword={keyword}
        keywordPlaceholder="搜索法规标题、国家、主题或摘要"
        onKeywordChange={setKeyword}
        filters={[
          {
            key: 'country',
            label: '国家/地区',
            placeholder: '选择国家/地区',
            options: regulationCountries.map((item) => ({ label: item, value: item })),
          },
          {
            key: 'industry',
            label: '行业',
            placeholder: '选择行业',
            options: regulationIndustries.map((item) => ({ label: item, value: item })),
          },
          {
            key: 'level',
            label: '法规层级',
            placeholder: '选择法规层级',
            options: regulationLevels.map((item) => ({ label: item, value: item })),
          },
          {
            key: 'topic',
            label: '数据主题',
            placeholder: '选择数据主题',
            options: regulationTopics.map((item) => ({ label: item, value: item })),
          },
          {
            key: 'status',
            label: '生效状态',
            placeholder: '选择生效状态',
            options: [
              { label: '已生效', value: 'effective' },
              { label: '草案', value: 'draft' },
              { label: '已失效', value: 'expired' },
            ],
          },
        ]}
        values={filters}
        onFilterChange={(key, value) =>
          setFilters((current) => ({ ...current, [key]: value }))
        }
        onReset={() => {
          setKeyword('');
          setFilters({});
        }}
      />

      {filteredRegulations.length === 0 ? (
        <EmptyState
          title="未找到匹配法规"
          description="请调整筛选条件，或尝试清空关键词后重新搜索。"
          actionLabel="重置条件"
          onAction={() => {
            setKeyword('');
            setFilters({});
          }}
        />
      ) : (
        <>
          <Typography.Paragraph className="regulation-library-copy">
            当前共展示 {filteredRegulations.length} 条法规记录。点击法规名称或“查看详情”进入详情页。
          </Typography.Paragraph>
          <DataTable columns={columns} dataSource={filteredRegulations} rowKey="id" />
        </>
      )}
    </div>
  );
}
