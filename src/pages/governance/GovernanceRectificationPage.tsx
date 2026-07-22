import { Button, Space, Tag, message } from 'antd';
import { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { DataTable } from '@/components/common/DataTable';
import { EmptyState } from '@/components/common/EmptyState';
import { RiskLevelTag } from '@/components/common/RiskLevelTag';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { StatusTag } from '@/components/common/StatusTag';
import type { GovernanceRectificationItem } from './data';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';

export function GovernanceRectificationPage() {
  const { rectificationItems, updateTaskStatus } = useGovernanceWorkspace();
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string | undefined>();
  const [owner, setOwner] = useState<string | undefined>();
  const [messageApi, contextHolder] = message.useMessage();

  const owners = useMemo(
    () => Array.from(new Set(rectificationItems.map((item) => item.owner))),
    [rectificationItems],
  );

  const filteredItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return rectificationItems.filter((item) => {
      const matchesKeyword =
        !normalizedKeyword ||
        `${item.title} ${item.summary} ${item.suggestion}`
          .toLowerCase()
          .includes(normalizedKeyword);
      const matchesStatus = !status || item.status === status;
      const matchesOwner = !owner || item.owner === owner;

      return matchesKeyword && matchesStatus && matchesOwner;
    });
  }, [keyword, owner, rectificationItems, status]);

  const columns: ColumnsType<GovernanceRectificationItem> = [
    {
      title: '整改事项',
      dataIndex: 'title',
      key: 'title',
      render: (_, item) => (
        <Space direction="vertical" size={4}>
          <span>{item.title}</span>
          <span className="governance-table-copy">{item.summary}</span>
        </Space>
      ),
    },
    {
      title: '来源',
      dataIndex: 'sourceLabel',
      key: 'sourceLabel',
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: '责任方',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (value: GovernanceRectificationItem['riskLevel']) => (
        <RiskLevelTag level={value} />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value: GovernanceRectificationItem['status']) => (
        <StatusTag status={value} />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, item) => (
        <Space wrap>
          <Button
            onClick={() => {
              updateTaskStatus(item.id, 'review');
              void messageApi.success('事项状态已更新为复核中');
            }}
          >
            标记复核中
          </Button>
          <Button
            onClick={() => {
              updateTaskStatus(item.id, 'completed');
              void messageApi.success('事项已标记为已完成');
            }}
          >
            标记完成
          </Button>
          <Button
            type="primary"
            onClick={() => {
              updateTaskStatus(item.id, 'closed');
              void messageApi.success('事项已标记为关闭');
            }}
          >
            关闭事项
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="governance-page">
      {contextHolder}
      <SearchFilterBar
        keyword={keyword}
        keywordPlaceholder="搜索事项标题、摘要或建议"
        onKeywordChange={setKeyword}
        filters={[
          {
            key: 'status',
            label: '状态',
            placeholder: '选择状态',
            options: [
              { label: '待处理', value: 'pending' },
              { label: '复核中', value: 'review' },
              { label: '已完成', value: 'completed' },
              { label: '已关闭', value: 'closed' },
            ],
          },
          {
            key: 'owner',
            label: '责任方',
            placeholder: '选择责任方',
            options: owners.map((item) => ({ label: item, value: item })),
          },
        ]}
        values={{ status, owner }}
        onFilterChange={(key, value) => {
          if (key === 'status') {
            setStatus(value);
          }
          if (key === 'owner') {
            setOwner(value);
          }
        }}
        onReset={() => {
          setKeyword('');
          setStatus(undefined);
          setOwner(undefined);
        }}
      />

      {filteredItems.length === 0 ? (
        <EmptyState
          title="暂无匹配整改事项"
          description="请调整筛选条件，或先完成重要数据识别、风险评估和 PIA。"
        />
      ) : (
        <DataTable columns={columns} dataSource={filteredItems} rowKey="id" />
      )}
    </div>
  );
}
