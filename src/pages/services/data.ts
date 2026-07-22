import dayjs from 'dayjs';
import { findRegulationById, serviceProviders, trainingCourses } from '@/mock';
import type { CitationItem, BusinessStatus } from '@/types/ui';

export interface ConsultationRecord {
  id: string;
  title: string;
  category: string;
  providerId?: string;
  status: BusinessStatus;
  question: string;
  createdAt: string;
}

export interface ServiceApplicationRecord {
  id: string;
  serviceType: string;
  providerId?: string;
  contactName: string;
  status: BusinessStatus;
  summary: string;
  createdAt: string;
}

export const consultationCategories = [
  '法规研判',
  '申报备案',
  '数据治理',
  '安全流通方案',
  '培训与演练',
];

export const serviceTypeOptions = [
  '法规研判支持',
  '申报备案辅助',
  '数据治理专项',
  '安全技术方案',
  '培训课程与工作坊',
];

export function getServicesCitations(ids: string[]): CitationItem[] {
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

export function getServicesOverview(
  consultations: ConsultationRecord[],
  applications: ServiceApplicationRecord[],
) {
  return {
    providerCount: serviceProviders.length,
    trainingCount: trainingCourses.length,
    consultationCount: consultations.length,
    applicationCount: applications.length,
  };
}

export function getServiceProviderRegions() {
  return Array.from(new Set(serviceProviders.flatMap((item) => item.regions))).sort((left, right) =>
    left.localeCompare(right, 'zh-CN'),
  );
}

export function getServiceProviderTypes() {
  return Array.from(new Set(serviceProviders.map((item) => item.type))).sort((left, right) =>
    left.localeCompare(right, 'zh-CN'),
  );
}

export function getFeaturedProviders() {
  return serviceProviders.slice(0, 4);
}

export function getFeaturedCourses() {
  return trainingCourses.slice(0, 4);
}

export function buildConsultationSeed(): ConsultationRecord[] {
  return [
    {
      id: 'consultation-seed-1',
      title: '欧盟研发数据场景法规研判咨询',
      category: '法规研判',
      providerId: serviceProviders[0]?.id,
      status: 'review',
      question: '需要确认欧盟合作研发场景下的重要数据边界和接收方约束安排。',
      createdAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      id: 'consultation-seed-2',
      title: '标准合同备案材料复核咨询',
      category: '申报备案',
      providerId: serviceProviders[2]?.id,
      status: 'completed',
      question: '需要复核字段清单、联系人说明和合同附件命名规则。',
      createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    },
  ];
}

export function buildApplicationSeed(): ServiceApplicationRecord[] {
  return [
    {
      id: 'service-app-seed-1',
      serviceType: '安全技术方案',
      providerId: serviceProviders[4]?.id,
      contactName: '平台项目负责人',
      status: 'review',
      summary: '申请跨境链路加密、网关和日志审计方案评估支持。',
      createdAt: dayjs().subtract(18, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      id: 'service-app-seed-2',
      serviceType: '培训课程与工作坊',
      providerId: serviceProviders[1]?.id,
      contactName: '平台项目负责人',
      status: 'pending',
      summary: '申请面向业务和法务团队的跨境合规场景工作坊。',
      createdAt: dayjs().subtract(10, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    },
  ];
}
