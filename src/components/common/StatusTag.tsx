import { Tag } from 'antd';
import type { BusinessStatus } from '@/types/ui';

const statusConfig: Record<
  BusinessStatus,
  {
    color: string;
    label: string;
  }
> = {
  draft: { color: 'default', label: '草稿' },
  analyzing: { color: 'processing', label: '分析中' },
  completed: { color: 'success', label: '已完成' },
  pending: { color: 'warning', label: '待补充' },
  review: { color: 'purple', label: '待复核' },
  closed: { color: 'default', label: '已关闭' },
};

interface StatusTagProps {
  status: BusinessStatus;
}

export function StatusTag({ status }: StatusTagProps) {
  const config = statusConfig[status];

  return <Tag color={config.color}>{config.label}</Tag>;
}
