import { Button, Card, Col, Row, Select, Space, Table, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { StatCard } from '@/components/common/StatCard';
import { clearAppPreferences, saveThemeMode } from '@/app/preferences';
import { useAppStore } from '@/app/store';
import { clearManagedLocalStorage, getManagedLocalStorageEntries, getRecentVisits } from './data';

export function SettingsPage() {
  const themeMode = useAppStore((state) => state.themeMode);
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const [entries, setEntries] = useState(() => getManagedLocalStorageEntries());
  const [recentVisits, setRecentVisits] = useState(() => getRecentVisits());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const totalStorageSize = useMemo(
    () => entries.reduce((total, item) => total + item.size, 0),
    [entries],
  );

  const refresh = () => {
    setEntries(getManagedLocalStorageEntries());
    setRecentVisits(getRecentVisits());
  };

  return (
    <div className="settings-page">
      {contextHolder}
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <StatCard title="主题模式" value={themeMode === 'light' ? '浅色' : themeMode} description="当前版本提供浅色模式，并保留当前环境偏好。" />
        </Col>
        <Col xs={24} md={8}>
          <StatCard title="受管存储项" value={entries.length} suffix="个" description="统计平台当前环境的受管偏好与记录项。" />
        </Col>
        <Col xs={24} md={8}>
          <StatCard title="最近访问记录" value={recentVisits.length} suffix="条" description="用于展示模块访问轨迹和恢复工作台上下文。" />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={8}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="settings-list-stack">
              <Typography.Title level={5} className="section-title">
                环境偏好
              </Typography.Title>
              <div className="settings-field">
                <Typography.Text className="search-filter-label">主题模式</Typography.Text>
                <Select
                  value={themeMode}
                  options={[{ label: '浅色模式', value: 'light' }]}
                  onChange={(value) => {
                    setThemeMode(value);
                    saveThemeMode(value);
                    refresh();
                    void messageApi.success('主题偏好已更新');
                  }}
                />
              </div>
              <Typography.Paragraph className="settings-copy">
                当前环境会保存主题偏好与最近访问记录，用于恢复使用上下文。
              </Typography.Paragraph>
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={16}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="settings-list-stack">
              <div className="regulation-section-head">
                <Typography.Title level={5} className="section-title">
                  最近访问记录
                </Typography.Title>
                <Button onClick={refresh}>刷新</Button>
              </div>
              {recentVisits.length === 0 ? (
                <EmptyState
                  title="暂无最近访问记录"
                  description="打开不同模块后，这里会按时间倒序记录最近访问路径。"
                />
              ) : (
                <div className="settings-visit-list">
                  {recentVisits.map((item) => (
                    <Card key={`${item.path}-${item.visitedAt}`} className="settings-info-card">
                      <Typography.Text strong>{item.title}</Typography.Text>
                      <Typography.Paragraph className="settings-copy">
                        {item.path}
                      </Typography.Paragraph>
                      <Typography.Paragraph className="settings-copy">
                        {item.visitedAt}
                      </Typography.Paragraph>
                    </Card>
                  ))}
                </div>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      <Card className="ui-card" bordered={false}>
        <Space direction="vertical" size={16} className="settings-list-stack">
          <div className="regulation-section-head">
              <Typography.Title level={5} className="section-title">
              环境存储概览
            </Typography.Title>
            <Space wrap>
              <Typography.Text>总字符数：{totalStorageSize}</Typography.Text>
              <Button danger onClick={() => setConfirmOpen(true)}>
                清除环境数据
              </Button>
            </Space>
          </div>
          <Table
            className="data-table"
            rowKey="key"
            pagination={{ pageSize: 6, showSizeChanger: false }}
            dataSource={entries}
            columns={[
              { title: '键名', dataIndex: 'key', key: 'key' },
              { title: '大小', dataIndex: 'size', key: 'size', render: (value: number) => `${value} chars` },
              { title: '预览', dataIndex: 'preview', key: 'preview' },
            ]}
          />
        </Space>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="确认清除环境数据？"
        description="该操作会清除当前环境中的评估记录、材料记录、服务记录和最近访问记录。"
        confirmText="确认清除"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          clearManagedLocalStorage();
          clearAppPreferences();
          setThemeMode('light');
          setConfirmOpen(false);
          refresh();
          void messageApi.success('环境数据已清除');
        }}
      />
    </div>
  );
}
