import type { CountryProfile } from '@/types/domain';

export const countryProfiles: CountryProfile[] = [
  {
    id: 'country-cn',
    name: '中国',
    region: '亚太',
    regulatoryAuthorities: ['国家互联网信息办公室', '工业和信息化部'],
    crossBorderMechanisms: ['安全评估', '标准合同', '个人信息保护认证'],
    localizationRequirements: ['重要数据需重点识别', '关键信息基础设施运营者需重点审查'],
    keyRisks: ['申报条件误判', '出境场景界定不清', '材料准备不完整'],
    faqs: [
      {
        question: '何时需要启动安全评估？',
        answer: '当命中重要数据、特定规模个人信息或其他法定场景时，应优先考虑安全评估路径。',
      },
      {
        question: '标准合同是否可以替代全部场景？',
        answer: '不可以，标准合同适用范围有限，需先判断是否落入安全评估或其他路径。',
      },
    ],
    keyRegulationIds: ['reg-cn-pipl', 'reg-cn-dsl', 'reg-cn-security-assessment'],
  },
  {
    id: 'country-eu',
    name: '欧盟',
    region: '欧洲',
    regulatoryAuthorities: ['European Data Protection Board', 'European Commission'],
    crossBorderMechanisms: ['Adequacy Decision', 'Standard Contractual Clauses', 'Binding Corporate Rules'],
    localizationRequirements: ['无普遍本地化义务', '重点关注合法性、透明度和数据主体权利'],
    keyRisks: ['传输工具选择错误', '附加措施不足', '行业规则理解偏差'],
    faqs: [
      {
        question: 'SCC 是否适用于全部企业场景？',
        answer: 'SCC 常见但并非唯一工具，还需结合目的地国家风险和附加措施评估。',
      },
      {
        question: '欧盟对工业数据是否也有额外要求？',
        answer: '是，Data Act 和 Data Governance Act 会影响部分工业和平台数据共享安排。',
      },
    ],
    keyRegulationIds: ['reg-eu-gdpr', 'reg-eu-data-act', 'reg-eu-data-governance'],
  },
  {
    id: 'country-de',
    name: '德国',
    region: '欧洲',
    regulatoryAuthorities: ['Federal Commissioner for Data Protection', '州级数据保护机构'],
    crossBorderMechanisms: ['GDPR 工具体系', '行业协议安排'],
    localizationRequirements: ['重点关注雇员数据', '重点关注工业和汽车数据治理边界'],
    keyRisks: ['雇员数据处理依据不足', '工业数据边界定义模糊'],
    faqs: [
      {
        question: '雇员数据是否有特殊要求？',
        answer: '德国对雇员数据处理较为敏感，需特别说明目的、必要性和安全措施。',
      },
      {
        question: '汽车行业有哪些高关注点？',
        answer: '车辆位置、驾驶行为和研发数据都可能触发更高等级审查。',
      },
    ],
    keyRegulationIds: ['reg-de-bdsg', 'reg-de-telemedia', 'reg-eu-gdpr'],
  },
  {
    id: 'country-sg',
    name: '新加坡',
    region: '亚太',
    regulatoryAuthorities: ['Personal Data Protection Commission', 'Infocomm Media Development Authority'],
    crossBorderMechanisms: ['合同措施', '可比保护标准', '行业框架'],
    localizationRequirements: ['更强调责任可证明', '特定行业受网络安全法影响'],
    keyRisks: ['接收方责任说明不足', '合同条款描述不完整'],
    faqs: [
      {
        question: '是否必须采用特定模板合同？',
        answer: '不是，但需证明接收方能够提供可比保护水平。',
      },
      {
        question: '是否需要同步关注网络安全要求？',
        answer: '在关键信息基础设施或高敏感系统场景中需要同步考虑。',
      },
    ],
    keyRegulationIds: ['reg-sg-pdpa', 'reg-sg-cybersecurity', 'reg-sg-trust'],
  },
  {
    id: 'country-jp',
    name: '日本',
    region: '亚太',
    regulatoryAuthorities: ['Personal Information Protection Commission'],
    crossBorderMechanisms: ['告知并取得同意', '符合例外条件的第三方提供'],
    localizationRequirements: ['重点关注第三方提供披露义务', '需要明确接收方信息和保护措施'],
    keyRisks: ['告知内容不完整', '同意证据留存不足'],
    faqs: [
      {
        question: '是否必须取得单独同意？',
        answer: '取决于具体场景和法定例外，但一般需要清晰披露境外接收方和保护情况。',
      },
      {
        question: '是否需要披露接收国信息？',
        answer: '通常需要向数据主体披露相关信息和可获得的保护安排。',
      },
    ],
    keyRegulationIds: ['reg-jp-apppi', 'reg-jp-apppi-guideline'],
  },
  {
    id: 'country-hk',
    name: '中国香港',
    region: '亚太',
    regulatoryAuthorities: ['个人资料私隐专员公署'],
    crossBorderMechanisms: ['合同安排', '内部治理措施'],
    localizationRequirements: ['重点关注资料使用目的变更', '强调安全和通知责任'],
    keyRisks: ['服务数据用途扩张', '隐私通知描述不足'],
    faqs: [
      {
        question: '中国香港是否有专门出境制度？',
        answer: '可通过合同和内部治理安排控制风险，重点关注个人资料私隐原则。',
      },
      {
        question: '客户服务数据有哪些常见风险？',
        answer: '身份识别信息、沟通记录和服务偏好都需要明确处理目的和授权边界。',
      },
    ],
    keyRegulationIds: ['reg-hk-pdpo', 'reg-hk-cyber'],
  },
  {
    id: 'country-mn',
    name: '蒙古',
    region: '亚太',
    regulatoryAuthorities: ['State Great Khural', '相关监管机关'],
    crossBorderMechanisms: ['合同约束', '数据保护承诺'],
    localizationRequirements: ['监管资料较分散', '更依赖个案审查和内部控制'],
    keyRisks: ['法规资料分散', '接收国保护说明不足'],
    faqs: [
      {
        question: '是否存在统一的跨境机制？',
        answer: '实践上更依赖合同和内部安全控制，需要逐项说明保护措施。',
      },
      {
        question: '工业数据有哪些注意点？',
        answer: '应明确设备数据是否包含可识别信息以及是否涉及基础设施安全。',
      },
    ],
    keyRegulationIds: ['reg-mn-data-privacy', 'reg-mn-cybersecurity'],
  },
];
