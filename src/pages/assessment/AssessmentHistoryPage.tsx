import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Select, Space, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { DataTable } from '@/components/common/DataTable';
import { EmptyState } from '@/components/common/EmptyState';
import { RiskLevelTag } from '@/components/common/RiskLevelTag';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { StatusTag } from '@/components/common/StatusTag';
import type { AssessmentRecord } from '@/types/domain';
import { getAssessmentTypeLabel } from './data';
import { useAssessmentWorkspace } from './useAssessmentWorkspace';

export function AssessmentHistoryPage() {
  const navigate = useNavigate();
  const { records, deleteRecord, duplicateRecord } = useAssessmentWorkspace();
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();

  const filteredRecords = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return records.filter((item) => {
      const matchesKeyword =
        !normalizedKeyword ||
        `${item.name} ${item.resultSummary}`.toLowerCase().includes(normalizedKeyword);
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesType = !typeFilter || item.type === typeFilter;

      return matchesKeyword && matchesStatus && matchesType;
    });
  }, [keyword, records, statusFilter, typeFilter]);

  const columns: ColumnsType<AssessmentRecord> = [
    {
      title: '记录名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Button
          type="link"
          className="table-link-button"
          onClick={() => navigate(`/assessment/result/${record.id}`)}
        >
          {record.name}
        </Button>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (value: AssessmentRecord['type']) => <Tag>{getAssessmentTypeLabel(value)}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value: AssessmentRecord['status']) => (
        <StatusTag status={value === 'completed' ? 'completed' : 'draft'} />
      ),
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (value?: AssessmentRecord['riskLevel']) =>
        value ? <RiskLevelTag level={value} /> : '-',
    },
    {
      title: '最近更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space wrap>
          <Button onClick={() => navigate(`/assessment/result/${record.id}`)}>
            查看结果
          </Button>
          <Button
            icon={<CopyOutlined />}
            onClick={() => {
              const duplicatedId = duplicateRecord(record);

              if (duplicatedId) {
                navigate(`/assessment/result/${duplicatedId}`);
              }
            }}
          >
            复制为新研判
          </Button>
          {record.id.startsWith('assessment-local-') ? (
            <Popconfirm
              title="确认删除该记录？"
              onConfirm={() => deleteRecord(record.id)}
            >
              <Button icon={<DeleteOutlined />} danger>
                删除
              </Button>
            </Popconfirm>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <div className="assessment-page">
      <SearchFilterBar
        keyword={keyword}
        keywordPlaceholder="搜索记录名称或结果摘要"
        onKeywordChange={setKeyword}
        filters={[
          {
            key: 'status',
            label: '状态',
            placeholder: '选择状态',
            options: [
              { label: '已完成', value: 'completed' },
              { label: '草稿', value: 'draft' },
            ],
          },
          {
            key: 'type',
            label: '类型',
            placeholder: '选择类型',
            options: [
              { label: '场景预检', value: 'precheck' },
              { label: '路径研判', value: 'path' },
              { label: '清单政策识别', value: 'listPolicy' },
              { label: '风险评估', value: 'risk' },
              { label: 'PIA', value: 'pia' },
            ],
          },
        ]}
        values={{ status: statusFilter, type: typeFilter }}
        onFilterChange={(key, value) => {
          if (key === 'status') {
            setStatusFilter(value);
          }
          if (key === 'type') {
            setTypeFilter(value);
          }
        }}
        onReset={() => {
          setKeyword('');
          setStatusFilter(undefined);
          setTypeFilter(undefined);
        }}
      />

      {filteredRecords.length === 0 ? (
        <EmptyState
          title="暂无匹配记录"
          description="请调整筛选条件，或先完成一次预检、路径研判或政策识别。"
        />
      ) : (
        <DataTable columns={columns} dataSource={filteredRecords} rowKey="id" />
      )}
    </div>
  );
}
