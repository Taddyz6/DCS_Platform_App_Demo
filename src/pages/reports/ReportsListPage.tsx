import { Button, Space, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { DataTable } from '@/components/common/DataTable';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { ReportCard } from '@/components/common/ReportCard';
import { reports } from '@/mock';
import type { Report } from '@/types/domain';
import { downloadTextFile } from '@/utils/download';
import { getReportTypeOptions } from './data';

export function ReportsListPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const filteredReports = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesKeyword =
        !normalized ||
        `${report.name} ${report.summary}`.toLowerCase().includes(normalized);
      const matchesType = !typeFilter || report.type === typeFilter;
      const matchesStatus = !statusFilter || report.status === statusFilter;

      return matchesKeyword && matchesType && matchesStatus;
    });
  }, [keyword, statusFilter, typeFilter]);

  const columns: ColumnsType<Report> = [
    {
      title: '报告名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Button
          type="link"
          className="table-link-button"
          onClick={() => navigate(`/reports/${record.id}`)}
        >
          {record.name}
        </Button>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value: Report['status']) => (value === 'generated' ? '已生成' : '草稿'),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      key: 'summary',
    },
  ];

  return (
    <div className="reports-page">
      <SearchFilterBar
        keyword={keyword}
        keywordPlaceholder="搜索报告名称或摘要"
        onKeywordChange={setKeyword}
        filters={[
          {
            key: 'type',
            label: '业务场景',
            placeholder: '选择汽车业务场景',
            options: getReportTypeOptions(),
          },
          {
            key: 'status',
            label: '状态',
            placeholder: '选择状态',
            options: [
              { label: '已生成', value: 'generated' },
              { label: '草稿', value: 'draft' },
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

      {filteredReports.length === 0 ? (
        <EmptyState
          title="暂无匹配报告"
          description="请调整筛选条件，或清空关键词后重新查看全部报告。"
          actionLabel="重置条件"
          onAction={() => {
            setKeyword('');
            setTypeFilter(undefined);
            setStatusFilter(undefined);
          }}
        />
      ) : (
        <>
          <DataTable columns={columns} dataSource={filteredReports} rowKey="id" />

          <div className="reports-grid">
            {filteredReports.slice(0, 5).map((report) => (
              <ReportCard
                key={report.id}
                title={report.name}
                type={report.type}
                summary={report.summary}
                updatedAt={report.createdAt.slice(0, 10)}
                status={report.status === 'generated' ? 'completed' : 'draft'}
                onPreview={() => navigate(`/reports/${report.id}`)}
                onDownload={() => {
                  const markdown = [
                    `# ${report.name}`,
                    '',
                    ...report.sections.flatMap((section) => [
                      `## ${section.title}`,
                      section.content,
                      '',
                    ]),
                  ].join('\n');

                  downloadTextFile(`${report.name}.md`, markdown);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
