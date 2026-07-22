import dayjs from 'dayjs';
import {
  assessmentRecords,
  dataAssets,
  findRegulationById,
  reports,
  scenarios,
} from '@/mock';
import type {
  AssessmentRecord,
  DataAsset,
  Report,
  ReportSection,
} from '@/types/domain';
import type {
  BusinessStatus,
  CitationItem,
  QuestionnaireItem,
  RiskLevel,
} from '@/types/ui';

export type GovernanceAssessmentType = 'importantData' | 'risk' | 'pia';

export interface GovernanceAssessmentRecord {
  id: string;
  name: string;
  type: GovernanceAssessmentType;
  assetId: string;
  status: 'completed';
  riskLevel: RiskLevel;
  score: number;
  summary: string;
  citations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceAssessmentDetail {
  recordId: string;
  reportName: string;
  outcomeLabel: string;
  recommendedAction: string;
  hitRules: string[];
  pendingItems: string[];
  recommendations: string[];
  scoreBreakdown: Array<{
    label: string;
    score: number;
  }>;
  sections: ReportSection[];
}

export interface CreatedGovernancePayload {
  name: string;
  type: GovernanceAssessmentType;
  assetId: string;
  riskLevel: RiskLevel;
  score: number;
  summary: string;
  citations: string[];
  detail: Omit<GovernanceAssessmentDetail, 'recordId'>;
}

export interface GovernanceRectificationItem {
  id: string;
  title: string;
  source: 'asset' | 'assessment';
  sourceLabel: string;
  assetId: string;
  owner: string;
  dueDate: string;
  riskLevel: RiskLevel;
  status: BusinessStatus;
  suggestion: string;
  summary: string;
}

const assetFieldCatalog: Record<string, string[]> = {
  车辆位置与轨迹: ['车辆唯一标识', '经纬度坐标', '采集时间戳', '行驶方向'],
  道路环境感知: ['道路视频帧', '激光点云', '道路标志', '行人及车辆特征'],
  驾驶自动化: ['驾驶行为特征', '感知模型参数', '决策结果', '接管事件'],
  车联网运行: ['车辆运行状态', '网络连接日志', '安全告警', '运营统计'],
  'OTA 与远程诊断': ['软件版本', '升级日志', '故障码', '漏洞及签名信息'],
  车辆标识与用户: ['VIN', '用户标识', '座舱音视频', '生物识别特征'],
  研发制造: ['车型平台参数', '设计参数', '零部件批次', '质量追溯标识'],
};

const governanceTypeLabelMap: Record<GovernanceAssessmentType, string> = {
  importantData: '重要数据识别',
  risk: '风险评估',
  pia: 'PIA',
};

const ownerMap: Record<string, string> = {
  车辆位置与轨迹: '道路测试数据组',
  道路环境感知: '智能驾驶研发组',
  驾驶自动化: '智能驾驶研发组',
  车联网运行: '车联网安全运营组',
  'OTA 与远程诊断': 'OTA 安全管理组',
  车辆标识与用户: '汽车数据合规组',
  研发制造: '整车研发数据组',
};

const governanceRegulationIds = {
  importantData: ['reg-cn-auto-guide-2026', 'reg-cn-gbt39335', 'reg-cn-dsl', 'reg-cn-security-assessment'],
  risk: ['reg-cn-dsl', 'reg-cn-pipl', 'reg-cn-standard-contract'],
  pia: ['reg-cn-pipl', 'reg-cn-standard-contract'],
} satisfies Record<GovernanceAssessmentType, string[]>;

function buildSections(
  title: string,
  summary: string,
  detail: {
    outcomeLabel: string;
    hitRules: string[];
    pendingItems: string[];
    recommendations: string[];
  },
): ReportSection[] {
  return [
    {
      id: `${title}-overview`,
      title: '一、结论摘要',
      content: `${summary} 结论标签：${detail.outcomeLabel}。`,
    },
    {
      id: `${title}-rules`,
      title: '二、命中规则',
      content: detail.hitRules.join('；'),
    },
    {
      id: `${title}-actions`,
      title: '三、后续建议',
      content: [...detail.pendingItems, ...detail.recommendations].join('；'),
    },
  ];
}

function getRiskWeight(level: RiskLevel) {
  if (level === 'high') {
    return 3;
  }
  if (level === 'medium') {
    return 2;
  }
  return 1;
}

function getRiskLevelByScore(score: number): RiskLevel {
  if (score >= 78) {
    return 'high';
  }
  if (score >= 52) {
    return 'medium';
  }
  return 'low';
}

function getAssetRegulationIds(asset: DataAsset) {
  const ids = ['reg-cn-auto-guide-2026', 'reg-cn-gbt39335', 'reg-cn-dsl'];

  if (asset.personalInfo || asset.sensitivePersonalInfo) {
    ids.push('reg-cn-pipl');
  }

  if (asset.suspectedImportantData) {
    ids.push('reg-cn-security-assessment');
  }

  return Array.from(new Set(ids));
}

export const governanceAssetOptions = dataAssets.map((asset) => ({
  label: asset.name,
  value: asset.id,
}));

export const governanceAssetCategories = Array.from(
  new Set(dataAssets.map((asset) => asset.category)),
).sort((left, right) => left.localeCompare(right, 'zh-CN'));

export const governanceAssetDestinations = Array.from(
  new Set(dataAssets.map((asset) => asset.destination)),
).sort((left, right) => left.localeCompare(right, 'zh-CN'));

export const importantDataQuestions: QuestionnaireItem[] = [
  {
    id: 'industryImpact',
    title: '该资产是否直接影响关键业务、生产运营或行业安全？',
    options: [
      { label: '是，影响明显', value: 'yes' },
      { label: '存在一定影响', value: 'partial' },
      { label: '未发现明显影响', value: 'no' },
    ],
  },
  {
    id: 'publicInterest',
    title: '是否涉及公共利益、重要基础设施或大规模汽车运行数据？',
    options: [
      { label: '是', value: 'yes' },
      { label: '待人工复核', value: 'review' },
      { label: '否', value: 'no' },
    ],
  },
  {
    id: 'likelihood',
    title: '依据 GB/T 39335-2020 表 D.1/D.2，安全事件发生可能性属于哪一级？',
    description: '综合网络技术措施、处理流程、参与人员与第三方、业务规模及安全态势判断。',
    options: [
      { label: '很高', value: 'very-high', description: '措施严重不足，事件几乎不可避免或已收到风险警报。' },
      { label: '高', value: 'high', description: '措施存在不足，类似事件曾发生或处理范围较大。' },
      { label: '中', value: 'medium', description: '已采取基本措施，但管理和监督效果仍需验证。' },
      { label: '低', value: 'low', description: '措施有效、流程规范且相关事件尚未发生。' },
    ],
  },
  {
    id: 'rightsImpact',
    title: '依据表 D.3/D.4，对个人权益或汽车产业安全的影响程度属于哪一级？',
    options: [
      { label: '严重', value: 'severe', description: '可能产生重大、不可消除或难以克服的影响。' },
      { label: '高', value: 'high', description: '可能造成重大影响，恢复成本较高。' },
      { label: '中', value: 'medium', description: '可能造成较严重困扰，但仍可通过措施克服。' },
      { label: '低', value: 'low', description: '影响有限且可恢复。' },
    ],
  },
];

export const riskQuestions: QuestionnaireItem[] = [
  {
    id: 'recipientScope',
    title: '接收方范围如何？',
    options: [
      { label: '仅集团内部单一接收方', value: 'internal' },
      { label: '多个境外接收方', value: 'multiple' },
      { label: '外部合作方', value: 'external' },
    ],
  },
  {
    id: 'accessControl',
    title: '访问控制和最小权限措施是否完备？',
    options: [
      { label: '完备', value: 'strong' },
      { label: '部分具备', value: 'partial' },
      { label: '明显不足', value: 'weak' },
    ],
  },
  {
    id: 'monitoring',
    title: '跨境链路监测和日志审计是否可追溯？',
    options: [
      { label: '全量可追溯', value: 'full' },
      { label: '部分可追溯', value: 'partial' },
      { label: '暂未建立', value: 'none' },
    ],
  },
];

export const piaQuestions: QuestionnaireItem[] = [
  {
    id: 'transparency',
    title: '告知、同意或其他合法性基础是否清晰？',
    options: [
      { label: '清晰且留痕完整', value: 'clear' },
      { label: '部分清晰', value: 'partial' },
      { label: '存在明显缺口', value: 'weak' },
    ],
  },
  {
    id: 'rightsResponse',
    title: '数据主体权利响应机制是否到位？',
    options: [
      { label: '已建立标准流程', value: 'strong' },
      { label: '仅部分覆盖', value: 'partial' },
      { label: '待建立', value: 'weak' },
    ],
  },
  {
    id: 'necessity',
    title: '处理目的与字段范围是否满足最小必要？',
    options: [
      { label: '基本满足', value: 'strong' },
      { label: '仍需压缩字段', value: 'partial' },
      { label: '超出必要范围', value: 'weak' },
    ],
  },
];

export function getGovernanceTypeLabel(type: GovernanceAssessmentType) {
  return governanceTypeLabelMap[type];
}

export function getAssetById(id?: string) {
  return dataAssets.find((asset) => asset.id === id);
}

export function getGovernanceCitations(citationIds: string[]): CitationItem[] {
  return citationIds
    .map((id) => findRegulationById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      id: item.id,
      title: `《${item.title}》`,
      article: item.articles[0]?.title ?? '重点条款',
      summary: item.summary,
    }));
}

export function getAssetFieldList(asset: DataAsset) {
  return assetFieldCatalog[asset.category] ?? ['主键字段', '业务字段', '日志字段'];
}

export function getAssetControlMeasures(asset: DataAsset) {
  const measures = [
    `源系统 ${asset.system} 已建立字段级台账和责任人映射`,
    `跨境用途限定为 ${asset.purpose}，目的地为 ${asset.destination}`,
  ];

  if (asset.personalInfo) {
    measures.push('需保留个人信息处理合法性基础、告知或授权留痕');
  }

  if (asset.sensitivePersonalInfo) {
    measures.push('建议强化脱敏、访问审批和最小必要字段压缩');
  }

  if (asset.suspectedImportantData) {
    measures.push('建议先完成重要数据辅助识别并保留人工复核意见');
  }

  return measures;
}

export function getAssetFlowTimeline(asset: DataAsset) {
  return [
    `源系统：${asset.system}`,
    `主体类型：${asset.subjectType}`,
    `处理目的：${asset.purpose}`,
    `跨境方向：中国 -> ${asset.destination}`,
    `留存周期：${asset.retentionPeriod}`,
  ];
}

export function getAssetDetail(assetId?: string) {
  const asset = getAssetById(assetId);

  if (!asset) {
    return undefined;
  }

  const relatedAssessments = assessmentRecords
    .filter((record) => {
      const scenario = scenarios.find((item) => item.id === record.scenarioId);

      return scenario?.toCountry === asset.destination;
    })
    .slice(0, 4);

  return {
    asset,
    fields: getAssetFieldList(asset),
    controls: getAssetControlMeasures(asset),
    timeline: getAssetFlowTimeline(asset),
    relatedAssessments,
    citations: getGovernanceCitations(getAssetRegulationIds(asset)),
  };
}

export function getGovernanceOverview() {
  const highRiskAssets = dataAssets.filter((asset) => asset.riskLevel === 'high');
  const importantCandidates = dataAssets.filter((asset) => asset.suspectedImportantData);
  const personalInfoAssets = dataAssets.filter((asset) => asset.personalInfo);

  return {
    totalAssets: dataAssets.length,
    highRiskAssets: highRiskAssets.length,
    importantCandidates: importantCandidates.length,
    personalInfoAssets: personalInfoAssets.length,
  };
}

export function getClassificationSummary() {
  return ['一级', '二级', '三级'].map((level) => ({
    level,
    count: dataAssets.filter((asset) => asset.level === level).length,
    assets: dataAssets.filter((asset) => asset.level === level).slice(0, 6),
  }));
}

export function getCategoryDistribution() {
  return governanceAssetCategories.map((category) => ({
    category,
    count: dataAssets.filter((asset) => asset.category === category).length,
  }));
}

export function getHighRiskAssets(limit = 6) {
  return dataAssets
    .filter((asset) => asset.riskLevel !== 'low' || asset.suspectedImportantData)
    .slice(0, limit);
}

export function getGovernanceReports() {
  return reports
    .filter((report) => ['风险评估报告', 'PIA 报告'].includes(report.type))
    .slice(0, 4);
}

export function deriveGovernanceDetail(record: GovernanceAssessmentRecord) {
  const asset = getAssetById(record.assetId);
  const title = `${record.name}报告`;
  const detail = {
    outcomeLabel:
      record.type === 'importantData'
        ? record.riskLevel === 'high'
          ? '疑似重要数据，建议人工复核'
          : '未发现强命中特征，建议继续留痕'
        : record.type === 'risk'
          ? '风险矩阵已生成'
          : 'PIA 结论已生成',
    recommendedAction:
      record.type === 'importantData'
        ? '补充行业规则、流向边界和接收方说明'
        : record.type === 'risk'
          ? '根据评分结果安排整改优先级'
          : '补充个人信息处理合法性基础和权利响应机制',
    hitRules: [
      `资产：${asset?.name ?? record.assetId}`,
      `等级：${asset?.level ?? '待确认'}`,
      `综合分值：${record.score}`,
    ],
    pendingItems: [
      '补充业务必要性说明',
      '确认接收方保护措施与删除机制',
    ],
    recommendations: [
      '留存评估过程和人工复核意见',
      '纳入整改事项并跟踪关闭状态',
    ],
    scoreBreakdown: [
      { label: '敏感度', score: record.score },
      { label: '流向复杂度', score: Math.max(record.score - 8, 35) },
      { label: '控制成熟度', score: Math.max(record.score - 12, 28) },
    ],
  };

  return {
    recordId: record.id,
    reportName: title,
    outcomeLabel: detail.outcomeLabel,
    recommendedAction: detail.recommendedAction,
    hitRules: detail.hitRules,
    pendingItems: detail.pendingItems,
    recommendations: detail.recommendations,
    scoreBreakdown: detail.scoreBreakdown,
    sections: buildSections(title, record.summary, detail),
  } satisfies GovernanceAssessmentDetail;
}

type MatrixLevel = 'severe' | 'high' | 'medium' | 'low';

const matrixLevelLabels: Record<MatrixLevel, string> = {
  severe: '严重',
  high: '高',
  medium: '中',
  low: '低',
};

const likelihoodLabels: Record<string, string> = {
  'very-high': '很高',
  high: '高',
  medium: '中',
  low: '低',
};

const impactLabels: Record<string, string> = {
  severe: '严重',
  high: '高',
  medium: '中',
  low: '低',
};

function getGbt39335MatrixLevel(impact: string, likelihood: string): MatrixLevel {
  const matrix: Record<string, Record<string, MatrixLevel>> = {
    severe: { low: 'medium', medium: 'high', high: 'severe', 'very-high': 'severe' },
    high: { low: 'medium', medium: 'medium', high: 'high', 'very-high': 'severe' },
    medium: { low: 'low', medium: 'medium', high: 'medium', 'very-high': 'high' },
    low: { low: 'low', medium: 'low', high: 'medium', 'very-high': 'medium' },
  };

  return matrix[impact]?.[likelihood] ?? 'medium';
}

export function createImportantDataPayload(params: {
  asset: DataAsset;
  scope: string;
  notes: string;
  answers: Record<string, string | undefined>;
}) {
  const likelihood =
    params.answers.likelihood ??
    (params.asset.level === '一级' ? 'high' : params.asset.level === '二级' ? 'medium' : 'low');
  const rightsImpact =
    params.answers.rightsImpact ??
    (params.asset.level === '一级' ? 'severe' : params.asset.level === '二级' ? 'high' : 'medium');
  const matrixLevel = getGbt39335MatrixLevel(rightsImpact, likelihood);
  const matrixScore = { severe: 92, high: 78, medium: 58, low: 34 }[matrixLevel];
  const score = Math.min(
    100,
    matrixScore +
      (params.asset.suspectedImportantData ? 6 : 0) +
      (params.answers.industryImpact === 'yes' ? 4 : 0) +
      (params.answers.publicInterest === 'yes' ? 4 : 0),
  );
  const riskLevel: RiskLevel =
    matrixLevel === 'severe' || matrixLevel === 'high'
      ? 'high'
      : matrixLevel === 'medium'
        ? 'medium'
        : 'low';
  const isImportantCandidate =
    params.asset.suspectedImportantData ||
    params.asset.level === '一级' ||
    params.answers.industryImpact === 'yes' ||
    params.answers.publicInterest === 'yes';
  const hitRules = [
    `汽车数据分类分级基线：${params.asset.level} / ${params.asset.category}`,
    `处理场景：${params.asset.purpose}`,
    `GB/T 39335-2020 发生可能性：${likelihoodLabels[likelihood] ?? likelihood}`,
    `GB/T 39335-2020 影响程度：${impactLabels[rightsImpact] ?? rightsImpact}`,
    `表 D.5 矩阵结果：${matrixLevelLabels[matrixLevel]}风险`,
    `识别范围：${params.scope}`,
  ];

  if (params.asset.suspectedImportantData) {
    hitRules.push('汽车分类分级台账已标记为疑似重要数据');
  }
  if (params.answers.publicInterest === 'yes') {
    hitRules.push('涉及公共利益、重要基础设施或大规模汽车运行数据');
  }

  const summary = isImportantCandidate
    ? `该汽车数据资产命中重要数据识别线索，GB/T 39335-2020 风险矩阵结果为${matrixLevelLabels[matrixLevel]}，建议进入人工复核。`
    : `该资产当前未命中明显重要数据线索，风险矩阵结果为${matrixLevelLabels[matrixLevel]}，建议保留分类依据并定期复核。`;
  const outcomeLabel = isImportantCandidate
    ? riskLevel === 'high'
      ? '疑似重要数据 · 高优先级复核'
      : '疑似重要数据 · 待人工复核'
    : '一般汽车数据 · 持续复核';
  const recommendations = isImportantCandidate
    ? ['按汽车行业重要数据规则组织人工复核', '补充数据流向图、字段清单和境外接收方说明']
    : ['保留分类分级与矩阵判定记录', '业务场景或数据规模变化时重新识别'];
  const pendingItems = [
    '核对汽车数据出境安全指引中的量化判据',
    '确认数据规模、处理频次、去标识化和接收方边界',
  ];
  const citations = governanceRegulationIds.importantData;
  const reportName = `${params.asset.name}重要数据识别报告`;
  const completeHitRules = [
    ...hitRules,
    params.notes ? `补充说明：${params.notes}` : '补充说明：无',
  ];

  return {
    name: `${params.asset.name}重要数据识别`,
    type: 'importantData' as const,
    assetId: params.asset.id,
    riskLevel,
    score,
    summary,
    citations,
    detail: {
      reportName,
      outcomeLabel,
      recommendedAction: recommendations[0],
      hitRules: completeHitRules,
      pendingItems,
      recommendations,
      scoreBreakdown: [
        { label: '分类分级基线', score: params.asset.level === '一级' ? 92 : params.asset.level === '二级' ? 70 : 42 },
        { label: '事件发生可能性', score: { 'very-high': 96, high: 82, medium: 60, low: 32 }[likelihood] ?? 60 },
        { label: '权益与产业影响', score: { severe: 96, high: 82, medium: 60, low: 32 }[rightsImpact] ?? 60 },
      ],
      sections: buildSections(reportName, summary, {
        outcomeLabel,
        hitRules: completeHitRules,
        pendingItems,
        recommendations,
      }),
    },
  } satisfies CreatedGovernancePayload;
}

export function createRiskPayload(params: {
  asset: DataAsset;
  answers: Record<string, string | undefined>;
}) {
  const breakdown = [
    {
      label: '接收方复杂度',
      score:
        params.answers.recipientScope === 'external'
          ? 85
          : params.answers.recipientScope === 'multiple'
            ? 70
            : 42,
    },
    {
      label: '访问控制成熟度',
      score:
        params.answers.accessControl === 'weak'
          ? 82
          : params.answers.accessControl === 'partial'
            ? 63
            : 36,
    },
    {
      label: '监测与审计完备度',
      score:
        params.answers.monitoring === 'none'
          ? 84
          : params.answers.monitoring === 'partial'
            ? 60
            : 32,
    },
  ];
  const score = Math.round(
    breakdown.reduce((total, item) => total + item.score, 0) / breakdown.length +
      getRiskWeight(params.asset.riskLevel) * 6,
  );
  const riskLevel = getRiskLevelByScore(score);
  const summary =
    riskLevel === 'high'
      ? '综合评分显示当前资产处于高风险档，建议优先执行整改并限制接收方范围。'
      : riskLevel === 'medium'
        ? '综合评分处于中风险档，建议补齐访问控制、日志审计和合同约束。'
        : '综合评分处于低风险档，可继续保持现有控制并定期复评。';
  const recommendations =
    riskLevel === 'high'
      ? ['优先补齐访问控制和最小权限策略', '缩减接收方范围并增加日志审计频率']
      : riskLevel === 'medium'
        ? ['完善接收方合同义务和权限审批', '补齐审计周期与异常告警留痕']
        : ['维持现有控制并安排季度复评', '持续更新资产台账和流向说明'];
  const pendingItems = [
    '确认传输频次与批次边界',
    '确认异常事件响应与关闭机制',
  ];
  const citations = governanceRegulationIds.risk;
  const reportName = `${params.asset.name}风险评估报告`;

  return {
    name: `${params.asset.name}风险评估`,
    type: 'risk' as const,
    assetId: params.asset.id,
    riskLevel,
    score,
    summary,
    citations,
    detail: {
      reportName,
      outcomeLabel: riskLevel === 'high' ? '高风险' : riskLevel === 'medium' ? '中风险' : '低风险',
      recommendedAction: recommendations[0],
      hitRules: [
        `接收方范围：${params.answers.recipientScope ?? '未填写'}`,
        `访问控制：${params.answers.accessControl ?? '未填写'}`,
        `监测审计：${params.answers.monitoring ?? '未填写'}`,
      ],
      pendingItems,
      recommendations,
      scoreBreakdown: breakdown,
      sections: buildSections(reportName, summary, {
        outcomeLabel: riskLevel === 'high' ? '高风险' : riskLevel === 'medium' ? '中风险' : '低风险',
        hitRules: [
          `接收方范围：${params.answers.recipientScope ?? '未填写'}`,
          `访问控制：${params.answers.accessControl ?? '未填写'}`,
          `监测审计：${params.answers.monitoring ?? '未填写'}`,
        ],
        pendingItems,
        recommendations,
      }),
    },
  } satisfies CreatedGovernancePayload;
}

export function createPiaPayload(params: {
  asset: DataAsset;
  answers: Record<string, string | undefined>;
  processingPurpose: string;
}) {
  const breakdown = [
    {
      label: '透明度与合法性基础',
      score:
        params.answers.transparency === 'weak'
          ? 84
          : params.answers.transparency === 'partial'
            ? 62
            : 34,
    },
    {
      label: '权利响应机制',
      score:
        params.answers.rightsResponse === 'weak'
          ? 80
          : params.answers.rightsResponse === 'partial'
            ? 61
            : 36,
    },
    {
      label: '最小必要性',
      score:
        params.answers.necessity === 'weak'
          ? 86
          : params.answers.necessity === 'partial'
            ? 65
            : 38,
    },
  ];
  const score = Math.round(
    breakdown.reduce((total, item) => total + item.score, 0) / breakdown.length +
      (params.asset.sensitivePersonalInfo ? 8 : 0),
  );
  const riskLevel = getRiskLevelByScore(score);
  const summary =
    riskLevel === 'high'
      ? 'PIA 结果显示高影响风险，建议补齐告知留痕、权利响应和字段压缩措施后再继续流转。'
      : riskLevel === 'medium'
        ? 'PIA 结果显示存在中等影响风险，建议优先完善透明度说明和权利响应流程。'
        : 'PIA 结果整体可控，建议维持当前控制并定期更新处理说明。';
  const recommendations =
    riskLevel === 'high'
      ? ['补齐合法性基础说明和留痕材料', '压缩字段范围并更新权利响应机制']
      : ['完善透明度说明和告知文案', '保留必要性分析和字段最小化依据'];
  const pendingItems = [
    '确认告知或其他合法性基础留痕',
    '确认数据主体权利响应 SLA 与责任人',
  ];
  const citations = governanceRegulationIds.pia;
  const reportName = `${params.asset.name}PIA 报告`;

  return {
    name: `${params.asset.name}PIA`,
    type: 'pia' as const,
    assetId: params.asset.id,
    riskLevel,
    score,
    summary,
    citations,
    detail: {
      reportName,
      outcomeLabel: riskLevel === 'high' ? '高影响' : riskLevel === 'medium' ? '中影响' : '低影响',
      recommendedAction: recommendations[0],
      hitRules: [
        `处理目的：${params.processingPurpose}`,
        `透明度：${params.answers.transparency ?? '未填写'}`,
        `权利响应：${params.answers.rightsResponse ?? '未填写'}`,
        `最小必要：${params.answers.necessity ?? '未填写'}`,
      ],
      pendingItems,
      recommendations,
      scoreBreakdown: breakdown,
      sections: [
        {
          id: `${reportName}-overview`,
          title: '一、处理目的与范围',
          content: `本次评估对象为 ${params.asset.name}，处理目的为 ${params.processingPurpose}。`,
        },
        {
          id: `${reportName}-impact`,
          title: '二、影响评估结论',
          content: summary,
        },
        {
          id: `${reportName}-recommendations`,
          title: '三、待补充措施',
          content: [...pendingItems, ...recommendations].join('；'),
        },
      ],
    },
  } satisfies CreatedGovernancePayload;
}

export function buildRectificationItems(
  records: GovernanceAssessmentRecord[],
  statusMap: Record<string, BusinessStatus>,
) {
  const assetTasks: GovernanceRectificationItem[] = dataAssets
    .filter((asset) => asset.riskLevel !== 'low' || asset.suspectedImportantData)
    .slice(0, 12)
    .map((asset, index) => {
      const id = `rectify-asset-${asset.id}`;
      const baseStatus = asset.riskLevel === 'high' ? 'pending' : 'review';

      return {
        id,
        title: `复核 ${asset.name} 的跨境控制措施`,
        source: 'asset',
        sourceLabel: '资产台账',
        assetId: asset.id,
        owner: ownerMap[asset.category] ?? '数据治理办公室',
        dueDate: dayjs().add(index + 3, 'day').format('YYYY-MM-DD'),
        riskLevel: asset.riskLevel,
        status: statusMap[id] ?? baseStatus,
        suggestion: asset.suspectedImportantData
          ? '优先完成重要数据辅助识别并保留人工复核结论。'
          : '补齐访问控制、留存周期和接收方说明。',
        summary: `${asset.system} 中的 ${asset.category} 数据将流向 ${asset.destination}，需复核控制措施。`,
      };
    });

  const recordTasks: GovernanceRectificationItem[] = records
    .filter((record) => record.riskLevel !== 'low')
    .map((record, index) => {
      const asset = getAssetById(record.assetId);
      const id = `rectify-record-${record.id}`;

      return {
        id,
        title: `${getGovernanceTypeLabel(record.type)}结果跟进：${record.name}`,
        source: 'assessment',
        sourceLabel: getGovernanceTypeLabel(record.type),
        assetId: record.assetId,
        owner: ownerMap[asset?.category ?? ''] ?? '数据治理办公室',
        dueDate: dayjs(record.updatedAt).add(index + 2, 'day').format('YYYY-MM-DD'),
        riskLevel: record.riskLevel,
        status: statusMap[id] ?? (record.riskLevel === 'high' ? 'pending' : 'review'),
        suggestion:
          record.type === 'pia'
            ? '补齐合法性基础、透明度说明和权利响应机制。'
            : record.type === 'risk'
              ? '优先关闭高风险评分项并安排复评。'
              : '完善行业背景与流向证据，形成复核意见。',
        summary: record.summary,
      };
    });

  return [...recordTasks, ...assetTasks].sort((left, right) => {
    const riskDiff = getRiskWeight(right.riskLevel) - getRiskWeight(left.riskLevel);

    if (riskDiff !== 0) {
      return riskDiff;
    }

    return right.dueDate.localeCompare(left.dueDate);
  });
}

export function getGovernanceActivityEntries(records: GovernanceAssessmentRecord[]) {
  return records.slice(0, 5).map((record) => ({
    id: record.id,
    title: `${getGovernanceTypeLabel(record.type)}已生成`,
    time: record.updatedAt,
    operator: '平台工作区',
    status: 'completed' as const,
  }));
}

export function getRelatedMockReports(assetId?: string): Report[] {
  const asset = getAssetById(assetId);

  if (!asset) {
    return [];
  }

  return reports
    .filter((report) =>
      report.summary.includes(asset.destination) ||
      report.summary.includes(asset.category) ||
      ['风险评估报告', 'PIA 报告'].includes(report.type),
    )
    .slice(0, 3);
}

export function getRelatedGlobalAssessments(assetId?: string): AssessmentRecord[] {
  const asset = getAssetById(assetId);

  if (!asset) {
    return [];
  }

  return assessmentRecords.filter((record) => {
    const scenario = scenarios.find((item) => item.id === record.scenarioId);

    return scenario?.toCountry === asset.destination || ['risk', 'pia'].includes(record.type);
  });
}
