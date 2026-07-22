import type { BusinessStatus, CitationItem, RiskLevel } from './ui';

export interface RegulationArticle {
  id: string;
  title: string;
  content: string;
  translatedContent?: string;
  highlighted: boolean;
}

export interface Regulation {
  id: string;
  title: string;
  country: string;
  region?: string;
  language: string;
  translatedLanguage?: string;
  authority: string;
  level: string;
  status: 'effective' | 'draft' | 'expired';
  publishDate: string;
  effectiveDate?: string;
  topics: string[];
  industries: string[];
  summary: string;
  articles: RegulationArticle[];
  relatedIds: string[];
}

export interface CountryFaq {
  question: string;
  answer: string;
}

export interface CountryProfile {
  id: string;
  name: string;
  region: string;
  regulatoryAuthorities: string[];
  crossBorderMechanisms: string[];
  localizationRequirements: string[];
  keyRisks: string[];
  faqs: CountryFaq[];
  keyRegulationIds: string[];
}

export interface Scenario {
  id: string;
  name: string;
  industry: string;
  fromCountry: string;
  toCountry: string;
  dataTypes: string[];
  summary: string;
  recommendedPath: string;
  riskLevel: RiskLevel;
}

export interface DataAsset {
  id: string;
  name: string;
  system: string;
  category: string;
  level: string;
  personalInfo: boolean;
  sensitivePersonalInfo: boolean;
  suspectedImportantData: boolean;
  subjectType: string;
  purpose: string;
  destination: string;
  retentionPeriod: string;
  riskLevel: RiskLevel;
}

export interface AssessmentRecord {
  id: string;
  name: string;
  type: 'precheck' | 'path' | 'listPolicy' | 'risk' | 'pia';
  scenarioId?: string;
  status: 'draft' | 'completed';
  riskLevel?: RiskLevel;
  resultSummary: string;
  citations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MaterialIssue {
  id: string;
  title: string;
  severity: RiskLevel;
  status: BusinessStatus;
  suggestion: string;
}

export interface Material {
  id: string;
  name: string;
  filingType: 'securityAssessment' | 'standardContract' | 'certification';
  status: 'draft' | 'checking' | 'completed';
  completeness: number;
  updatedAt: string;
  issues: MaterialIssue[];
}

export interface MaterialCheckResult {
  id: string;
  materialId: string;
  checkType: string;
  score: number;
  status: BusinessStatus;
  issues: string[];
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  status: 'generated' | 'draft';
  createdAt: string;
  summary: string;
  sections: ReportSection[];
}

export interface SecurityEvent {
  id: string;
  time: string;
  sourceCountry: string;
  destinationCountry: string;
  type: string;
  result: string;
  riskLevel: RiskLevel;
  summary: string;
}

export interface SecurityNodeStatus {
  id: string;
  name: string;
  region: string;
  status: 'healthy' | 'warning' | 'offline';
  throughputGb: number;
}

export interface SecuritySnapshot {
  trafficGb: number;
  activeConnections: number;
  riskEventCount: number;
  monitoredCountries: string[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  type: string;
  regions: string[];
  industries: string[];
  tags: string[];
  summary: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  summary: string;
  downloads: string[];
}

export interface DashboardReportCard {
  title: string;
  type: string;
  summary: string;
  updatedAt: string;
  status: BusinessStatus;
}

export interface DashboardMetric {
  label: string;
  value: string;
}

export interface PlaygroundDocumentSection {
  title: string;
  content: string;
}

export interface PlaygroundSearchFilter {
  key: string;
  label: string;
  placeholder: string;
  options: Array<{
    label: string;
    value: string;
  }>;
}

export interface RegulationReference extends CitationItem {}
