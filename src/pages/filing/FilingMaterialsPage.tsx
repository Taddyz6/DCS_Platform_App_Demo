import { Button, Space, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { DataTable } from '@/components/common/DataTable';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { StatusTag } from '@/components/common/StatusTag';
import type { Material } from '@/types/domain';
import { getFilingTypeLabel, getMaterialBusinessStatus, getMaterialTypeOptions } from './data';
import { useFilingWorkspace } from './useFilingWorkspace';

export function FilingMaterialsPage() {
  const navigate = useNavigate();
  const { materials, runMaterialCheck } = useFilingWorkspace();
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const filteredMaterials = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return materials.filter((material) => {
      const matchesKeyword =
        !normalizedKeyword ||
        `${material.name} ${getFilingTypeLabel(material.filingType)}`
          .toLowerCase()
          .includes(normalizedKeyword);
      const matchesType = !typeFilter || material.filingType === typeFilter;
      const matchesStatus = !statusFilter || getMaterialBusinessStatus(material.status) === statusFilter;

      return matchesKeyword && matchesType && matchesStatus;
    });
  }, [keyword, materials, statusFilter, typeFilter]);

  const columns: ColumnsType<Material> = [
    {
      title: '材料名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, material) => (
        <Button
          type="link"
          className="table-link-button"
          onClick={() => navigate(`/filing/materials/${material.id}`)}
        >
          {material.name}
        </Button>
      ),
    },
    {
      title: '办理类型',
      dataIndex: 'filingType',
      key: 'filingType',
      render: (value: Material['filingType']) => <Tag>{getFilingTypeLabel(value)}</Tag>,
    },
    {
      title: '完成度',
      dataIndex: 'completeness',
      key: 'completeness',
      render: (value: number) => `${value}%`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value: Material['status']) => (
        <StatusTag status={getMaterialBusinessStatus(value)} />
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, material) => (
        <Space wrap>
          <Button onClick={() => navigate(`/filing/materials/${material.id}`)}>
            编辑预览
          </Button>
          <Button
            onClick={() => {
              runMaterialCheck(material.id);
              navigate('/filing/material-check');
            }}
          >
            执行检查
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="filing-page">
      <SearchFilterBar
        keyword={keyword}
        keywordPlaceholder="搜索材料名称或办理类型"
        onKeywordChange={setKeyword}
        filters={[
          {
            key: 'type',
            label: '办理类型',
            placeholder: '选择办理类型',
            options: getMaterialTypeOptions(),
          },
          {
            key: 'status',
            label: '状态',
            placeholder: '选择状态',
            options: [
              { label: '草稿', value: 'draft' },
              { label: '待复核', value: 'review' },
              { label: '已完成', value: 'completed' },
            ],
          },
        ]}
        values={{ type: typeFilter, status: statusFilter }}
        onFilterChange={(key, value) => {
          if (key === 'type') {
            setTypeFilter(value);
          }
          if (key === 'status') {
            setStatusFilter(value);
          }
        }}
        onReset={() => {
          setKeyword('');
          setTypeFilter(undefined);
          setStatusFilter(undefined);
        }}
      />

      {filteredMaterials.length === 0 ? (
        <EmptyState
          title="暂无匹配材料"
          description="请调整筛选条件，或先从安全评估、标准合同、认证入口创建材料。"
        />
      ) : (
        <DataTable columns={columns} dataSource={filteredMaterials} rowKey="id" />
      )}
    </div>
  );
}
