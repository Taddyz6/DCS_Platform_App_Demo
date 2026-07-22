import dayjs from 'dayjs';
import { assessmentRecords, findRegulationById, reports, scenarios } from '@/mock';
import type { AssessmentRecord, ReportSection, Scenario } from '@/types/domain';

export interface AssessmentDetail {
  recordId: string;
  reportName: string;
  recommendedPath: string;
  hitConditions: string[];
  unmetConditions: string[];
  pendingItems: string[];
  rulePath: string[];
  citations: string[];
  sections: ReportSection[];
}

export interface CreatedAssessmentPayload {
  name: string;
  type: AssessmentRecord['type'];
  scenarioId: string;
  riskLevel: NonNullable<AssessmentRecord['riskLevel']>;
  resultSummary: string;
  citations: string[];
  detail: Omit<AssessmentDetail, 'recordId'>;
}

const typeLabelMap: Record<AssessmentRecord['type'], string> = {
  precheck: '跨境合规研判（旧版）',
  path: '跨境合规研判',
  listPolicy: '清单政策识别',
  risk: '风险评估',
  pia: 'PIA',
};

const recommendedPathMap: Record<AssessmentRecord['type'], string> = {
  precheck: '先完成场景预检，再根据结果选择安全评估、标准合同或其他路径。',
  path: '根据路径问卷结果确定优先合规安排并准备申报材料。',
  listPolicy: '优先核查负面清单、豁免条件和便利化政策，再决定下一步。',
  risk: '完成风险矩阵评估后制定整改计划和补充控制措施。',
  pia: '补充个人信息处理影响说明，并完善告知、最小必要和留痕措施。',
};

const typeHitConditionMap: Record<AssessmentRecord['type'], string[]> = {
  precheck: ['已识别跨境传输场景', '已确认接收方所在国家或地区', '已初步识别数据类型'],
  path: ['已完成路径问卷', '已识别个人信息/重要数据要素', '已匹配主要法规要求'],
  listPolicy: ['已校验负面清单条件', '已扫描便利化政策项', '已核查豁免触发条件'],
  risk: ['已生成评分结果', '已形成风险矩阵', '已输出整改优先级'],
  pia: ['已识别个人信息处理目的', '已评估必要性与影响', '已整理数据主体权益风险'],
};

const typeUnmetConditionMap: Record<AssessmentRecord['type'], string[]> = {
  precheck: ['接收方保护能力材料待补充', '保留期限和删除策略待确认'],
  path: ['适用门槛边界待进一步复核', '接收方合同约束条款待补充'],
  listPolicy: ['行业便利化政策证据不足', '触发豁免的补充说明待提供'],
  risk: ['访问控制有效性证据待补齐', '日志审计周期说明待更新'],
  pia: ['敏感个人信息最小必要说明待补充', '告知模板留痕路径待确认'],
};

const typePendingItemMap: Record<AssessmentRecord['type'], string[]> = {
  precheck: ['确认出境频率和批量规模', '确认业务必要性说明'],
  path: ['复核适用路径阈值', '确定后续材料准备清单'],
  listPolicy: ['收集自贸区和绿色通道适用材料', '补充业务豁免场景说明'],
  risk: ['同步安排整改责任部门', '确认整改计划时间'],
  pia: ['补充数据主体权利响应机制', '确认接收方违规响应安排'],
};

const typeRulePathMap: Record<AssessmentRecord['type'], string[]> = {
  precheck: ['场景识别', '数据出境判断', '风险等级初判', '推荐后续事项'],
  path: ['问卷填写', '命中条件识别', '适用路径判断', '生成路径结论'],
  listPolicy: ['政策扫描', '负面清单识别', '豁免条件判断', '输出政策摘要'],
  risk: ['问卷评分', '风险矩阵', '整改优先级', '生成评估摘要'],
  pia: ['影响识别', '必要性分析', '风险归因', '形成影响评估建议'],
};

export const assessmentTypeOptions = [
  { label: '跨境合规研判（旧版）', value: 'precheck' },
  { label: '跨境合规研判', value: 'path' },
  { label: '清单政策识别', value: 'listPolicy' },
];

export const commonScenarioOptions = scenarios.map((item) => ({
  label: item.name,
  value: item.id,
}));

export const getScenarioById = (scenarioId?: string) =>
  scenarios.find((item) => item.id === scenarioId);

export const getAssessmentById = (id?: string) =>
  assessmentRecords.find((item) => item.id === id);

const buildSections = (
  title: string,
  summary: string,
  detail: Omit<AssessmentDetail, 'recordId' | 'sections' | 'reportName'>,
): ReportSection[] => [
  {
    id: `${title}-section-1`,
    title: '一、场景概述',
    content: summary,
  },
  {
    id: `${title}-section-2`,
    title: '二、命中条件',
    content: detail.hitConditions.join('；'),
  },
  {
    id: `${title}-section-3`,
    title: '三、待确认事项',
    content: detail.pendingItems.join('；'),
  },
];

export function deriveAssessmentDetail(record: AssessmentRecord): AssessmentDetail {
  const scenario = getScenarioById(record.scenarioId);
  const recommendedPath =
    scenario?.recommendedPath ?? recommendedPathMap[record.type];
  const hitConditions = typeHitConditionMap[record.type];
  const unmetConditions = typeUnmetConditionMap[record.type];
  const pendingItems = typePendingItemMap[record.type];
  const rulePath = typeRulePathMap[record.type];
  const reportName = `${record.name}报告`;

  return {
    recordId: record.id,
    reportName,
    recommendedPath,
    hitConditions,
    unmetConditions,
    pendingItems,
    rulePath,
    citations: record.citations,
    sections: buildSections(reportName, record.resultSummary, {
      recommendedPath,
      hitConditions,
      unmetConditions,
      pendingItems,
      rulePath,
      citations: record.citations,
    }),
  };
}

export function createAssessmentPayloadFromPrecheck(params: {
  scenario: Scenario;
  dataCount: string;
  destinationPurpose: string;
  containsSensitiveInfo: string;
}) {
  const riskLevel =
    params.scenario.riskLevel === 'high' || params.containsSensitiveInfo === 'yes'
      ? 'high'
      : 'medium';
  const summary =
    riskLevel === 'high'
      ? '初步判断为中高风险场景，建议继续进行路径研判并补充接收方保护能力材料。'
      : '已识别为一般跨境场景，可继续评估标准合同或其他适用路径。';

  const hitConditions = [
    `已识别场景：${params.scenario.name}`,
    `拟出境数据量级：${params.dataCount}`,
    `出境目的：${params.destinationPurpose}`,
  ];

  const citations =
    riskLevel === 'high'
      ? ['reg-cn-dsl', 'reg-cn-security-assessment']
      : ['reg-cn-pipl', 'reg-cn-standard-contract'];

  return {
    name: `${params.scenario.industry}跨境场景预检`,
    type: 'precheck' as const,
    scenarioId: params.scenario.id,
    riskLevel,
    resultSummary: summary,
    citations,
    detail: {
      reportName: `${params.scenario.industry}跨境场景预检报告`,
      recommendedPath: params.scenario.recommendedPath,
      hitConditions,
      unmetConditions: [
        '接收方制度证明文件待补充',
        '保留期限与删除机制待进一步确认',
      ],
      pendingItems: [
        '补充出境频率和批次说明',
        '确认接收方数据最小必要范围',
      ],
      rulePath: typeRulePathMap.precheck,
      citations,
      sections: buildSections(
        `${params.scenario.industry}跨境场景预检报告`,
        summary,
        {
          recommendedPath: params.scenario.recommendedPath,
          hitConditions,
          unmetConditions: ['接收方制度证明文件待补充', '保留期限与删除机制待进一步确认'],
          pendingItems: ['补充出境频率和批次说明', '确认接收方数据最小必要范围'],
          rulePath: typeRulePathMap.precheck,
          citations,
        },
      ),
    },
  } satisfies CreatedAssessmentPayload;
}

export function createAssessmentPayloadFromPath(params: {
  scenario: Scenario;
  destinationPurpose: string;
  dataCategories: string[];
  dataScaleCategory: string;
  isCii: string;
}) {
  const categoryLabelMap: Record<string, string> = {
    general: '一般数据',
    important: '重要数据',
    core: '核心数据',
    personal: '个人信息',
    'sensitive-personal': '敏感个人信息',
  };
  const scaleLabelMap: Record<string, string> = {
    'not-applicable': '不涉及个人信息数量统计',
    'personal-under-100k': '个人信息不满 10 万人',
    'personal-100k-to-1m': '个人信息 10 万人以上、不满 100 万人',
    'personal-1m-plus': '个人信息 100 万人以上',
    'sensitive-under-10k': '敏感个人信息不满 1 万人',
    'sensitive-10k-plus': '敏感个人信息 1 万人以上',
  };
  const includesImportantData = params.dataCategories.includes('important');
  const includesCoreData = params.dataCategories.includes('core');
  const includesPersonalData =
    params.dataCategories.includes('personal') ||
    params.dataCategories.includes('sensitive-personal');
  const exceedsPersonalThreshold = params.dataScaleCategory === 'personal-1m-plus';
  const exceedsSensitiveThreshold = params.dataScaleCategory === 'sensitive-10k-plus';
  const recommendSecurityAssessment =
    includesImportantData ||
    includesCoreData ||
    exceedsPersonalThreshold ||
    exceedsSensitiveThreshold ||
    (params.isCii === 'yes' && includesPersonalData);
  const requiresStandardContract =
    params.dataScaleCategory === 'personal-100k-to-1m' ||
    params.dataScaleCategory === 'sensitive-under-10k';
  const riskLevel = recommendSecurityAssessment ? 'high' : requiresStandardContract ? 'medium' : 'low';
  const recommendedPath = includesCoreData
    ? '涉及核心数据，应先执行严格的出境必要性与权限复核，并进入数据出境安全评估路径。'
    : recommendSecurityAssessment
      ? '当前条件触发数据出境安全评估，应准备申报材料、数据处理说明和境外接收方安全能力证明。'
      : requiresStandardContract
        ? '当前数量区间可优先选择订立个人信息出境标准合同或通过个人信息保护认证。'
        : '当前条件未触发安全评估数量门槛，可继续核查豁免条件；不适用豁免时按标准合同或认证路径办理。';
  const citations = recommendSecurityAssessment
    ? ['reg-cn-auto-guide-2026', 'reg-cn-security-assessment', 'reg-cn-dsl']
    : ['reg-cn-auto-guide-2026', 'reg-cn-standard-contract', 'reg-cn-pipl'];

  const selectedCategoryLabels = params.dataCategories.map(
    (category) => categoryLabelMap[category] ?? category,
  );

  const hitConditions = [
    `场景：${params.scenario.name}`,
    `出境目的：${params.destinationPurpose}`,
    `数据类别：${selectedCategoryLabels.join('、')}`,
    `拟出境数据量级类别：${scaleLabelMap[params.dataScaleCategory] ?? params.dataScaleCategory}`,
    params.isCii === 'yes' ? '主体为关键信息基础设施运营者' : '主体非关键信息基础设施运营者',
    recommendSecurityAssessment ? '已触发安全评估条件' : '未触发安全评估条件',
  ];

  const summary = includesCoreData
    ? '研判识别到核心数据，须从严控制出境并进入安全评估及专项人工复核。'
    : recommendSecurityAssessment
      ? '研判结果已触发数据出境安全评估条件。'
      : requiresStandardContract
        ? '研判结果适用个人信息出境标准合同或个人信息保护认证路径。'
        : '研判结果暂未触发安全评估数量门槛，需继续核查豁免及其他适用条件。';

  return {
    name: `${params.scenario.industry}跨境合规研判`,
    type: 'path' as const,
    scenarioId: params.scenario.id,
    riskLevel,
    resultSummary: summary,
    citations,
    detail: {
      reportName: `${params.scenario.industry}跨境合规研判报告`,
      recommendedPath,
      hitConditions,
      unmetConditions: [
        '汽车数据分类分级依据待形成书面附件',
        '境外接收方安全保护能力证明待补充',
      ],
      pendingItems: [
        '复核研发设计、道路测试、驾驶自动化、联网运行或 OTA 场景边界',
        recommendSecurityAssessment ? '启动安全评估申报材料准备' : '核查豁免、标准合同或认证适用条件',
      ],
      rulePath: typeRulePathMap.path,
      citations,
      sections: buildSections(`${params.scenario.industry}跨境合规研判报告`, summary, {
        recommendedPath,
        hitConditions,
        unmetConditions: ['汽车数据分类分级依据待形成书面附件', '境外接收方安全保护能力证明待补充'],
        pendingItems: [
          '复核汽车业务场景边界',
          recommendSecurityAssessment ? '启动安全评估申报材料准备' : '核查豁免、标准合同或认证适用条件',
        ],
        rulePath: typeRulePathMap.path,
        citations,
      }),
    },
  } satisfies CreatedAssessmentPayload;
}

export function createAssessmentPayloadFromListPolicy(params: {
  scenario: Scenario;
  selectedPolicies: string[];
}) {
  const policyLabelMap: Record<string, string> = {
    negative: '负面清单',
    positive: '正面清单',
    exemption: '豁免条件',
    ftz: '自贸区便利化政策',
    green: '绿色通道',
  };
  const selectedPolicyLabels = params.selectedPolicies.map(
    (policy) => policyLabelMap[policy] ?? policy,
  );
  const hasExemption = params.selectedPolicies.includes('exemption');
  const hasFacilitation =
    params.selectedPolicies.includes('ftz') ||
    params.selectedPolicies.includes('green');
  const riskLevel = hasExemption ? 'low' : hasFacilitation ? 'medium' : 'high';
  const citations = hasExemption
    ? ['reg-cn-data-flow', 'reg-cn-pipl']
    : ['reg-cn-auto-guide-2026', 'reg-cn-security-assessment'];
  const summary = hasExemption
    ? '已识别部分豁免线索，但仍需补充适用证据和业务边界说明。'
    : hasFacilitation
      ? '识别到便利化政策线索，但未直接替代常规合规判断。'
      : '未命中明显豁免或便利化政策，建议继续按常规路径研判。';

  const recommendedPath = hasExemption
    ? '优先补齐豁免条件证据，再决定是否进入下一步合规程序。'
    : '继续执行路径研判，并同步准备基础材料。';

  return {
    name: `${params.scenario.industry}清单政策识别`,
    type: 'listPolicy' as const,
    scenarioId: params.scenario.id,
    riskLevel,
    resultSummary: summary,
    citations,
    detail: {
      reportName: `${params.scenario.industry}清单政策识别报告`,
      recommendedPath,
      hitConditions: [
        `已扫描政策项：${selectedPolicyLabels.join('、') || '未选择'}`,
        `目标地区：${params.scenario.toCountry}`,
        hasExemption ? '已识别潜在豁免条件' : '未识别明确豁免条件',
      ],
      unmetConditions: [
        '政策适用证据待补充',
        '业务边界和数据流向说明待进一步核查',
      ],
      pendingItems: [
        '补充自贸区或行业特殊政策依据',
        '确认后续常规路径是否需要继续推进',
      ],
      rulePath: typeRulePathMap.listPolicy,
      citations,
      sections: buildSections(`${params.scenario.industry}清单政策识别报告`, summary, {
        recommendedPath,
        hitConditions: [
          `已扫描政策项：${selectedPolicyLabels.join('、') || '未选择'}`,
          `目标地区：${params.scenario.toCountry}`,
          hasExemption ? '已识别潜在豁免条件' : '未识别明确豁免条件',
        ],
        unmetConditions: ['政策适用证据待补充', '业务边界和数据流向说明待进一步核查'],
        pendingItems: ['补充自贸区或行业特殊政策依据', '确认后续常规路径是否需要继续推进'],
        rulePath: typeRulePathMap.listPolicy,
        citations,
      }),
    },
  } satisfies CreatedAssessmentPayload;
}

export const getAssessmentTypeLabel = (type: AssessmentRecord['type']) =>
  typeLabelMap[type];

export const getAssessmentCitations = (ids: string[]) =>
  ids
    .map((id) => findRegulationById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      id: item.id,
      title: item.title,
      article: item.articles[0]?.title ?? '条款 1',
      summary: item.summary,
    }));

export const getAssessmentReportPreview = (detail: AssessmentDetail) => ({
  title: detail.reportName,
  subtitle: `生成时间：${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
  sections: detail.sections,
});

export const getAssessmentRelatedReports = () =>
  reports.filter((item) => item.type === '研判报告').slice(0, 4);
