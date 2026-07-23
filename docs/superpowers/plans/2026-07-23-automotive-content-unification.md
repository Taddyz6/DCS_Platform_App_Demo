# 汽车全生命周期内容统一 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将所有页面中的演示数据与行业案例统一为汽车研发、设计、测试、制造、车联网、OTA 升级和售后质量场景。

**Architecture:** 保持现有 React 页面、路由、TypeScript 类型和交互逻辑不变，在数据源层先统一 `src/mock` 与模块 `data.ts`，再修正页面硬编码提示和演示文档。对历史评估只引用 `src/mock/scenarios.ts` 中现存的五个汽车场景 ID，避免跨模块详情与搜索断链。

**Tech Stack:** React 19、TypeScript 5.8、Vite 7、Electron 37、Ant Design 5、本地 mock 数据。

## Global Constraints

- 一级内容范围固定为：整车研发设计、道路测试与智能驾驶、生产制造与供应链、车联网运行、OTA 软件升级、售后诊断与质量改进。
- 所有用户可见示例不得出现医疗、医药、医院、患者、病例、临床、药品、医疗器械及对应英文变体。
- 所有用户可见行业示例不得出现互联网、金融、零售、民航等独立行业案例。
- “国家互联网信息办公室”是监管机构专名，必须保留；“远程诊断”和“节点健康”是汽车与系统运维术语，必须保留。
- 不改变页面信息架构、路由、主要交互、后端边界或视觉样式。

---

### Task 1: 统一法规智库的行业标签与地方清单示例

**Files:**
- Modify: `src/mock/regulations.ts`
- Modify: `src/pages/regulations/data.ts`
- Modify: `src/pages/regulations/RegulationsLibraryPage.tsx`
- Modify: `src/pages/regulations/RegulationsHomePage.tsx`

**Interfaces:**
- Consumes: `Regulation.industries: string[]`、`domesticPilotListRows`、`regulationIndustries`。
- Produces: 只包含汽车全生命周期分类的法规筛选项、地方清单展示和法规首页说明。

- [ ] **Step 1: 运行法规内容失败检查，记录现有非汽车行业命中**

Run:

```bash
rg -n '医疗|医药|医疗器械|互联网|金融|零售|民航|航空维修|服务业|政务|公共服务|通信|再保险|航运|商贸|旅游|种业|深海|征信|电子商务' src/mock/regulations.ts src/pages/regulations/data.ts src/pages/regulations/RegulationsLibraryPage.tsx src/pages/regulations/RegulationsHomePage.tsx
```

Expected: FAIL for the desired state; output includes non-automotive `industries` values, 11 local pilot coverage rows, the library coverage description and the local-list module description. Regulator-name hits for `国家互联网信息办公室` are expected and must not be edited.

- [ ] **Step 2: 将法规行业标签改为汽车全生命周期标签**

In `src/mock/regulations.ts`, leave regulation IDs, titles, authorities, dates, topics and summaries intact, and replace each `industries` array in order with the following exact values:

```ts
// reg-cn-pipl
industries: ['汽车', '汽车研发', '车联网'],
// reg-cn-dsl
industries: ['汽车', '工业制造', '汽车供应链'],
// reg-cn-security-assessment
industries: ['汽车', '汽车研发', '车联网'],
// reg-cn-standard-contract
industries: ['汽车', '汽车研发', '售后服务'],
// reg-cn-data-flow
industries: ['汽车', '工业制造', 'OTA 软件升级'],
// reg-cn-network-data
industries: ['车联网', '汽车制造'],
// reg-cn-auto-guide-2026
industries: ['汽车'],
// reg-cn-gbt39335
industries: ['汽车', '工业制造'],
// reg-eu-gdpr
industries: ['汽车', '汽车研发', '车联网'],
// reg-eu-data-act
industries: ['工业制造', '汽车'],
// reg-eu-data-governance
industries: ['汽车供应链', '工业制造'],
// reg-de-bdsg
industries: ['汽车', '汽车制造', '汽车供应链'],
// reg-de-telemedia
industries: ['车联网', 'OTA 软件升级'],
// reg-sg-pdpa
industries: ['汽车', '道路测试', '汽车研发'],
// reg-sg-cybersecurity
industries: ['车联网', '汽车制造', '工业制造'],
// reg-jp-apppi
industries: ['汽车', 'OTA 软件升级', '汽车制造'],
// reg-jp-apppi-guideline
industries: ['汽车', '售后服务'],
// reg-hk-pdpo
industries: ['汽车', '智能驾驶', '车联网'],
// reg-hk-cyber
industries: ['车联网', '智能驾驶', 'OTA 软件升级'],
// reg-mn-data-privacy
industries: ['汽车', '汽车供应链'],
// reg-mn-cybersecurity
industries: ['汽车制造', '工业制造'],
// reg-eu-ai-act
industries: ['汽车', '智能驾驶', '汽车研发'],
// reg-sg-trust
industries: ['智能驾驶', '汽车研发', '车联网'],
```

- [ ] **Step 3: 重写地方负面清单的覆盖范围与机制描述**

In `src/pages/regulations/data.ts`, preserve every row's `id`, `publishDate`, `region` and `scenarioData`, but replace `coverage` and `mechanism` with the following exact values:

```ts
const automotivePilotCopy = {
  'pilot-tianjin-2024': {
    coverage: '汽车生产制造、零部件质量与供应链协同',
    mechanism: '以汽车制造数据分类分级为基础，展示区域清单适用方式',
  },
  'pilot-beijing-2024': {
    coverage: '汽车研发设计、自动驾驶、车联网与 OTA 软件升级',
    mechanism: '采用字段级清单展示汽车数据场景与适用阈值',
  },
  'pilot-shanghai-2025': {
    coverage: '整车研发、供应链协同与零部件质量追溯',
    mechanism: '按汽车业务场景细化数据边界与重要数据识别线索',
  },
  'pilot-hainan-2025': {
    coverage: '智能驾驶道路测试、环境感知与车辆运行数据',
    mechanism: '聚焦道路测试和智能驾驶研发数据的区域协同',
  },
  'pilot-zhejiang-2025': {
    coverage: '汽车供应链平台、零部件协同与质量数据',
    mechanism: '按供应链角色和数据规模展示精细化管理方式',
  },
  'pilot-guangxi-2025': {
    coverage: '跨境道路测试、车辆地理信息与东盟研发协同',
    mechanism: '面向中国—东盟汽车研发协同展示区域便利化机制',
  },
  'pilot-jiangsu-2025': {
    coverage: '汽车零部件研发、生产制造与质量追溯',
    mechanism: '细化汽车零部件和制造数据的重要数据识别',
  },
  'pilot-chongqing-2025': {
    coverage: '智能网联汽车',
    mechanism: '细化智能网联汽车重要数据识别',
  },
  'pilot-fujian-2025': {
    coverage: '车联网运行、OTA 软件升级与售后诊断',
    mechanism: '完善车联网、升级日志和远程诊断数据类型描述',
  },
  'pilot-shanghai-2026': {
    coverage: '汽车研发设计、生产制造、供应链与车联网运行',
    mechanism: '面向上海汽车产业链展示清单备案与跨区域适用机制',
  },
  'pilot-beijing-2026': {
    coverage: '汽车研发设计、智能驾驶、车联网、OTA 软件升级与售后质量',
    mechanism: '覆盖汽车全生命周期场景，建立字段清单与跨区域应用机制',
  },
  'pilot-guangdong-2026': {
    coverage: '智能汽车装备制造、零部件协同与研发测试',
    mechanism: '面向汽车装备与研发协同展示先研判、后报送机制',
  },
} as const;
```

Apply each object entry directly to its matching existing row; do not introduce the temporary `automotivePilotCopy` constant into production code.

- [ ] **Step 4: 更新法规页面硬编码说明**

Use these exact replacements:

```tsx
// RegulationsLibraryPage.tsx
description="包含汽车研发、工业制造、智能驾驶、车联网和 OTA 等重点领域。"

// RegulationsHomePage.tsx
description="围绕各地汽车产业与自贸区试点，展示研发、制造、车联网和软件升级相关的数据出境负面清单。"
```

- [ ] **Step 5: 验证法规模块内容与类型**

Run:

```bash
rg -n '医疗|医药|医疗器械|金融|零售|民航|航空维修|服务业|政务|公共服务|再保险|航运|商贸|旅游|种业|深海|征信|电子商务' src/mock/regulations.ts src/pages/regulations/data.ts src/pages/regulations/RegulationsLibraryPage.tsx src/pages/regulations/RegulationsHomePage.tsx
npm run typecheck:web
```

Expected: first command returns no matches; second command exits 0. `国家互联网信息办公室` remains present as an authority.

- [ ] **Step 6: Commit**

```bash
git add src/mock/regulations.ts src/pages/regulations/data.ts src/pages/regulations/RegulationsLibraryPage.tsx src/pages/regulations/RegulationsHomePage.tsx
git commit -m "content: align regulation examples with automotive data"
```

### Task 2: 统一合规研判、国家画像与表单示例

**Files:**
- Modify: `src/mock/assessments.ts`
- Modify: `src/pages/regulations/RegulationsQAPage.tsx`
- Modify: `src/mock/countries.ts`
- Modify: `src/pages/assessment/AssessmentPrecheckPage.tsx`
- Modify: `src/pages/governance/GovernancePiaPage.tsx`
- Modify: `演示操作说明.md`

**Interfaces:**
- Consumes: `scenarios` 中的 `scenario-auto-de`、`scenario-auto-test-sg`、`scenario-auto-driving-hk`、`scenario-auto-connected-eu`、`scenario-auto-ota-jp`。
- Produces: 每条 `AssessmentRecord.scenarioId` 都能解析到现存汽车场景；问答、画像、输入提示和演示脚本使用汽车语义。

- [ ] **Step 1: 运行历史记录关联失败检查**

Run:

```bash
rg -n 'scenario-hr-sg|scenario-service-hk|scenario-clinical-global|scenario-iot-jp|员工|人力|客服|客户服务|临床|科研合作|工业设备日志' src/mock/assessments.ts src/pages/regulations/RegulationsQAPage.tsx src/mock/countries.ts src/pages/assessment/AssessmentPrecheckPage.tsx src/pages/governance/GovernancePiaPage.tsx 演示操作说明.md
```

Expected: FAIL for the desired state; output includes four missing scenario IDs and non-automotive copy.

- [ ] **Step 2: 重写历史评估记录并修复场景引用**

Keep record IDs, types, statuses, risk levels, citations and timestamps unchanged. For `assessment-1` keep current content. For `assessment-2` through `assessment-10`, replace `name`, `scenarioId` and `resultSummary` exactly as follows:

```ts
const assessmentAutomotiveCopy = {
  'assessment-2': ['道路测试数据标准合同路径研判', 'scenario-auto-test-sg', '建议评估标准合同路径，并补充测试数据最小化和接收方管理措施说明。'],
  'assessment-3': ['智能驾驶数据清单识别', 'scenario-auto-driving-hk', '未发现直接适用豁免条件，需完善感知数据用途和必要性说明。'],
  'assessment-4': ['车联网运行数据风险评估', 'scenario-auto-connected-eu', '涉及持续高频车辆运行数据，建议强化访问控制、数据最小化和异常监测。'],
  'assessment-5': ['OTA 升级日志 PIA', 'scenario-auto-ota-jp', '需进一步确认升级日志中车辆标识、故障码和运维账号的处理边界。'],
  'assessment-6': ['整车研发设计数据路径草稿', 'scenario-auto-de', '草稿已保存，待补充德国研发中心的访问权限与保护能力说明。'],
  'assessment-7': ['亚太道路测试场景预检草稿', 'scenario-auto-test-sg', '待补充道路测试数据精度、采集范围和保存期限。'],
  'assessment-8': ['香港智能驾驶场景风险评估', 'scenario-auto-driving-hk', '建议补充感知数据最小必要字段清单和境外研发访问矩阵。'],
  'assessment-9': ['欧盟车联网运行清单识别', 'scenario-auto-connected-eu', '未命中便利化政策，需按高频车辆运行数据场景继续评估。'],
  'assessment-10': ['日本 OTA 运维场景路径研判', 'scenario-auto-ota-jp', '建议先完成升级数据分类分级，再通过集团内控制度约束接收方。'],
} as const;
```

Apply values directly to the existing records; do not add the temporary constant.

- [ ] **Step 3: 更新法规问答、国家画像和输入提示**

Use these exact replacements:

```tsx
// RegulationsQAPage.tsx
if (normalized.includes('新加坡') || normalized.includes('道路测试')) {
  // Keep the existing profile and regulation lookup.
  // Replace answer content with:
  content:
    '道路测试数据出境通常需要先识别车辆轨迹、环境感知和驾驶员相关信息的属性，再说明新加坡研发中心的保护水平、合同安排和内部责任边界。对于中国出境方，还应判断是否适用安全评估或标准合同路径。',
}

// mock/countries.ts, country-hk FAQ
question: '车辆售后服务数据有哪些常见风险？',
answer: '车辆标识、故障记录、维修工单和用户联络信息需要明确处理目的、访问范围和授权边界。',

// AssessmentPrecheckPage.tsx
placeholder="例如：用于整车研发协同、道路测试分析、OTA 全球运维或供应链质量改进。"

// GovernancePiaPage.tsx
placeholder="例如：联合研发、道路测试分析、OTA 运维监测或零部件质量协同。"

// 演示操作说明.md
- 搜索关键词，例如：`德国`、`标准合同`、`OTA`、`风险评估`。
```

- [ ] **Step 4: 验证历史记录引用与内容**

Run:

```bash
rg -n 'scenario-hr-sg|scenario-service-hk|scenario-clinical-global|scenario-iot-jp|员工|人力|客服|临床|科研合作|工业设备日志' src/mock/assessments.ts src/pages/regulations/RegulationsQAPage.tsx src/mock/countries.ts src/pages/assessment/AssessmentPrecheckPage.tsx src/pages/governance/GovernancePiaPage.tsx 演示操作说明.md
npm run typecheck:web
```

Expected: first command returns no matches; second command exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/mock/assessments.ts src/pages/regulations/RegulationsQAPage.tsx src/mock/countries.ts src/pages/assessment/AssessmentPrecheckPage.tsx src/pages/governance/GovernancePiaPage.tsx 演示操作说明.md
git commit -m "content: unify assessment examples around vehicle lifecycle"
```

### Task 3: 重写服务机构与培训课程示例

**Files:**
- Modify: `src/mock/providers.ts`
- Modify: `src/mock/training.ts`

**Interfaces:**
- Consumes: `ServiceProvider` 与 `TrainingCourse` 现有类型。
- Produces: 12 家汽车领域服务机构与 6 门汽车数据课程，供服务中心和全局搜索共用。

- [ ] **Step 1: 运行服务内容失败检查**

Run:

```bash
rg -n '医药|临床|互联网|金融|服务业|政务|综合企业|科研合作' src/mock/providers.ts src/mock/training.ts
```

Expected: FAIL for the desired state; output includes provider industry labels, the medical provider and the mixed-industry workshop.

- [ ] **Step 2: 统一 12 家机构的汽车行业能力**

Keep provider IDs, types and regions. Replace each provider's `name` only where listed, and replace `industries`, `tags`, and `summary` exactly as follows:

```ts
const providerAutomotiveCopy = {
  'provider-1': { industries: ['汽车', '汽车研发'], tags: ['法规研判', '标准合同', '申报备案'], summary: '提供汽车研发与车联网数据出境路径研判、合同审核和申报辅助服务。' },
  'provider-2': { industries: ['汽车制造', '汽车供应链'], tags: ['数据治理', '风险评估'], summary: '聚焦汽车制造、零部件质量和供应链协同的数据资产盘点与治理提升。' },
  'provider-3': { industries: ['智能驾驶', '车联网'], tags: ['合规测试', '技术测评'], summary: '提供智能驾驶数据安全措施测试、车联网日志审计和材料完整性检查。' },
  'provider-4': { industries: ['汽车', '售后服务'], tags: ['PIA', '认证准备'], summary: '提供车辆用户信息保护认证准备和汽车业务制度差距分析服务。' },
  'provider-5': { industries: ['汽车', '工业制造'], tags: ['脱敏', '加密传输', '日志审计'], summary: '提供汽车数据脱敏、传输加密和车联网审计平台建设服务。' },
  'provider-6': { industries: ['车联网', '汽车研发'], tags: ['专线方案', '链路监测'], summary: '提供汽车研发中心与车联网运营节点之间的跨境专线和监测服务。' },
  'provider-7': { industries: ['汽车', '汽车制造'], tags: ['GDPR', '工业数据'], summary: '聚焦欧盟和德国汽车研发、制造数据及供应链合规。' },
  'provider-8': { name: '星桥智能汽车顾问', industries: ['智能驾驶', '汽车研发'], tags: ['道路测试', '算法协同'], summary: '提供智能驾驶道路测试和跨境算法研发协同的数据治理建议。' },
  'provider-9': { industries: ['汽车', '车联网'], tags: ['安全评估', '监管沟通'], summary: '擅长车联网和智能驾驶高风险场景的安全评估与申报材料论证。' },
  'provider-10': { industries: ['汽车', '汽车供应链'], tags: ['认证机构', '制度建设'], summary: '提供亚太汽车供应链数据认证准备和制度落地咨询。' },
  'provider-11': { industries: ['汽车制造', '汽车供应链'], tags: ['可信数据空间', '隐私计算'], summary: '提供汽车制造与零部件协同的可信数据空间和隐私计算方案。' },
  'provider-12': { industries: ['汽车制造', 'OTA 软件升级'], tags: ['跨境链路', '网络稳定性'], summary: '提供中日汽车制造与 OTA 运维链路的加密传输和节点健康监测服务。' },
} as const;
```

Apply values directly; do not introduce the temporary constant.

- [ ] **Step 3: 将培训课程全部落到汽车场景**

Keep course IDs, categories, durations, levels and downloads. Replace titles and summaries with:

```ts
const trainingAutomotiveCopy = {
  'training-1': ['汽车数据出境合规路径入门', '通过汽车研发、道路测试和车联网场景展示平台路径研判能力。'],
  'training-2': ['汽车数据标准合同备案实务', '围绕汽车研发协同的标准合同路径、材料目录和常见缺陷进行演示。'],
  'training-3': ['汽车重要数据辅助识别方法', '通过研发设计、智能驾驶和 OTA 数据演示分类分级、重要数据识别与人工复核。'],
  'training-4': ['汽车数据 PIA 与风险问卷设计', '展示车辆用户、道路测试和车联网数据的风险矩阵与 PIA 建模思路。'],
  'training-5': ['车联网跨境链路安全与监测', '通过车联网与 OTA 运维链路展示安全流通、审计日志和节点监测。'],
  'training-6': ['汽车全生命周期场景工作坊', '通过研发设计、道路测试、生产制造、车联网和 OTA 场景演练平台核心交互。'],
} as const;
```

Apply values directly; do not introduce the temporary constant.

- [ ] **Step 4: 验证服务中心和搜索数据源**

Run:

```bash
rg -n '医药|临床|互联网|金融|服务业|政务|综合企业|科研合作' src/mock/providers.ts src/mock/training.ts
npm run typecheck:web
```

Expected: first command returns no matches; second command exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/mock/providers.ts src/mock/training.ts
git commit -m "content: refocus services and training on automotive scenarios"
```

### Task 4: 统一首页链路与安全事件示例

**Files:**
- Modify: `src/pages/home/demoData.ts`
- Modify: `src/mock/security.ts`

**Interfaces:**
- Consumes: `HomeFlowRoute[]`、`SecurityEvent[]`、首页排行与事件数组。
- Produces: 首页全球链路、排行注释、实时事件和安全监测均围绕汽车数据流转。

- [ ] **Step 1: 运行首页与安全事件失败检查**

Run:

```bash
rg -n '客服|员工主数据|临床协作|国际运营|订单摘要|履约状态|区域报表|工业日志出口' src/pages/home/demoData.ts src/mock/security.ts
```

Expected: FAIL for the desired state; output includes non-automotive routes and security summaries.

- [ ] **Step 2: 重写首页五条跨境链路及其关联展示**

Keep route IDs, source/target nodes, numeric volume, latency, risk and status. Apply these exact copy changes:

```ts
// flow-frankfurt
label: '整车研发协同专线',
payload: '车型参数、仿真模型、测试样本',

// flow-singapore
label: '道路测试分析链路',
payload: '道路测试视频、车辆轨迹、环境感知摘要',

// flow-tokyo
label: '制造与 OTA 协同链路',
payload: '产线指标、质量追溯、软件升级日志',

// flow-silicon
label: '智能驾驶算法链路',
payload: '脱敏感知样本、模型结果、标签数据',

// flow-dubai
label: '车联网运营链路',
payload: '车辆运行统计、服务状态、安全告警',
```

Update `homeDestinationRanks` notes in current order to `整车研发`、`道路测试`、`制造与升级`、`智能驾驶`、`车联网运营`。Update `homeFlowEvents` route names to match the new labels, and change the Singapore target to `新加坡道路测试分析中心`.

- [ ] **Step 3: 重写五条安全事件摘要**

Keep event IDs, times, countries, types, results and risk levels. Replace only summaries:

```ts
const securityAutomotiveSummaries = {
  'security-event-1': '检测到整车研发链路加密套件变更，已触发人工复核。',
  'security-event-2': '道路测试数据下载量短时间升高，已记录审计日志。',
  'security-event-3': '智能驾驶研发链路出现短时重试峰值，系统已自动恢复。',
  'security-event-4': '车联网运行平台角色权限调整，需要补充审批留痕。',
  'security-event-5': 'OTA 升级日志链路吞吐下降，已加入趋势跟踪。',
} as const;
```

Apply values directly; do not introduce the temporary constant.

- [ ] **Step 4: 验证首页和安全内容**

Run:

```bash
rg -n '客服|员工主数据|临床协作|国际运营|订单摘要|履约状态|区域报表|工业日志出口' src/pages/home/demoData.ts src/mock/security.ts
npm run typecheck:web
```

Expected: first command returns no matches; second command exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/pages/home/demoData.ts src/mock/security.ts
git commit -m "content: align dashboard and security events with automotive flows"
```

### Task 5: 全局禁词审计、关联检查与生产构建

**Files:**
- Modify only files found by the audit if they contain user-visible non-automotive examples missed in Tasks 1–4.

**Interfaces:**
- Consumes: all user-visible strings under `src`, `public`, `README.md` and `演示操作说明.md`。
- Produces: 无医疗示例、无非汽车独立行业案例、无失效场景引用的可构建应用。

- [ ] **Step 1: 执行医疗语义全局审计**

Run:

```bash
rg -n -i '医疗|医药|医院|患者|病人|病例|病历|临床|治疗|医生|药品|medical|patient|clinical|hospital|pharma' src public README.md 演示操作说明.md
```

Expected: no matches. Do not include `诊断` or `health` in this pattern because automotive remote diagnostics and node health are explicitly allowed.

- [ ] **Step 2: 执行非汽车行业案例审计**

Run:

```bash
rg -n '金融|零售|民航|航空维修|再保险|国际航运|餐饮业|住宿业|旅游|免税|种业|深海|个人征信|电子商务|直播跨境电商|科研合作|员工主数据|客服支撑|集团人力' src public README.md 演示操作说明.md
```

Expected: no matches.

Then run:

```bash
rg -n '互联网' src public README.md 演示操作说明.md
```

Expected: matches only the regulator proper name `国家互联网信息办公室`; any industry label or example hit must be rewritten to the closest one of the six approved automotive categories.

- [ ] **Step 3: 检查所有历史评估场景 ID 可解析**

Run:

```bash
rg -o "scenarioId: '[^']+'" src/mock/assessments.ts
rg -o "id: 'scenario-[^']+'" src/mock/scenarios.ts
```

Expected: every assessment value is one of `scenario-auto-de`, `scenario-auto-test-sg`, `scenario-auto-driving-hk`, `scenario-auto-connected-eu`, `scenario-auto-ota-jp`; there are no other scenario IDs in assessment records.

- [ ] **Step 4: 运行完整类型检查与构建**

Run:

```bash
npm run typecheck
npm run build
```

Expected: both commands exit 0; Vite emits a production bundle and Electron TypeScript compilation succeeds.

- [ ] **Step 5: 审查最终差异**

Run:

```bash
git diff --check
git diff --stat
git status --short
```

Expected: `git diff --check` exits 0; status contains only the intended content files. Review the diff to confirm no regulator names, route definitions, component behavior, types or styles were unintentionally changed.

- [ ] **Step 6: Commit any audit-only fixes**

If Step 1 or Step 2 found additional user-visible examples, stage only those exact files and commit:

```bash
git commit -m "content: complete automotive example audit"
```

If no additional files were modified in Task 5, skip this commit.
