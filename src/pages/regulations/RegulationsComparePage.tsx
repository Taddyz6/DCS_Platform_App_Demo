import { Button, Card, Select, Space, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { DataTable } from '@/components/common/DataTable';
import { EmptyState } from '@/components/common/EmptyState';
import { countryProfiles, compareTopicOptions } from './data';

interface CompareRow {
  key: string;
  dimension: string;
  values: Record<string, string>;
}

export function RegulationsComparePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['中国', '欧盟']);
  const [selectedTopic, setSelectedTopic] = useState(compareTopicOptions[0]);

  const rows = useMemo<CompareRow[]>(() => {
    const profiles = countryProfiles.filter((item) =>
      selectedCountries.includes(item.name),
    );

    const buildValues = (selector: (name: string) => string) =>
      Object.fromEntries(selectedCountries.map((name) => [name, selector(name)]));

    switch (selectedTopic) {
      case '数据本地化要求':
        return [
          {
            key: 'localization',
            dimension: '本地化要求',
            values: buildValues(
              (name) =>
                profiles
                  .find((item) => item.name === name)
                  ?.localizationRequirements.join('；') ?? '-',
            ),
          },
        ];
      case '重点监管机构':
        return [
          {
            key: 'authorities',
            dimension: '监管机构',
            values: buildValues(
              (name) =>
                profiles
                  .find((item) => item.name === name)
                  ?.regulatoryAuthorities.join('；') ?? '-',
            ),
          },
        ];
      case '高风险关注点':
        return [
          {
            key: 'risks',
            dimension: '重点风险',
            values: buildValues(
              (name) =>
                profiles.find((item) => item.name === name)?.keyRisks.join('；') ?? '-',
            ),
          },
        ];
      default:
        return [
          {
            key: 'mechanisms',
            dimension: '跨境传输机制',
            values: buildValues(
              (name) =>
                profiles
                  .find((item) => item.name === name)
                  ?.crossBorderMechanisms.join('；') ?? '-',
            ),
          },
        ];
    }
  }, [selectedCountries, selectedTopic]);

  const columns = useMemo<ColumnsType<CompareRow>>(
    () => [
      {
        title: '比较维度',
        dataIndex: 'dimension',
        key: 'dimension',
        width: 180,
      },
      ...selectedCountries.map((name) => ({
        title: name,
        dataIndex: ['values', name],
        key: name,
        render: (value: string) => (
          <Typography.Paragraph className="compare-cell-copy">
            {value}
          </Typography.Paragraph>
        ),
      })),
    ],
    [selectedCountries],
  );

  const compareSummary =
    selectedCountries.length >= 2
      ? `当前正在比较 ${selectedCountries.join('、')} 在“${selectedTopic}”维度上的差异。`
      : '请选择至少两个国家或地区进行比较。';

  return (
    <div className="regulations-page">
      {contextHolder}
      <Card className="ui-card" bordered={false}>
        <Space direction="vertical" size={16} className="compare-page-stack">
          <Typography.Title level={5} className="section-title">
            选择比较对象
          </Typography.Title>
          <Space wrap size={16}>
            <Select
              mode="multiple"
              value={selectedCountries}
              options={countryProfiles.map((item) => ({
                label: item.name,
                value: item.name,
              }))}
              placeholder="选择两个或多个国家"
              onChange={setSelectedCountries}
              style={{ minWidth: 320 }}
            />
            <Select
              value={selectedTopic}
              options={compareTopicOptions.map((item) => ({
                label: item,
                value: item,
              }))}
              onChange={setSelectedTopic}
              style={{ minWidth: 240 }}
            />
            <Button
              type="primary"
              onClick={() => {
                void messageApi.success('比较结果已导出');
              }}
            >
              导出结果
            </Button>
          </Space>
          <Typography.Paragraph className="regulation-home-copy">
            {compareSummary}
          </Typography.Paragraph>
        </Space>
      </Card>

      {selectedCountries.length < 2 ? (
        <EmptyState
          title="比较对象不足"
          description="法规比较页至少需要选择两个国家或地区，才能生成对比表格和差异摘要。"
        />
      ) : (
        <>
          <DataTable columns={columns} dataSource={rows} pagination={false} rowKey="key" />
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={14}>
              <Typography.Title level={5} className="section-title">
                差异摘要
              </Typography.Title>
              <Typography.Paragraph className="regulation-home-copy">
                {selectedTopic === '跨境传输机制'
                  ? '不同法域在合法传输工具、接收方保护要求和附加措施说明上存在明显差异。'
                  : selectedTopic === '数据本地化要求'
                    ? '本地化要求差异集中在重要数据、关键系统和特定行业场景的边界认定上。'
                    : selectedTopic === '重点监管机构'
                      ? '监管结构差异会影响合规沟通对象、申报材料准备方式和审查重点。'
                      : '高风险关注点差异主要体现在个人信息、工业数据和行业特定规则的组合要求上。'}
              </Typography.Paragraph>
            </Space>
          </Card>
        </>
      )}
    </div>
  );
}
