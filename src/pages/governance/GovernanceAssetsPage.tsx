import { Button, Space, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { DataTable } from '@/components/common/DataTable';
import { EmptyState } from '@/components/common/EmptyState';
import { RiskLevelTag } from '@/components/common/RiskLevelTag';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { dataAssets } from '@/mock';
import type { DataAsset } from '@/types/domain';
import {
  governanceAssetCategories,
  governanceAssetDestinations,
} from './data';

export function GovernanceAssetsPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [destination, setDestination] = useState<string | undefined>();
  const [riskLevel, setRiskLevel] = useState<string | undefined>();

  const filteredAssets = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return dataAssets.filter((asset) => {
      const matchesKeyword =
        !normalizedKeyword ||
        `${asset.name} ${asset.system} ${asset.category} ${asset.purpose}`
          .toLowerCase()
          .includes(normalizedKeyword);
      const matchesCategory = !category || asset.category === category;
      const matchesDestination = !destination || asset.destination === destination;
      const matchesRiskLevel = !riskLevel || asset.riskLevel === riskLevel;

      return (
        matchesKeyword && matchesCategory && matchesDestination && matchesRiskLevel
      );
    });
  }, [category, destination, keyword, riskLevel]);

  const columns: ColumnsType<DataAsset> = [
    {
      title: '资产名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, asset) => (
        <Button
          type="link"
          className="table-link-button"
          onClick={() => navigate(`/governance/assets/${asset.id}`)}
        >
          {asset.name}
        </Button>
      ),
    },
    {
      title: '系统',
      dataIndex: 'system',
      key: 'system',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '分级',
      dataIndex: 'level',
      key: 'level',
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: '目的地',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: '属性',
      key: 'flags',
      render: (_, asset) => (
        <Space wrap size={[6, 6]}>
          {asset.personalInfo ? <Tag color="blue">个人信息</Tag> : null}
          {asset.sensitivePersonalInfo ? <Tag color="red">敏感个人信息</Tag> : null}
          {asset.suspectedImportantData ? <Tag color="gold">疑似重要数据</Tag> : null}
        </Space>
      ),
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (value: DataAsset['riskLevel']) => <RiskLevelTag level={value} />,
    },
  ];

  return (
    <div className="governance-page">
      <SearchFilterBar
        keyword={keyword}
        keywordPlaceholder="搜索资产名称、系统、分类或处理目的"
        onKeywordChange={setKeyword}
        filters={[
          {
            key: 'category',
            label: '分类',
            placeholder: '选择分类',
            options: governanceAssetCategories.map((item) => ({
              label: item,
              value: item,
            })),
          },
          {
            key: 'destination',
            label: '目的地',
            placeholder: '选择目的地',
            options: governanceAssetDestinations.map((item) => ({
              label: item,
              value: item,
            })),
          },
          {
            key: 'riskLevel',
            label: '风险等级',
            placeholder: '选择风险等级',
            options: [
              { label: '低', value: 'low' },
              { label: '中', value: 'medium' },
              { label: '高', value: 'high' },
            ],
          },
        ]}
        values={{ category, destination, riskLevel }}
        onFilterChange={(key, value) => {
          if (key === 'category') {
            setCategory(value);
          }
          if (key === 'destination') {
            setDestination(value);
          }
          if (key === 'riskLevel') {
            setRiskLevel(value);
          }
        }}
        onReset={() => {
          setKeyword('');
          setCategory(undefined);
          setDestination(undefined);
          setRiskLevel(undefined);
        }}
      />

      {filteredAssets.length === 0 ? (
        <EmptyState
          title="暂无匹配的数据资产"
          description="请调整筛选条件，或返回治理首页查看推荐治理入口。"
        />
      ) : (
        <DataTable columns={columns} dataSource={filteredAssets} rowKey="id" />
      )}
    </div>
  );
}
