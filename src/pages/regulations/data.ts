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
    coverage: '汽车生产制造、零部件质量与供应链协同',
    scenarioData: '未细分',
    mechanism: '以汽车制造数据分类分级为基础，展示区域清单适用方式',
  },
  {
    id: 'pilot-beijing-2024',
    publishDate: '2024.08.30',
    region: '北京',
    coverage: '汽车研发设计、自动驾驶、车联网与 OTA 软件升级',
    scenarioData: '23个业务场景，198个数据项',
    mechanism: '采用字段级清单展示汽车数据场景与适用阈值',
  },
  {
    id: 'pilot-shanghai-2025',
    publishDate: '2025.02.08',
    region: '上海',
    coverage: '整车研发、供应链协同与零部件质量追溯',
    scenarioData: '6个业务场景，84个数据项',
    mechanism: '按汽车业务场景细化数据边界与重要数据识别线索',
  },
  {
    id: 'pilot-hainan-2025',
    publishDate: '2025.02.20',
    region: '海南',
    coverage: '智能驾驶道路测试、环境感知与车辆运行数据',
    scenarioData: '14个业务场景，88个数据项',
    mechanism: '聚焦道路测试和智能驾驶研发数据的区域协同',
  },
  {
    id: 'pilot-zhejiang-2025',
    publishDate: '2025.04.10',
    region: '浙江',
    coverage: '汽车供应链平台、零部件协同与质量数据',
    scenarioData: '8个业务场景，134个数据项',
    mechanism: '按供应链角色和数据规模展示精细化管理方式',
  },
  {
    id: 'pilot-guangxi-2025',
    publishDate: '2025.08.08',
    region: '广西',
    coverage: '跨境道路测试、车辆地理信息与东盟研发协同',
    scenarioData: '4个行业领域',
    mechanism: '面向中国—东盟汽车研发协同展示区域便利化机制',
  },
  {
    id: 'pilot-jiangsu-2025',
    publishDate: '2025.08.13',
    region: '江苏',
    coverage: '汽车零部件研发、生产制造与质量追溯',
    scenarioData: '21个业务场景',
    mechanism: '细化汽车零部件和制造数据的重要数据识别',
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
    coverage: '车联网运行、OTA 软件升级与售后诊断',
    scenarioData: '26个业务应用场景、298个数据项',
    mechanism: '完善车联网、升级日志和远程诊断数据类型描述',
  },
  {
    id: 'pilot-shanghai-2026',
    publishDate: '2026.04.24',
    region: '上海',
    coverage: '汽车研发设计、生产制造、供应链与车联网运行',
    scenarioData: '9个具体场景、109个数据项、29个数据子类',
    mechanism: '面向上海汽车产业链展示清单备案与跨区域适用机制',
  },
  {
    id: 'pilot-beijing-2026',
    publishDate: '2026.05.11',
    region: '北京',
    coverage: '汽车研发设计、智能驾驶、车联网、OTA 软件升级与售后质量',
    scenarioData: '67个业务场景，612个字段',
    mechanism: '覆盖汽车全生命周期场景，建立字段清单与跨区域应用机制',
  },
  {
    id: 'pilot-guangdong-2026',
    publishDate: '2026.05.15',
    region: '广东',
    coverage: '智能汽车装备制造、零部件协同与研发测试',
    scenarioData: '7个业务应用场景，67个数据项',
    mechanism: '面向汽车装备与研发协同展示先研判、后报送机制',
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
