import { Tag } from 'antd';
import { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { DataTable } from '@/components/common/DataTable';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { RiskLevelTag } from '@/components/common/RiskLevelTag';
import { getAuditLogs } from './data';

export function SecurityAuditPage() {
  const [keyword, setKeyword] = useState('');
  const [risk, setRisk] = useState<string | undefined>();
  const logs = getAuditLogs();

  const filtered = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    return logs.filter((item) => {
      const matchesKeyword =
        !normalized ||
        `${item.type} ${item.summary} ${item.actor}`.toLowerCase().includes(normalized);
      const matchesRisk = !risk || item.riskLevel === risk;

      return matchesKeyword && matchesRisk;
    });
  }, [keyword, logs, risk]);

  const columns: ColumnsType<(typeof logs)[number]> = [
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '主体', dataIndex: 'actor', key: 'actor' },
    { title: '对象', dataIndex: 'target', key: 'target' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (value: string) => <Tag>{value}</Tag> },
    { title: '结果', dataIndex: 'result', key: 'result' },
    { title: '风险等级', dataIndex: 'riskLevel', key: 'riskLevel', render: (value) => <RiskLevelTag level={value} /> },
    { title: '摘要', dataIndex: 'summary', key: 'summary' },
  ];

  return (
    <div className="security-page">
      <SearchFilterBar
        keyword={keyword}
        keywordPlaceholder="搜索事件类型、摘要或主体"
        onKeywordChange={setKeyword}
        filters={[
          {
            key: 'risk',
            label: '风险等级',
            placeholder: '选择风险等级',
            options: [
              { label: '低', value: 'low' },
              { label: '中', value: 'medium' },
              { label: '高', value: 'high' },
            ],
          },
        ]}
        values={{ risk }}
        onFilterChange={(key, value) => {
          if (key === 'risk') {
            setRisk(value);
          }
        }}
        onReset={() => {
          setKeyword('');
          setRisk(undefined);
        }}
      />
      <DataTable columns={columns} dataSource={filtered} rowKey="id" />
    </div>
  );
}
