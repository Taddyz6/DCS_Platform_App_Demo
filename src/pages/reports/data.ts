import { findRegulationById, reports } from '@/mock';
import type { Report } from '@/types/domain';
import type { CitationItem } from '@/types/ui';

const reportCitationMap: Record<string, string[]> = {
  研发设计: ['reg-cn-auto-guide-2026', 'reg-cn-dsl', 'reg-cn-security-assessment'],
  生产制造: ['reg-cn-dsl', 'reg-cn-data-flow'],
  自动驾驶: ['reg-cn-auto-guide-2026', 'reg-cn-security-assessment', 'reg-cn-dsl'],
  软件升级: ['reg-cn-auto-guide-2026', 'reg-cn-dsl', 'reg-cn-data-flow'],
  联网运行: ['reg-cn-auto-guide-2026', 'reg-cn-dsl', 'reg-cn-security-assessment'],
};

export function getReportById(id?: string) {
  return reports.find((report) => report.id === id);
}

export function getReportTypeOptions() {
  return Array.from(new Set(reports.map((report) => report.type))).map((type) => ({
    label: type,
    value: type,
  }));
}

export function getReportCitations(report?: Report): CitationItem[] {
  if (!report) {
    return [];
  }

  return (reportCitationMap[report.type] ?? [])
    .map((id) => findRegulationById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      id: item.id,
      title: `《${item.title}》`,
      article: item.articles[0]?.title ?? '重点条款',
      summary: item.summary,
    }));
}

export function getRelatedReports(report?: Report) {
  if (!report) {
    return [];
  }

  return reports
    .filter((item) => item.type === report.type && item.id !== report.id)
    .slice(0, 3);
}
