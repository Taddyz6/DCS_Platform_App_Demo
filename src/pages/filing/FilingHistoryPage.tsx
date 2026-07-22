import { Button, Space, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { DataTable } from '@/components/common/DataTable';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { StatusTag } from '@/components/common/StatusTag';
import type { FilingRecord } from './data';
import { getFilingTypeLabel, getMaterialTypeOptions } from './data';
import { useFilingWorkspace } from './useFilingWorkspace';

export function FilingHistoryPage() {
  const navigate = useNavigate();
  const { records } = useFilingWorkspace();
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const filteredRecords = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return records.filter((record) => {
      const matchesKeyword =
        !normalizedKeyword ||
        `${record.name} ${record.summary}`.toLowerCase().includes(normalizedKeyword);
      const matchesType = !typeFilter || record.filingType === typeFilter;
      const matchesStatus = !statusFilter || record.status === statusFilter;

      return matchesKeyword && matchesType && matchesStatus;
    });
  }, [keyword, records, statusFilter, typeFilter]);

  const columns: ColumnsType<FilingRecord> = [
    {
      title: '办理事项',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Button
          type="link"
          className="table-link-button"
          onClick={() => navigate(`/filing/materials/${record.materialId}`)}
        >
          {record.name}
        </Button>
      ),
    },
    {
      title: '类型',
      dataIndex: 'filingType',
      key: 'filingType',
      render: (value: FilingRecord['filingType']) => <Tag>{getFilingTypeLabel(value)}</Tag>,
    },
    {
      title: '目的地',
      dataIndex: 'destination',
      key: 'destination',
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
      render: (value: FilingRecord['status']) => <StatusTag status={value} />,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space wrap>
          <Button onClick={() => navigate(`/filing/materials/${record.materialId}`)}>
            查看材料
          </Button>
          <Button onClick={() => navigate('/filing/material-check')}>
            查看检查
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="filing-page">
      <SearchFilterBar
        keyword={keyword}
        keywordPlaceholder="搜索办理事项或摘要"
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
              { label: '待补充', value: 'pending' },
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

      {filteredRecords.length === 0 ? (
        <EmptyState
          title="暂无匹配办理记录"
          description="请调整筛选条件，或先创建一个申报、备案或认证事项。"
        />
      ) : (
        <DataTable columns={columns} dataSource={filteredRecords} rowKey="id" />
      )}
    </div>
  );
}
