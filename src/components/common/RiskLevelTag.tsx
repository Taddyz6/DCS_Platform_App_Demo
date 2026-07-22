import { Tag } from 'antd';
import type { RiskLevel } from '@/types/ui';

const riskConfig: Record<
  RiskLevel,
  {
    color: string;
    label: string;
  }
> = {
  low: { color: 'success', label: '低风险' },
  medium: { color: 'warning', label: '中风险' },
  high: { color: 'error', label: '高风险' },
};

interface RiskLevelTagProps {
  level: RiskLevel;
}

export function RiskLevelTag({ level }: RiskLevelTagProps) {
  const config = riskConfig[level];

  return <Tag color={config.color}>{config.label}</Tag>;
}
