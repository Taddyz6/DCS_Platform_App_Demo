import dayjs from 'dayjs';
import type { Material, MaterialCheckResult } from '@/types/domain';

export const materials: Material[] = [
  {
    id: 'material-1',
    name: '安全评估申报书',
    filingType: 'securityAssessment',
    status: 'completed',
    completeness: 94,
    updatedAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
    issues: [
      {
        id: 'issue-1',
        title: '接收方安全能力证明需补充附件',
        severity: 'medium',
        status: 'pending',
        suggestion: '补充加密、访问控制和日志留存的制度说明。',
      },
    ],
  },
  {
    id: 'material-2',
    name: '标准合同备案材料包',
    filingType: 'standardContract',
    status: 'draft',
    completeness: 76,
    updatedAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    issues: [
      {
        id: 'issue-2',
        title: '数据字段清单未与业务目的对齐',
        severity: 'medium',
        status: 'review',
        suggestion: '按最小必要原则拆分字段并补充用途说明。',
      },
      {
        id: 'issue-3',
        title: '接收方联系人信息未填写',
        severity: 'low',
        status: 'pending',
        suggestion: '补齐联系人、邮箱和管理职责。',
      },
    ],
  },
  {
    id: 'material-3',
    name: '个人信息保护认证准备清单',
    filingType: 'certification',
    status: 'checking',
    completeness: 81,
    updatedAt: dayjs().subtract(18, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    issues: [
      {
        id: 'issue-4',
        title: '制度文件版本号不一致',
        severity: 'low',
        status: 'pending',
        suggestion: '统一模板版本并更新目录索引。',
      },
    ],
  },
  {
    id: 'material-4',
    name: '出境场景说明书',
    filingType: 'securityAssessment',
    status: 'completed',
    completeness: 89,
    updatedAt: dayjs().subtract(12, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    issues: [
      {
        id: 'issue-5',
        title: '保留期限依据需细化',
        severity: 'medium',
        status: 'review',
        suggestion: '将保留期限与业务规则和法律依据逐项映射。',
      },
    ],
  },
  {
    id: 'material-5',
    name: '接收方保护措施说明',
    filingType: 'standardContract',
    status: 'draft',
    completeness: 68,
    updatedAt: dayjs().subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    issues: [
      {
        id: 'issue-6',
        title: '日志审计方案未落到可执行控制点',
        severity: 'high',
        status: 'pending',
        suggestion: '补充日志采集周期、审计人和异常响应流程。',
      },
    ],
  },
];

export const materialCheckResults: MaterialCheckResult[] = [
  {
    id: 'material-check-1',
    materialId: 'material-1',
    checkType: '安全评估材料完整性检查',
    score: 92,
    status: 'completed',
    issues: ['接收方证明文件建议增加近三个月版本。'],
  },
  {
    id: 'material-check-2',
    materialId: 'material-2',
    checkType: '标准合同备案材料检查',
    score: 78,
    status: 'review',
    issues: ['字段清单与场景说明不一致', '附件命名不统一'],
  },
  {
    id: 'material-check-3',
    materialId: 'material-5',
    checkType: '技术保护措施专项检查',
    score: 71,
    status: 'pending',
    issues: ['日志留存周期未注明', '跨境传输加密策略描述过于笼统'],
  },
];
