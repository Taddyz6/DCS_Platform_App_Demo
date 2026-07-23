import dayjs from 'dayjs';
import type {
  Report,
  SecurityEvent,
  SecurityNodeStatus,
  SecuritySnapshot,
} from '@/types/domain';

export const securitySnapshot: SecuritySnapshot = {
  trafficGb: 428,
  activeConnections: 36,
  riskEventCount: 5,
  monitoredCountries: ['德国', '新加坡', '中国香港', '欧盟', '日本'],
};

export const securityEvents: SecurityEvent[] = [
  {
    id: 'security-event-1',
    time: dayjs().subtract(5, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    sourceCountry: '中国',
    destinationCountry: '德国',
    type: '传输加密策略变更',
    result: '已拦截',
    riskLevel: 'high',
    summary: '检测到整车研发链路加密套件变更，已触发人工复核。',
  },
  {
    id: 'security-event-2',
    time: dayjs().subtract(4, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    sourceCountry: '中国',
    destinationCountry: '新加坡',
    type: '异常下载峰值',
    result: '已告警',
    riskLevel: 'medium',
    summary: '道路测试数据下载量短时间升高，已记录审计日志。',
  },
  {
    id: 'security-event-3',
    time: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    sourceCountry: '中国',
    destinationCountry: '中国香港',
    type: '接口重试异常',
    result: '已恢复',
    riskLevel: 'low',
    summary: '智能驾驶研发链路出现短时重试峰值，系统已自动恢复。',
  },
  {
    id: 'security-event-4',
    time: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    sourceCountry: '中国',
    destinationCountry: '欧盟',
    type: '访问控制策略变更',
    result: '待复核',
    riskLevel: 'high',
    summary: '车联网运行平台角色权限调整，需要补充审批留痕。',
  },
  {
    id: 'security-event-5',
    time: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    sourceCountry: '中国',
    destinationCountry: '日本',
    type: '节点吞吐下降',
    result: '监控中',
    riskLevel: 'medium',
    summary: 'OTA 升级日志链路吞吐下降，已加入趋势跟踪。',
  },
];

export const securityNodeStatuses: SecurityNodeStatus[] = [
  {
    id: 'node-1',
    name: '上海出口网关',
    region: '中国',
    status: 'healthy',
    throughputGb: 128,
  },
  {
    id: 'node-2',
    name: '法兰克福接收节点',
    region: '德国',
    status: 'warning',
    throughputGb: 76,
  },
  {
    id: 'node-3',
    name: '新加坡业务节点',
    region: '新加坡',
    status: 'healthy',
    throughputGb: 84,
  },
  {
    id: 'node-4',
    name: '香港服务节点',
    region: '中国香港',
    status: 'healthy',
    throughputGb: 63,
  },
  {
    id: 'node-5',
    name: '东京研发节点',
    region: '日本',
    status: 'offline',
    throughputGb: 0,
  },
];

export const securityReports: Report[] = Array.from({ length: 5 }, (_, index) => ({
  id: `security-report-${index + 1}`,
  name: `安全监测报告 ${index + 1}`,
  type: '安全监测报告',
  status: index === 4 ? 'draft' : 'generated',
  createdAt: dayjs().subtract(index, 'week').format('YYYY-MM-DD HH:mm:ss'),
  summary: '用于展示跨境链路、风险事件、节点状态和趋势图的本地监测结果。',
  sections: [
    {
      id: `security-report-${index + 1}-section-1`,
      title: '监测概览',
      content: '总结本周期传输量、连接数和风险事件数量。',
    },
    {
      id: `security-report-${index + 1}-section-2`,
      title: '事件分析',
      content: '展示异常下载、策略变更和节点告警等风险事件。',
    },
    {
      id: `security-report-${index + 1}-section-3`,
      title: '整改建议',
      content: '输出日志留存、访问控制和链路稳定性方面的建议。',
    },
  ],
}));
