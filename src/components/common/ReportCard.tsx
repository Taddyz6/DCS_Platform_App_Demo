import { DownloadOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { StatusTag } from './StatusTag';
import type { BusinessStatus } from '@/types/ui';

interface ReportCardProps {
  title: string;
  type: string;
  summary: string;
  updatedAt: string;
  status: BusinessStatus;
  onPreview?: () => void;
  onDownload?: () => void;
}

export function ReportCard({
  title,
  type,
  summary,
  updatedAt,
  status,
  onPreview,
  onDownload,
}: ReportCardProps) {
  return (
    <Card className="ui-card report-card" bordered={false}>
      <Space direction="vertical" size={14} className="report-card-stack">
        <Space align="center" className="report-card-head">
          <span className="report-card-icon">
            <FileTextOutlined />
          </span>
          <div>
            <Typography.Text className="report-card-type">{type}</Typography.Text>
            <Typography.Title level={5} className="report-card-title">
              {title}
            </Typography.Title>
          </div>
        </Space>
        <Typography.Paragraph className="report-card-copy">
          {summary}
        </Typography.Paragraph>
        <Space wrap className="report-card-meta">
          <Typography.Text>更新时间：{updatedAt}</Typography.Text>
          <StatusTag status={status} />
        </Space>
        <Space wrap>
          <Button icon={<EyeOutlined />} onClick={onPreview}>
            预览
          </Button>
          <Button icon={<DownloadOutlined />} onClick={onDownload}>
            导出
          </Button>
        </Space>
      </Space>
    </Card>
  );
}
