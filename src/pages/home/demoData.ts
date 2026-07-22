import type { EChartsOption } from 'echarts';
import dayjs from 'dayjs';
import {
  assessmentRecords,
  countryProfiles,
  dataAssets,
  materialCheckResults,
  regulations,
  reports,
  scenarios,
  securityEvents,
  securitySnapshot,
} from '@/mock';
import type { DashboardReportCard } from '@/types/domain';
import type { CitationItem } from '@/types/ui';

export const homeHeroTags = ['安全合规', '高效流通', '规则可追溯', '跨行业适配'];

export const homeHeroMetrics = [
  {
    label: '覆盖模块',
    value: '6',
    description: '法规、研判、治理、申报、安全与报告六大核心模块协同联动。',
  },
  {
    label: '重点场景',
    value: '3',
    description: '聚焦汽车研发、制造协同与算法分析等典型跨境场景。',
  },
  {
    label: '法规与画像',
    value: String(regulations.length),
    description: '支持法规检索、国家画像、问答引用与差异比较。',
  },
  {
    label: '监测国家',
    value: String(securitySnapshot.monitoredCountries.length),
    description: '支持跨境流通视角下的链路、节点和风险态势观测。',
  },
];

export const companyHighlights = [
  {
    title: '服务定位',
    value: '一站式综合方案',
    description: '围绕法规、治理、申报、安全与服务协同构建统一平台入口。',
  },
  {
    title: '重点行业',
    value: '汽车研发与制造协同',
    description: '聚焦汽车研发、测试验证、制造协同与智能网联等关键跨境业务场景。',
  },
  {
    title: '能力闭环',
    value: '规则到落地',
    description: '从合规识别、评估分析到申报备案与安全流通形成完整链路。',
  },
];

export interface HomeFlowNode {
  id: string;
  name: string;
  markerLabel: string;
  role: 'source' | 'hub' | 'destination';
  x: number;
  y: number;
  region: string;
  throughput: string;
}

export interface HomeFlowRoute {
  id: string;
  source: string;
  target: string;
  label: string;
  mechanism: string;
  volume: string;
  latency: string;
  risk: 'low' | 'medium' | 'high';
  status: string;
  payload: string;
}

export interface HomeServiceFlowItem {
  key: string;
  title: string;
  description: string;
  signal: string;
  deliverable: string;
  accent: string;
}

export const homeFlowOverview = [
  {
    label: '在途链路',
    value: '27',
    description: '覆盖当前重点跨境业务方向。',
  },
  {
    label: '活跃节点',
    value: '12',
    description: '多地数据节点保持联动运行。',
  },
  {
    label: '告警工单',
    value: '3',
    description: '聚焦策略偏差与补件提醒。',
  },
];

export const homeFlowNodes: HomeFlowNode[] = [
  {
    id: 'shanghai',
    name: '上海主数据中心',
    markerLabel: 'CN·上海',
    role: 'source',
    x: 720,
    y: 292,
    region: '中国上海',
    throughput: '28.4 TB',
  },
  {
    id: 'lingang',
    name: '临港协同枢纽',
    markerLabel: 'CN·临港',
    role: 'hub',
    x: 780,
    y: 314,
    region: '中国临港',
    throughput: '18.2 TB',
  },
  {
    id: 'guangzhou',
    name: '广州服务节点',
    markerLabel: 'CN·广州',
    role: 'source',
    x: 836,
    y: 346,
    region: '中国广州',
    throughput: '11.6 TB',
  },
  {
    id: 'frankfurt',
    name: '德国研发中心',
    markerLabel: 'DE·法兰克福',
    role: 'destination',
    x: 598,
    y: 198,
    region: '德国法兰克福',
    throughput: '9.1 TB',
  },
  {
    id: 'singapore',
    name: '新加坡合规节点',
    markerLabel: 'SG·新加坡',
    role: 'destination',
    x: 824,
    y: 390,
    region: '新加坡',
    throughput: '7.4 TB',
  },
  {
    id: 'tokyo',
    name: '日本制造协同中心',
    markerLabel: 'JP·东京',
    role: 'destination',
    x: 926,
    y: 256,
    region: '日本东京',
    throughput: '6.8 TB',
  },
  {
    id: 'silicon',
    name: '北美分析节点',
    markerLabel: 'US·西海岸',
    role: 'destination',
    x: 232,
    y: 266,
    region: '美国西海岸',
    throughput: '5.7 TB',
  },
  {
    id: 'dubai',
    name: '中东运营节点',
    markerLabel: 'AE·迪拜',
    role: 'destination',
    x: 686,
    y: 300,
    region: '阿联酋迪拜',
    throughput: '4.6 TB',
  },
];

export const homeFlowRoutes: HomeFlowRoute[] = [
  {
    id: 'flow-frankfurt',
    source: 'lingang',
    target: 'frankfurt',
    label: '研发协同专线',
    mechanism: '标准合同 + 访问控制',
    volume: '12.6 TB',
    latency: '178 ms',
    risk: 'medium',
    status: '稳定运行',
    payload: '研发参数、设备日志、测试样本',
  },
  {
    id: 'flow-singapore',
    source: 'shanghai',
    target: 'singapore',
    label: '客服支撑链路',
    mechanism: '数据最小化 + 审计留痕',
    volume: '8.2 TB',
    latency: '96 ms',
    risk: 'low',
    status: '持续同步',
    payload: '服务工单、联络记录、知识库摘要',
  },
  {
    id: 'flow-tokyo',
    source: 'guangzhou',
    target: 'tokyo',
    label: '制造协同链路',
    mechanism: '专线加密 + 权限隔离',
    volume: '7.4 TB',
    latency: '132 ms',
    risk: 'medium',
    status: '批量传输中',
    payload: '产线指标、质量追踪、供应链状态',
  },
  {
    id: 'flow-silicon',
    source: 'lingang',
    target: 'silicon',
    label: '算法分析链路',
    mechanism: '脱敏样本 + 白名单出口',
    volume: '5.1 TB',
    latency: '226 ms',
    risk: 'high',
    status: '重点监测',
    payload: '模型样本、分析结果、标签数据',
  },
  {
    id: 'flow-dubai',
    source: 'shanghai',
    target: 'dubai',
    label: '国际运营链路',
    mechanism: '最小必要 + 终端加密',
    volume: '4.3 TB',
    latency: '162 ms',
    risk: 'low',
    status: '稳定运行',
    payload: '订单摘要、履约状态、区域报表',
  },
];

export const homeSourceCityRanks = [
  { city: '上海市', value: 19 },
  { city: '深圳市', value: 12 },
  { city: '广州市', value: 10 },
  { city: '苏州市', value: 8 },
  { city: '北京市', value: 6 },
];

export const homeDestinationRanks = [
  { country: '德国', value: '12.6 TB', note: '研发协同' },
  { country: '新加坡', value: '8.2 TB', note: '客服支撑' },
  { country: '日本', value: '7.4 TB', note: '制造协同' },
  { country: '美国', value: '5.1 TB', note: '算法分析' },
  { country: '阿联酋', value: '4.3 TB', note: '国际运营' },
];

export const homeComplianceMix = [
  { label: '标准合同', value: 46, color: '#37d8ff' },
  { label: '安全评估', value: 24, color: '#7bffcb' },
  { label: '认证路径', value: 14, color: '#ffd84f' },
  { label: '行业规则', value: 10, color: '#ff8c5a' },
  { label: '内部机制', value: 6, color: '#ff5f90' },
];

export const homeFlowEvents = [
  {
    time: dayjs().subtract(8, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    route: '研发协同专线',
    target: '德国研发中心',
    status: '完成策略复核',
  },
  {
    time: dayjs().subtract(18, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    route: '算法分析链路',
    target: '北美分析节点',
    status: '触发重点监测',
  },
  {
    time: dayjs().subtract(36, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    route: '客服支撑链路',
    target: '新加坡合规节点',
    status: '同步窗口开启',
  },
  {
    time: dayjs().subtract(52, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    route: '制造协同链路',
    target: '日本制造协同中心',
    status: '批量传输完成',
  },
];

export const dashboardStats = [
  {
    title: '一级菜单',
    value: 9,
    suffix: '项',
    description: '覆盖首页、法规智库、合规研判等九个一级模块。',
  },
  {
    title: '法规与国家画像',
    value: regulations.length,
    suffix: '条',
    description: `已内置 ${countryProfiles.length} 个国家或地区画像和 ${regulations.length} 条法规记录。`,
  },
  {
    title: '业务数据实体',
    value: dataAssets.length + assessmentRecords.length + reports.length,
    suffix: '条',
    description: '已建立资产、评估、报告等完整业务数据集合。',
  },
];

export const riskDistributionOption: EChartsOption = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, icon: 'circle' },
  color: ['#2f7d4b', '#c27a19', '#c2413a'],
  series: [
    {
      type: 'pie',
      radius: ['48%', '72%'],
      center: ['50%', '42%'],
      label: {
        formatter: '{b}\n{d}%',
      },
      data: [
        {
          name: '低风险',
          value: assessmentRecords.filter((item) => item.riskLevel === 'low').length,
        },
        {
          name: '中风险',
          value: assessmentRecords.filter((item) => item.riskLevel === 'medium').length,
        },
        {
          name: '高风险',
          value: assessmentRecords.filter((item) => item.riskLevel === 'high').length,
        },
      ],
    },
  ],
};

export const activityEntries = [
  {
    id: '1',
    title: '全局搜索入口已接入统一业务索引',
    time: dayjs().format('YYYY-MM-DD HH:mm'),
    operator: '公共能力',
    status: 'completed' as const,
  },
  {
    id: '2',
    title: `报告中心已接通 ${reports.length} 份业务报告`,
    time: dayjs().subtract(20, 'minute').format('YYYY-MM-DD HH:mm'),
    operator: '报告中心',
    status: 'completed' as const,
  },
  {
    id: '3',
    title: `平台工作区与设置页已收纳 ${materialCheckResults.length} 条检查结果`,
    time: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
    operator: '系统设置',
    status: 'completed' as const,
  },
];

export const reportCards: DashboardReportCard[] = reports.slice(0, 2).map((report) => ({
  title: report.name,
  type: report.type,
  summary: report.summary,
  updatedAt: report.createdAt.slice(0, 10),
  status: report.status === 'generated' ? 'completed' : 'draft',
}));

export const roadmapItems = [
  {
    color: '#18578f',
    title: '法规识别',
    description: '从法规库、国家画像和智能问答快速定位跨境规则依据。',
  },
  {
    color: '#18578f',
    title: '路径研判',
    description: '基于业务场景、数据特征和政策清单形成推荐路径。',
  },
  {
    color: '#c27a19',
    title: '评估分析',
    description: '围绕资产、重要数据、风险评估和 PIA 形成治理闭环。',
  },
  {
    color: '#18578f',
    title: '备案与流通',
    description: '联动材料中心、传输方案、安全监测和审计留痕能力。',
  },
  {
    color: '#18578f',
    title: '安全监测',
    description: '围绕跨境链路监测、风险告警、审计追踪和态势观测形成闭环。',
  },
];

export const homeServiceFlowItems: HomeServiceFlowItem[] = [
  {
    key: 'identify',
    title: '法规识别',
    description: '从法规库、国家画像和智能问答快速定位跨境规则依据。',
    signal: '法规抓取 / 国家画像 / 智能问答',
    deliverable: '形成跨境规则清单与适用边界。',
    accent: '#2f8fff',
  },
  {
    key: 'assessment',
    title: '路径研判',
    description: '基于业务场景、数据特征和政策清单形成推荐路径。',
    signal: '场景建模 / 规则比对 / 方案分流',
    deliverable: '推荐标准合同、安全评估或认证路径。',
    accent: '#3ed8ff',
  },
  {
    key: 'governance',
    title: '评估分析',
    description: '围绕资产、重要数据、风险评估和 PIA 形成治理闭环。',
    signal: '数据盘点 / 重要数据 / PIA 研判',
    deliverable: '输出治理整改项与风险优先级。',
    accent: '#ffb347',
  },
  {
    key: 'filing',
    title: '申报备案',
    description: '联动材料中心、传输方案、安全监测和审计留痕能力。',
    signal: '材料编制 / 申报校验 / 备案协同',
    deliverable: '沉淀可复用的申报材料包。',
    accent: '#ff875b',
  },
  {
    key: 'delivery',
    title: '安全监测',
    description: '围绕跨境链路监测、风险告警、审计追踪和态势观测形成持续监测能力。',
    signal: '链路监测 / 风险预警 / 审计留痕',
    deliverable: '形成可追踪、可预警、可复盘的安全监测闭环。',
    accent: '#ff5f90',
  },
];

export const dashboardSummaryMetrics = [
  { label: '覆盖模块', value: '9 个' },
  { label: '重点场景', value: `${scenarios.length} 个` },
  { label: '风险事件', value: `${securityEvents.length} 条` },
  { label: '监测国家', value: `${securitySnapshot.monitoredCountries.length} 个` },
];

export const dashboardCitations: CitationItem[] = regulations
  .slice(0, 2)
  .map((regulation, index) => ({
    id: regulation.id,
    title: `《${regulation.title}》`,
    article: regulation.articles[0]?.title ?? `条款 ${index + 1}`,
    summary: regulation.summary,
  }));
