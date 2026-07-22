export type BusinessStatus =
  | 'draft'
  | 'analyzing'
  | 'completed'
  | 'pending'
  | 'review'
  | 'closed';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface CitationItem {
  id: string;
  title: string;
  article: string;
  summary: string;
}

export interface QuestionnaireOption {
  label: string;
  value: string;
  description?: string;
}

export interface QuestionnaireItem {
  id: string;
  title: string;
  description?: string;
  options: QuestionnaireOption[];
}
