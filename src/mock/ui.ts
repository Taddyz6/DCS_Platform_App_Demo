import type {
  PlaygroundDocumentSection,
  PlaygroundSearchFilter,
} from '@/types/domain';
import type { CitationItem } from '@/types/ui';
import type { QuestionnaireItem } from '@/types/ui';
import { materialCheckResults, materials } from './materials';
import { regulations } from './regulations';
import { scenarios } from './scenarios';

export const playgroundSearchFilters: PlaygroundSearchFilter[] = [
  {
    key: 'category',
    label: '功能分类',
    placeholder: '选择功能分类',
    options: [
      { label: '展示类', value: 'display' },
      { label: '分析类', value: 'analysis' },
      { label: '材料类', value: 'document' },
    ],
  },
  {
    key: 'status',
    label: '建设状态',
    placeholder: '选择建设状态',
    options: [
      { label: '已完成', value: 'completed' },
      { label: '分析中', value: 'analyzing' },
      { label: '待补充', value: 'pending' },
    ],
  },
];

export const playgroundQuestionnaireItems: QuestionnaireItem[] = [
  {
    id: 'crossBorder',
    title: '本场景是否涉及向境外主体提供数据？',
    description: '用于确定是否进入数据出境初步判断。',
    options: [
      { label: '是', value: 'yes', description: `参考场景：${scenarios[0]?.name}` },
      { label: '否', value: 'no', description: '保留本地记录并结束预检。' },
    ],
  },
  {
    id: 'personalInfo',
    title: '是否包含个人信息或敏感个人信息？',
    options: [
      { label: '仅一般个人信息', value: 'general' },
      { label: '包含敏感个人信息', value: 'sensitive' },
      { label: '不涉及个人信息', value: 'none' },
    ],
  },
];

export const playgroundCitations: CitationItem[] = regulations.slice(0, 2).map((regulation) => ({
  id: regulation.id,
  title: `《${regulation.title}》`,
  article: regulation.articles[0]?.title ?? '条款 1',
  summary: regulation.summary,
}));

export const playgroundDocumentSections: PlaygroundDocumentSection[] = [
  {
    title: '一、场景概述',
    content: scenarios[0]?.summary ?? '用于展示场景摘要。',
  },
  {
    title: '二、材料检查摘要',
    content: materialCheckResults[0]?.issues.join('；') ?? '用于展示材料检查结果。',
  },
  {
    title: '三、待补充事项',
    content: materials[1]?.issues.map((issue) => issue.title).join('；') ?? '用于展示待补充事项。',
  },
];
