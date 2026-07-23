import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const root = process.cwd();
const scanTargets = ['src', 'public', 'README.md', '演示操作说明.md'];
const medicalTerms =
  /医疗|医药|医院|患者|病人|病例|病历|临床|治疗|医生|药品|medical|patient|clinical|hospital|pharma/giu;
const nonAutomotiveTerms =
  /金融|零售|民航|航空维修|再保险|国际航运|餐饮业|住宿业|旅游|免税|种业|深海|个人征信|电子商务|直播跨境电商|科研合作|员工主数据|客服支撑|集团人力|雇员|职工|人事|员工|人力|客服/gu;
const allowedInternetName = '国家互联网信息办公室';
const requiredReportTypes = [
  '研发设计',
  '生产制造',
  '自动驾驶',
  '软件升级',
  '联网运行',
  '售后诊断',
];
const failures = [];

function collectFiles(target) {
  const absoluteTarget = resolve(root, target);

  if (!statSync(absoluteTarget).isDirectory()) {
    return [absoluteTarget];
  }

  return readdirSync(absoluteTarget, { withFileTypes: true }).flatMap((entry) => {
    const child = resolve(absoluteTarget, entry.name);
    return entry.isDirectory() ? collectFiles(child) : [child];
  });
}

function lineNumberAt(content, index) {
  return content.slice(0, index).split('\n').length;
}

function recordMatches(label, file, content, pattern) {
  pattern.lastIndex = 0;

  for (const match of content.matchAll(pattern)) {
    failures.push(
      `${label}: ${relative(root, file)}:${lineNumberAt(content, match.index)} (${match[0]})`,
    );
  }
}

const scannedFiles = scanTargets.flatMap(collectFiles);

for (const file of scannedFiles) {
  const content = readFileSync(file, 'utf8');
  recordMatches('医疗禁词', file, content, medicalTerms);
  recordMatches('非汽车行业禁词', file, content, nonAutomotiveTerms);

  const withoutAllowedInternetName = content.replaceAll(
    allowedInternetName,
    ' '.repeat(allowedInternetName.length),
  );
  recordMatches('未获准的“互联网”', file, withoutAllowedInternetName, /互联网/gu);
}

const scenarioDefinitionsFile = resolve(root, 'src/mock/scenarios.ts');
const scenarioDefinitionsContent = readFileSync(scenarioDefinitionsFile, 'utf8');
const definedScenarioIds = new Set(
  [...scenarioDefinitionsContent.matchAll(/id\s*:\s*(['"`])(scenario-[a-z0-9-]+)\1/g)].map(
    (match) => match[2],
  ),
);
const scenarioReferences = new Map();

for (const file of collectFiles('src')) {
  const content = readFileSync(file, 'utf8');

  for (const match of content.matchAll(/(['"`])(scenario-[a-z0-9-]+)\1/g)) {
    const locations = scenarioReferences.get(match[2]) ?? [];
    locations.push(`${relative(root, file)}:${lineNumberAt(content, match.index)}`);
    scenarioReferences.set(match[2], locations);
  }
}

for (const [scenarioId, locations] of scenarioReferences) {
  if (!definedScenarioIds.has(scenarioId)) {
    failures.push(`未定义场景 ID: ${scenarioId} (${locations.join(', ')})`);
  }
}

const reportsFile = resolve(root, 'src/mock/reports.ts');
const reportsContent = readFileSync(reportsFile, 'utf8');
const presentReportTypes = new Set(
  [...reportsContent.matchAll(/type\s*:\s*(['"`])([^'"`]+)\1/g)].map((match) => match[2]),
);
const missingReportTypes = requiredReportTypes.filter((type) => !presentReportTypes.has(type));

if (missingReportTypes.length > 0) {
  failures.push(`缺失报告类型: ${missingReportTypes.join('、')}`);
}

const filingDataFile = resolve(root, 'src/pages/filing/data.ts');
const filingDataContent = readFileSync(filingDataFile, 'utf8');

for (const staleReportType of ['研判报告', 'PIA 报告']) {
  if (filingDataContent.includes(staleReportType)) {
    failures.push(`申报首页残留旧报告类型: ${staleReportType}`);
  }
}

if (failures.length > 0) {
  console.error(`汽车内容完整性检查失败（${failures.length} 项）：`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `汽车内容完整性检查通过：扫描 ${scannedFiles.length} 个文件，6 个报告类型齐全，${definedScenarioIds.size} 个场景定义且无未定义引用。`,
);
