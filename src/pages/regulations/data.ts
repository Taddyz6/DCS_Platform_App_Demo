import {
  countryProfiles,
  findRegulationById,
  latestRegulations,
  regulationCountries,
  regulationIndustries,
  regulationLevels,
  regulations,
  regulationTopics,
} from '@/mock';

export {
  countryProfiles,
  findRegulationById,
  latestRegulations,
  regulationCountries,
  regulationIndustries,
  regulationLevels,
  regulations,
  regulationTopics,
};

export const domesticRegulations = regulations.filter((item) => item.country === '中国');

export const domesticLatestRegulations = domesticRegulations
  .slice()
  .sort((left, right) => right.publishDate.localeCompare(left.publishDate));

export const domesticRegulationTopics = [
  '国家层面法规',
  '地方/自贸区负面清单',
  '汽车研发数据',
  '自动驾驶',
  '联网运行',
  'OTA',
  '重要数据识别',
  '标准合同',
  '安全评估',
];

export const domesticCoreRegulations = [
  {
    id: 'reg-cn-security-assessment',
    title: '数据出境安全评估办法',
    publishDate: '2022-07-07',
    level: '部门规章',
    authority: '国家互联网信息办公室',
    summary: '明确重要数据和特定规模个人信息出境时的安全评估适用条件、申报路径和材料要求。',
  },
  {
    id: 'reg-cn-standard-contract',
    title: '个人信息出境标准合同办法',
    publishDate: '2023-02-24',
    level: '部门规章',
    authority: '国家互联网信息办公室',
    summary: '确立标准合同备案路径，适用于符合条件的个人信息出境活动。',
  },
  {
    id: 'reg-cn-data-flow',
    title: '促进和规范数据跨境流动规定',
    publishDate: '2024-03-22',
    level: '部门规章',
    authority: '国家互联网信息办公室',
    summary: '优化安全评估、标准合同和认证制度衔接，明确多类豁免与便利化安排。',
  },
  {
    id: 'reg-cn-auto-guide-2026',
    title: '汽车数据出境安全指引（2026版）',
    publishDate: '2026-02-03',
    level: '规范性文件',
    authority: '工业和信息化部等八部门',
    summary: '细化汽车行业重要数据跨境管理要求，明确研发设计、驾驶自动化、联网运行、OTA 等场景下的重要数据识别与管理要求。',
  },
];

export const domesticPilotListRows = [
  {
    id: 'pilot-tianjin-2024',
    publishDate: '2024.05.09',
    region: '天津',
    coverage: '工业、金融等13大类，包含45个子类',
    scenarioData: '未细分',
    mechanism: '覆盖范围广，是全行业基础框架',
  },
  {
    id: 'pilot-beijing-2024',
    publishDate: '2024.08.30',
    region: '北京',
    coverage: '汽车、医药、民航、零售与现代服务、人工智能',
    scenarioData: '23个业务场景，198个数据项',
    mechanism: '字段级清单，部分合规阈值放宽',
  },
  {
    id: 'pilot-shanghai-2025',
    publishDate: '2025.02.08',
    region: '上海',
    coverage: '再保险、国际航运、商贸（零售与餐饮业、住宿业）',
    scenarioData: '6个业务场景，84个数据项',
    mechanism: '明确场景定义，细化重要数据认定规则',
  },
  {
    id: 'pilot-hainan-2025',
    publishDate: '2025.02.20',
    region: '海南',
    coverage: '深海、航天、种业、旅游、免税商品零售业务',
    scenarioData: '14个业务场景，88个数据项',
    mechanism: '聚焦地方特色产业',
  },
  {
    id: 'pilot-zhejiang-2025',
    publishDate: '2025.04.10',
    region: '浙江',
    coverage: '电子商务（B2B）、清结算',
    scenarioData: '8个业务场景，134个数据项',
    mechanism: '对不同行业和场景的个人信息量级进行精确量化',
  },
  {
    id: 'pilot-guangxi-2025',
    publishDate: '2025.08.08',
    region: '广西',
    coverage: '地理信息与气象数据服务、企业信用信息服务、直播跨境电商、海外音视频制作与传播',
    scenarioData: '4个行业领域',
    mechanism: '定位有特色，服务中国-东盟跨境',
  },
  {
    id: 'pilot-jiangsu-2025',
    publishDate: '2025.08.13',
    region: '江苏',
    coverage: '医药',
    scenarioData: '21个业务场景',
    mechanism: '细化医药行业重要数据识别',
  },
  {
    id: 'pilot-chongqing-2025',
    publishDate: '2025.09.05',
    region: '重庆',
    coverage: '智能网联汽车',
    scenarioData: '4个业务活动、9个业务场景、110个数据项',
    mechanism: '细化智能网联汽车重要数据识别',
  },
  {
    id: 'pilot-fujian-2025',
    publishDate: '2025.12.25',
    region: '福建',
    coverage: '医药、车联网、零售、航空维修',
    scenarioData: '26个业务应用场景、298个数据项',
    mechanism: '进一步完善相关数据类型和描述',
  },
  {
    id: 'pilot-shanghai-2026',
    publishDate: '2026.04.24',
    region: '上海',
    coverage: '再保险、国际航运、商贸、气象',
    scenarioData: '9个具体场景、109个数据项、29个数据子类',
    mechanism: '适用范围扩至上海全市域，可参照执行其他省市正式备案清单，清单外数据可通过备案方式开展出境活动',
  },
  {
    id: 'pilot-beijing-2026',
    publishDate: '2026.05.11',
    region: '北京',
    coverage: '汽车、医药、民航、零售与现代服务、人工智能训练数据、医疗器械、自动驾驶、贸易物流、银行等9个行业领域',
    scenarioData: '67个业务场景，612个字段',
    mechanism: '适用范围扩至北京市域，建立外省市负面清单应用机制，清单外数据可通过备案方式开展出境活动',
  },
  {
    id: 'pilot-guangdong-2026',
    publishDate: '2026.05.15',
    region: '广东',
    coverage: '智能装备制造、个人征信服务',
    scenarioData: '7个业务应用场景，67个数据项',
    mechanism: '适用于广东自贸试验区和河套深圳园区，支持企业先研判再用负面清单，事后报送',
  },
];

export const regulationStatusLabels = {
  effective: '已生效',
  draft: '草案',
  expired: '已失效',
};

export const qaSuggestedQuestions = [
  '汽车研发数据出境时为什么要先识别重要数据？',
  '汽车企业在适用负面清单时应重点关注哪些场景和数据项？',
  '《促进和规范数据跨境流动规定》对豁免情形有哪些直接影响？',
  '标准合同与安全评估路径如何区分？',
];

export const compareTopicOptions = [
  '跨境传输机制',
  '数据本地化要求',
  '重点监管机构',
  '高风险关注点',
];

export const getCountryProfileByName = (name?: string) =>
  countryProfiles.find((item) => item.name === name);

export const getRelatedRegulations = (ids: string[]) =>
  ids
    .map((id) => findRegulationById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
