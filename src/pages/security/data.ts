import { findRegulationById, securityEvents, securityNodeStatuses, securityReports, securitySnapshot } from '@/mock';
import type { Report, SecurityEvent } from '@/types/domain';
import type { CitationItem } from '@/types/ui';

export interface SecurityCapabilityCard {
  title: string;
  description: string;
  points: string[];
}

export interface TransferSolutionCard {
  id: string;
  title: string;
  type: string;
  regions: string[];
  summary: string;
  strengths: string[];
}

export const securityCapabilities: SecurityCapabilityCard[] = [
  {
    title: '数据脱敏与最小必要',
    description: '用于展示字段脱敏、样本裁剪和多环境数据隔离的安全方案。',
    points: ['字段分层脱敏', '研发/生产环境隔离', '样本最小化输出'],
  },
  {
    title: '访问控制与审批留痕',
    description: '用于展示角色权限、临时授权和审批记录留痕能力。',
    points: ['角色分级授权', '临时权限回收', '审批记录可追溯'],
  },
  {
    title: '链路加密与专线传输',
    description: '用于展示跨境专线、网关和加密传输策略的能力编排。',
    points: ['TLS/专线双通道', '网关策略切换', '传输异常告警'],
  },
  {
    title: '日志审计与持续监测',
    description: '用于展示传输日志、异常下载、节点健康度和整改闭环。',
    points: ['链路日志统一汇聚', '异常事件分级告警', '整改事项联动'],
  },
];

export const transferSolutions: TransferSolutionCard[] = [
  {
    id: 'transfer-1',
    title: '集团专线加密方案',
    type: '专线 + 网关',
    regions: ['中国', '德国', '新加坡'],
    summary: '适用于集团内部高频数据共享场景，强调稳定性、访问审批和节点级监测。',
    strengths: ['稳定传输', '节点健康监测', '接收方范围固定'],
  },
  {
    id: 'transfer-2',
    title: '合作方网关交换方案',
    type: '网关 + 临时授权',
    regions: ['中国', '欧盟', '日本'],
    summary: '适用于外部合作机构场景，强调一次性授权、字段裁剪和审计留痕。',
    strengths: ['临时授权', '字段最小化', '外部接收方隔离'],
  },
  {
    id: 'transfer-3',
    title: '可信数据空间共享方案',
    type: '可信空间 + 隐私计算',
    regions: ['中国', '中国香港', '新加坡'],
    summary: '适用于多方协作与联合分析场景，强调可用不可见和策略联动。',
    strengths: ['多方协作', '隐私计算', '策略联动'],
  },
];

export const trustedSpaceParticipants = [
  {
    name: '数据提供方',
    description: '提供原始业务或研发数据，控制输出字段、使用范围和共享周期。',
  },
  {
    name: '数据使用方',
    description: '基于授权在可信空间内执行分析、统计或研发协同操作。',
  },
  {
    name: '平台治理方',
    description: '负责策略执行、日志审计、节点健康和共享规则管理。',
  },
];

export const trustedSpaceCapabilities = [
  '联合查询与最小必要结果输出',
  '隐私计算与策略沙箱',
  '多方协作审批流',
  '全链路日志与水印留痕',
];

export function getSecurityCitations(ids: string[]): CitationItem[] {
  return ids
    .map((id) => findRegulationById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      id: item.id,
      title: `《${item.title}》`,
      article: item.articles[0]?.title ?? '重点条款',
      summary: item.summary,
    }));
}

export function getSecurityHomeStats() {
  return [
    {
      title: '监测国家/地区',
      value: securitySnapshot.monitoredCountries.length,
      suffix: '个',
      description: '覆盖当前场景中的主要跨境方向。',
    },
    {
      title: '活跃链路',
      value: securitySnapshot.activeConnections,
      suffix: '条',
      description: '当前处于监控中的传输连接数。',
    },
    {
      title: '风险事件',
      value: securitySnapshot.riskEventCount,
      suffix: '起',
      description: '用于演示告警分级、日志留痕和复核流程。',
    },
  ];
}

export function getTrafficTrend() {
  return securitySnapshot.monitoredCountries.map((country, index) => ({
    country,
    traffic: Math.max(48, securitySnapshot.trafficGb - index * 52),
  }));
}

export function getNodeStatusSummary() {
  return securityNodeStatuses.map((node) => ({
    ...node,
    label:
      node.status === 'healthy'
        ? '运行正常'
        : node.status === 'warning'
          ? '需要关注'
          : '离线',
  }));
}

export function getAuditLogs(): Array<SecurityEvent & { actor: string; target: string }> {
  return securityEvents.map((event, index) => ({
    ...event,
    actor: index % 2 === 0 ? '跨境网关' : '安全运营中心',
    target: `${event.sourceCountry} -> ${event.destinationCountry}`,
  }));
}

export function getSecurityReports(): Report[] {
  return securityReports.slice(0, 4);
}
