import dayjs from 'dayjs';
import {
  findRegulationById,
  materialCheckResults,
  materials,
  reports,
  scenarios,
} from '@/mock';
import type {
  Material,
  MaterialCheckResult,
  MaterialIssue,
  ReportSection,
  Scenario,
} from '@/types/domain';
import type { BusinessStatus, CitationItem, RiskLevel } from '@/types/ui';

export interface FilingRecord {
  id: string;
  materialId: string;
  name: string;
  filingType: Material['filingType'];
  scenarioId: string;
  destination: string;
  status: BusinessStatus;
  completeness: number;
  summary: string;
  citations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UploadedMaterialMeta {
  uid: string;
  name: string;
  size?: number;
  type?: string;
}

export interface FilingMaterialDetail {
  materialId: string;
  documentTitle: string;
  subtitle: string;
  notes: string;
  checklist: string[];
  sections: ReportSection[];
  citations: string[];
  uploads: UploadedMaterialMeta[];
}

export interface CreatedFilingPayload {
  record: Omit<FilingRecord, 'id' | 'materialId' | 'createdAt' | 'updatedAt'> & {
    materialName: string;
    materialStatus: Material['status'];
    materialIssues: MaterialIssue[];
  };
  detail: Omit<FilingMaterialDetail, 'materialId'>;
}

type FilingType = Material['filingType'];

const filingTypeLabelMap: Record<FilingType, string> = {
  securityAssessment: '安全评估申报',
  standardContract: '标准合同备案',
  certification: '个人信息保护认证',
};

const filingTypeRouteMap: Record<FilingType, string> = {
  securityAssessment: '/filing/security-assessment',
  standardContract: '/filing/standard-contract',
  certification: '/filing/certification',
};

const filingTypeCitationMap: Record<FilingType, string[]> = {
  securityAssessment: ['reg-cn-dsl', 'reg-cn-security-assessment'],
  standardContract: ['reg-cn-pipl', 'reg-cn-standard-contract'],
  certification: ['reg-cn-pipl', 'reg-eu-gdpr'],
};

const filingDefaultScenarioMap: Record<FilingType, string> = {
  securityAssessment: 'scenario-auto-de',
  standardContract: 'scenario-hr-sg',
  certification: 'scenario-service-hk',
};

const filingChecklistMap: Record<FilingType, string[]> = {
  securityAssessment: [
    '出境场景说明与业务必要性证明',
    '数据类型与数量级说明',
    '接收方安全保护能力材料',
    '安全评估自查与整改说明',
  ],
  standardContract: [
    '标准合同文本与附件',
    '个人信息字段清单和处理目的说明',
    '接收方联系人及管理责任说明',
    '个人信息保护影响评估摘要',
  ],
  certification: [
    '认证准备清单与制度目录',
    '个人信息保护组织架构说明',
    '接收方约束与审计机制说明',
    '整改闭环和持续改进证据',
  ],
};

const filingTypeIssuePrefixMap: Record<FilingType, string> = {
  securityAssessment: '安全评估',
  standardContract: '标准合同',
  certification: '认证准备',
};

const severityScoreMap: Record<RiskLevel, number> = {
  low: 6,
  medium: 12,
  high: 20,
};

function buildMaterialSections(
  title: string,
  scenario: Scenario,
  summary: string,
  checklist: string[],
  notes?: string,
): ReportSection[] {
  return [
    {
      id: `${title}-overview`,
      title: '一、场景概述',
      content: `${scenario.name}，目的地为 ${scenario.toCountry}，涉及数据类型：${scenario.dataTypes.join('、')}。`,
    },
    {
      id: `${title}-summary`,
      title: '二、办理摘要',
      content: summary,
    },
    {
      id: `${title}-checklist`,
      title: '三、材料清单',
      content: checklist.join('；'),
    },
    {
      id: `${title}-notes`,
      title: '四、补充说明',
      content: notes || '当前材料可在编辑页继续补充说明和上传元数据。',
    },
  ];
}

function getCompletenessByValues(values: number[]) {
  const score = Math.round(values.reduce((total, item) => total + item, 0) / values.length);

  if (score >= 90) {
    return 92;
  }
  if (score >= 70) {
    return 82;
  }
  if (score >= 50) {
    return 74;
  }
  return 66;
}

function getRecordStatusByCompleteness(completeness: number): BusinessStatus {
  if (completeness >= 90) {
    return 'completed';
  }
  if (completeness >= 76) {
    return 'review';
  }
  return 'pending';
}

function getMaterialStatusByCompleteness(completeness: number): Material['status'] {
  if (completeness >= 90) {
    return 'completed';
  }
  if (completeness >= 76) {
    return 'checking';
  }
  return 'draft';
}

function getRiskLevelByCompleteness(completeness: number): RiskLevel {
  if (completeness >= 90) {
    return 'low';
  }
  if (completeness >= 76) {
    return 'medium';
  }
  return 'high';
}

function buildIssues(
  filingType: FilingType,
  completeness: number,
  focusItems: string[],
): MaterialIssue[] {
  const severity = getRiskLevelByCompleteness(completeness);

  return focusItems.slice(0, 2).map((item, index) => ({
    id: `${filingType}-issue-${index + 1}`,
    title: `${filingTypeIssuePrefixMap[filingType]}材料需补充：${item}`,
    severity,
    status: completeness >= 90 ? 'review' : 'pending',
    suggestion: `建议围绕“${item}”补充说明、附件或留痕材料。`,
  }));
}

function buildSeedFilingRecords() {
  return materials.map((material, index) => {
    const scenario = scenarios[index % scenarios.length];

    return {
      id: `filing-seed-${index + 1}`,
      materialId: material.id,
      name: `${getFilingTypeLabel(material.filingType)}事项 ${index + 1}`,
      filingType: material.filingType,
      scenarioId: scenario.id,
      destination: scenario.toCountry,
      status: getMaterialBusinessStatus(material.status),
      completeness: material.completeness,
      summary: `${material.name} 当前完成度为 ${material.completeness}%，可继续在材料中心补充说明和附件元数据。`,
      citations: filingTypeCitationMap[material.filingType],
      createdAt: dayjs(material.updatedAt).subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: material.updatedAt,
    } satisfies FilingRecord;
  });
}

export const filingRecordsSeed = buildSeedFilingRecords();

export const filingScenarioOptions = scenarios.map((scenario) => ({
  label: scenario.name,
  value: scenario.id,
}));

export function getFilingTypeLabel(type: FilingType) {
  return filingTypeLabelMap[type];
}

export function getFilingTypeRoute(type: FilingType) {
  return filingTypeRouteMap[type];
}

export function getMaterialBusinessStatus(status: Material['status']): BusinessStatus {
  if (status === 'checking') {
    return 'review';
  }
  return status;
}

export function getFilingCitations(ids: string[]): CitationItem[] {
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

export function getScenarioById(id?: string) {
  return scenarios.find((scenario) => scenario.id === id);
}

export function getMaterialById(id?: string) {
  return materials.find((material) => material.id === id);
}

export function deriveMaterialDetail(
  material: Material,
  record?: FilingRecord,
): FilingMaterialDetail {
  const scenario =
    getScenarioById(record?.scenarioId) ??
    getScenarioById(filingDefaultScenarioMap[material.filingType]) ??
    scenarios[0];
  const checklist = filingChecklistMap[material.filingType];
  const summary = record?.summary ?? `${material.name} 已纳入材料中心，可继续编辑和预览。`;

  return {
    materialId: material.id,
    documentTitle: material.name,
    subtitle: `${getFilingTypeLabel(material.filingType)} · 更新于 ${material.updatedAt.slice(0, 16)}`,
    notes: summary,
    checklist,
    sections: buildMaterialSections(material.name, scenario, summary, checklist),
    citations: filingTypeCitationMap[material.filingType],
    uploads: [],
  };
}

export function deriveCheckResult(
  material: Material,
  detail?: FilingMaterialDetail,
): MaterialCheckResult {
  const detailPenalty =
    (detail?.uploads.length ?? 0) > 0 ? 0 : 5;
  const issuePenalty = material.issues.reduce(
    (total, issue) => total + severityScoreMap[issue.severity],
    0,
  );
  const score = Math.max(58, material.completeness + 8 - detailPenalty - Math.round(issuePenalty / 4));

  return {
    id: `check-${material.id}-${score}`,
    materialId: material.id,
    checkType: `${getFilingTypeLabel(material.filingType)}材料完整性检查`,
    score,
    status: score >= 90 ? 'completed' : score >= 78 ? 'review' : 'pending',
    issues:
      material.issues.length > 0
        ? material.issues.map((issue) => `${issue.title}：${issue.suggestion}`)
        : ['未发现明显缺口，建议保留版本号、目录和上传元数据。'],
  };
}

export function getFilingOverview(records: FilingRecord[], localMaterials: Material[]) {
  const combinedMaterials = Array.from(
    new Map([...materials, ...localMaterials].map((material) => [material.id, material])).values(),
  );

  return {
    totalRecords: records.length,
    totalMaterials: combinedMaterials.length,
    reviewCount: records.filter((record) => ['review', 'pending'].includes(record.status)).length,
    completedCount: records.filter((record) => record.status === 'completed').length,
  };
}

export function getFilingHomeReports() {
  return reports
    .filter((report) => ['研判报告', 'PIA 报告'].includes(report.type))
    .slice(0, 3);
}

export function getLatestCheckResults(localChecks: MaterialCheckResult[]) {
  return [...localChecks, ...materialCheckResults]
    .sort((left, right) => right.id.localeCompare(left.id))
    .slice(0, 4);
}

export function getMaterialTypeOptions() {
  return (['securityAssessment', 'standardContract', 'certification'] as const).map((type) => ({
    label: getFilingTypeLabel(type),
    value: type,
  }));
}

export function createSecurityAssessmentPayload(params: {
  scenario: Scenario;
  dataScale: string;
  includesImportantData: string;
  applicant: string;
  notes: string;
}) {
  const focusItems = [
    '接收方保护能力证明',
    '出境数据规模和频次说明',
    '安全评估自查与整改留痕',
  ];
  const completeness = getCompletenessByValues([
    params.includesImportantData === 'yes' ? 58 : 74,
    params.dataScale === 'large' ? 62 : params.dataScale === 'medium' ? 76 : 84,
    params.notes ? 88 : 70,
  ]);
  const summary =
    completeness >= 90
      ? '当前材料成熟度较高，可进入安全评估申报材料复核和补件阶段。'
      : '当前材料仍需补充接收方能力证明、数据规模说明和整改留痕。';
  const checklist = filingChecklistMap.securityAssessment;

  return {
    record: {
      name: `${params.scenario.industry}安全评估申报`,
      filingType: 'securityAssessment' as const,
      scenarioId: params.scenario.id,
      destination: params.scenario.toCountry,
      status: getRecordStatusByCompleteness(completeness),
      completeness,
      summary,
      citations: filingTypeCitationMap.securityAssessment,
      materialName: `${params.scenario.industry}安全评估材料包`,
      materialStatus: getMaterialStatusByCompleteness(completeness),
      materialIssues: buildIssues('securityAssessment', completeness, focusItems),
    },
    detail: {
      documentTitle: `${params.scenario.industry}安全评估材料包`,
      subtitle: `申报责任人：${params.applicant}`,
      notes: params.notes || '当前申报材料可在材料编辑页继续补充说明。',
      checklist,
      sections: buildMaterialSections(
        `${params.scenario.industry}安全评估材料包`,
        params.scenario,
        summary,
        checklist,
        params.notes,
      ),
      citations: filingTypeCitationMap.securityAssessment,
      uploads: [],
    },
  } satisfies CreatedFilingPayload;
}

export function createStandardContractPayload(params: {
  scenario: Scenario;
  personalInfoVolume: string;
  recipientType: string;
  applicant: string;
  notes: string;
}) {
  const focusItems = [
    '标准合同附件字段清单',
    '接收方联系人和职责说明',
    '个人信息出境合法性基础说明',
  ];
  const completeness = getCompletenessByValues([
    params.personalInfoVolume === 'high' ? 65 : params.personalInfoVolume === 'medium' ? 76 : 86,
    params.recipientType === 'external' ? 68 : 82,
    params.notes ? 84 : 72,
  ]);
  const summary =
    completeness >= 90
      ? '标准合同备案材料较完整，建议进入条款复核和提交流程。'
      : '建议继续补充字段清单、接收方联系人和个人信息出境说明。';
  const checklist = filingChecklistMap.standardContract;

  return {
    record: {
      name: `${params.scenario.industry}标准合同备案`,
      filingType: 'standardContract' as const,
      scenarioId: params.scenario.id,
      destination: params.scenario.toCountry,
      status: getRecordStatusByCompleteness(completeness),
      completeness,
      summary,
      citations: filingTypeCitationMap.standardContract,
      materialName: `${params.scenario.industry}标准合同备案材料`,
      materialStatus: getMaterialStatusByCompleteness(completeness),
      materialIssues: buildIssues('standardContract', completeness, focusItems),
    },
    detail: {
      documentTitle: `${params.scenario.industry}标准合同备案材料`,
      subtitle: `备案责任人：${params.applicant}`,
      notes: params.notes || '当前备案材料可在材料编辑页继续完善附件说明。',
      checklist,
      sections: buildMaterialSections(
        `${params.scenario.industry}标准合同备案材料`,
        params.scenario,
        summary,
        checklist,
        params.notes,
      ),
      citations: filingTypeCitationMap.standardContract,
      uploads: [],
    },
  } satisfies CreatedFilingPayload;
}

export function createCertificationPayload(params: {
  scenario: Scenario;
  governanceMaturity: string;
  auditReadiness: string;
  applicant: string;
  notes: string;
}) {
  const focusItems = [
    '制度目录和版本一致性',
    '组织架构与职责矩阵',
    '持续改进和审计闭环证据',
  ];
  const completeness = getCompletenessByValues([
    params.governanceMaturity === 'high' ? 88 : params.governanceMaturity === 'medium' ? 74 : 62,
    params.auditReadiness === 'ready' ? 86 : params.auditReadiness === 'partial' ? 74 : 60,
    params.notes ? 82 : 70,
  ]);
  const summary =
    completeness >= 90
      ? '认证准备度较高，可继续完善机构对接和自评材料。'
      : '建议先补齐制度目录、组织职责矩阵和持续改进证据。';
  const checklist = filingChecklistMap.certification;

  return {
    record: {
      name: `${params.scenario.industry}个人信息保护认证`,
      filingType: 'certification' as const,
      scenarioId: params.scenario.id,
      destination: params.scenario.toCountry,
      status: getRecordStatusByCompleteness(completeness),
      completeness,
      summary,
      citations: filingTypeCitationMap.certification,
      materialName: `${params.scenario.industry}认证准备材料`,
      materialStatus: getMaterialStatusByCompleteness(completeness),
      materialIssues: buildIssues('certification', completeness, focusItems),
    },
    detail: {
      documentTitle: `${params.scenario.industry}认证准备材料`,
      subtitle: `准备责任人：${params.applicant}`,
      notes: params.notes || '当前认证材料可在材料编辑页继续完善说明。',
      checklist,
      sections: buildMaterialSections(
        `${params.scenario.industry}认证准备材料`,
        params.scenario,
        summary,
        checklist,
        params.notes,
      ),
      citations: filingTypeCitationMap.certification,
      uploads: [],
    },
  } satisfies CreatedFilingPayload;
}
