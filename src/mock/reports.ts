import dayjs from 'dayjs';
import type { Report, ReportSection } from '@/types/domain';

type AutomotiveReportSeed = {
  id: string;
  name: string;
  type: string;
  summary: string;
  scope: string;
  conclusion: string;
  action: string;
  status?: Report['status'];
};

const makeSections = (report: AutomotiveReportSeed): ReportSection[] => [
  {
    id: `${report.id}-scope`,
    title: '一、业务场景与数据范围',
    content: report.scope,
  },
  {
    id: `${report.id}-conclusion`,
    title: '二、合规分析结论',
    content: report.conclusion,
  },
  {
    id: `${report.id}-action`,
    title: '三、治理与申报建议',
    content: report.action,
  },
];

const automotiveReports: AutomotiveReportSeed[] = [
  {
    id: 'report-rd-design',
    name: '整车研发设计数据跨境合规分析报告',
    type: '研发设计',
    summary: '分析整车研发协同中的设计参数、仿真模型和试验数据跨境范围及合规路径。',
    scope: '覆盖整车研发设计参数、仿真模型、试验验证记录及境内外研发中心协同链路。',
    conclusion: '研发数据应先完成分类分级与重要数据识别，并根据接收方、目的地和访问权限确定出境路径。',
    action: '建议建立字段级数据清单、境外访问权限矩阵和研发协同日志，形成可追溯的审批与复核记录。',
  },
  {
    id: 'report-production',
    name: '汽车生产制造数据跨境治理评估报告',
    type: '生产制造',
    summary: '评估生产计划、质量检测、供应链协同和设备运行数据的跨境治理要求。',
    scope: '覆盖工厂生产计划、质量检测结果、供应商协同数据及生产设备运行日志。',
    conclusion: '生产制造数据需区分企业经营数据、工业数据和可能涉及的重要数据，控制境外平台接收范围。',
    action: '建议实施数据最小化、供应商权限分层、传输加密及境外接收节点持续监测。',
  },
  {
    id: 'report-autonomous-driving',
    name: '自动驾驶研发数据出境安全评估报告',
    type: '自动驾驶',
    summary: '聚焦道路测试、环境感知、高精度位置与算法训练数据的出境安全评估。',
    scope: '覆盖道路测试视频、点云、高精度位置轨迹、驾驶策略及算法训练数据集。',
    conclusion: '高精度地理信息、道路环境数据及大规模车辆运行数据应作为高关注对象开展专项识别与安全评估。',
    action: '建议先完成脱敏与精度降级，隔离原始数据和训练样本，并准备数据出境安全评估材料。',
  },
  {
    id: 'report-software-update',
    name: 'OTA 软件升级数据跨境合规报告',
    type: '软件升级',
    summary: '分析 OTA 升级包、车辆配置、漏洞信息与远程诊断数据的跨境处理边界。',
    scope: '覆盖软件升级包、签名校验信息、车辆配置、漏洞处置记录和远程诊断反馈。',
    conclusion: '软件升级场景应严格隔离密钥与核心安全信息，并对境外开发和运维访问实施最小权限控制。',
    action: '建议采用签名验证、分区发布、异常回滚和全链路审计，防止关键安全信息超范围出境。',
  },
  {
    id: 'report-connected-operation',
    name: '车联网运行数据跨境安全监测报告',
    type: '联网运行',
    summary: '持续监测车联网运行、远程服务和跨境链路中的数据流量、异常访问与风险事件。',
    scope: '覆盖车辆联网状态、服务调用日志、远程运维记录、链路流量及境外接收节点。',
    conclusion: '联网运行数据具有持续、高频和多节点特征，应结合链路基线识别异常传输与越权访问。',
    action: '建议建立实时告警、流量基线、境外节点健康检查和事件闭环处置机制。',
    status: 'draft',
  },
  {
    id: 'report-after-sales-quality',
    name: '车辆售后诊断与质量改进合规报告',
    type: '售后诊断',
    summary: '评估车辆故障码、远程诊断日志、维修反馈与质量改进数据的跨境处理边界。',
    scope: '覆盖车辆故障码、诊断会话日志、维修工单、缺陷分析及质量闭环记录。',
    conclusion: '售后诊断数据应区分车辆技术信息、用户关联信息与质量缺陷数据，并限制境外质量团队的访问范围。',
    action: '建议对车辆标识进行最小化处理，建立维修数据权限矩阵、问题闭环记录和境外访问审计。',
    status: 'generated',
  },
];

export const reports: Report[] = automotiveReports.map((report, index) => ({
  id: report.id,
  name: report.name,
  type: report.type,
  status: report.status ?? 'generated',
  createdAt: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss'),
  summary: report.summary,
  sections: makeSections(report),
}));
