import { Button, Card, Input, Select, Space, Typography } from 'antd';

export interface SearchFilterOption {
  label: string;
  value: string;
}

export interface SearchFilterField {
  key: string;
  label: string;
  placeholder: string;
  options: SearchFilterOption[];
}

interface SearchFilterBarProps {
  keyword: string;
  keywordPlaceholder?: string;
  onKeywordChange: (value: string) => void;
  filters: SearchFilterField[];
  values: Record<string, string | undefined>;
  onFilterChange: (key: string, value: string | undefined) => void;
  onReset?: () => void;
  onSearch?: () => void;
}

export function SearchFilterBar({
  keyword,
  keywordPlaceholder = '输入关键词',
  onKeywordChange,
  filters,
  values,
  onFilterChange,
  onReset,
  onSearch,
}: SearchFilterBarProps) {
  return (
    <Card className="ui-card search-filter-card" bordered={false}>
      <Space direction="vertical" size={16} className="search-filter-stack">
        <Typography.Title level={5} className="search-filter-title">
          搜索与筛选
        </Typography.Title>
        <div className="search-filter-grid">
          <Input.Search
            value={keyword}
            placeholder={keywordPlaceholder}
            allowClear
            onChange={(event) => onKeywordChange(event.target.value)}
            onSearch={onSearch}
          />
          {filters.map((filter) => (
            <div key={filter.key} className="search-filter-field">
              <Typography.Text className="search-filter-label">
                {filter.label}
              </Typography.Text>
              <Select
                allowClear
                placeholder={filter.placeholder}
                value={values[filter.key]}
                options={filter.options}
                onChange={(value) => onFilterChange(filter.key, value)}
              />
            </div>
          ))}
          <Space wrap>
            <Button type="primary" onClick={onSearch}>
              开始搜索
            </Button>
            <Button onClick={onReset}>重置条件</Button>
          </Space>
        </div>
      </Space>
    </Card>
  );
}
