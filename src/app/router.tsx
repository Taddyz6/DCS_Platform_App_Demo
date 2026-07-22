import type { ReactElement } from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import { routeCatalog } from '@/app/navigation';
import { PlaceholderPage } from '@/components/common/PlaceholderPage';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  AssessmentHistoryPage,
  AssessmentHomePage,
  AssessmentListPolicyPage,
  AssessmentPathPage,
  AssessmentResultPage,
} from '@/pages/assessment';
import {
  FilingCertificationPage,
  FilingHistoryPage,
  FilingHomePage,
  FilingMaterialCheckPage,
  FilingMaterialDetailPage,
  FilingMaterialsPage,
  FilingSecurityAssessmentPage,
  FilingStandardContractPage,
} from '@/pages/filing';
import { HomePage } from '@/pages/home/HomePage';
import { SearchPage } from '@/pages/search';
import {
  GovernanceAssetDetailPage,
  GovernanceAssetsPage,
  GovernanceClassificationPage,
  GovernanceHomePage,
  GovernanceImportantDataPage,
} from '@/pages/governance';
import {
  SecurityAuditPage,
  SecurityHomePage,
  SecurityMonitorPage,
  SecuritySolutionPage,
  SecurityTransferPage,
  SecurityTrustedSpacePage,
} from '@/pages/security';
import {
  RegulationDetailPage,
  RegulationsComparePage,
  RegulationsHomePage,
  RegulationsQAPage,
} from '@/pages/regulations';
import {
  ServiceApplicationPage,
  ServiceConsultationPage,
  ServiceProvidersPage,
  ServiceTrainingPage,
  ServicesHomePage,
} from '@/pages/services';
import { ReportDetailPage, ReportsListPage } from '@/pages/reports';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { SplashPage } from '@/pages/home/SplashPage';

const routeElementMap: Record<string, ReactElement> = {
  home: <HomePage />,
  search: <SearchPage />,
  reports: <ReportsListPage />,
  'reports-detail': <ReportDetailPage />,
  settings: <SettingsPage />,
  'regulations-home': <RegulationsHomePage />,
  'regulations-library': <Navigate to="/regulations" replace />,
  'regulations-detail': <RegulationDetailPage />,
  'regulations-country': <Navigate to="/regulations" replace />,
  'regulations-qa': <RegulationsQAPage />,
  'regulations-compare': <RegulationsComparePage />,
  'assessment-home': <AssessmentHomePage />,
  'assessment-precheck': <Navigate to="/assessment/path" replace />,
  'assessment-path': <AssessmentPathPage />,
  'assessment-list-policy': <AssessmentListPolicyPage />,
  'assessment-result': <AssessmentResultPage />,
  'assessment-history': <AssessmentHistoryPage />,
  'governance-home': <GovernanceHomePage />,
  'governance-assets': <GovernanceAssetsPage />,
  'governance-asset-detail': <GovernanceAssetDetailPage />,
  'governance-classification': <GovernanceClassificationPage />,
  'governance-important-data': <GovernanceImportantDataPage />,
  'filing-home': <FilingHomePage />,
  'filing-security-assessment': <FilingSecurityAssessmentPage />,
  'filing-standard-contract': <FilingStandardContractPage />,
  'filing-certification': <FilingCertificationPage />,
  'filing-materials': <FilingMaterialsPage />,
  'filing-material-detail': <FilingMaterialDetailPage />,
  'filing-material-check': <FilingMaterialCheckPage />,
  'filing-history': <FilingHistoryPage />,
  'security-home': <SecurityHomePage />,
  'security-solution': <SecuritySolutionPage />,
  'security-transfer': <SecurityTransferPage />,
  'security-monitor': <SecurityMonitorPage />,
  'security-audit': <SecurityAuditPage />,
  'security-trusted-space': <SecurityTrustedSpacePage />,
  'services-home': <ServicesHomePage />,
  'services-providers': <ServiceProvidersPage />,
  'services-consultation': <ServiceConsultationPage />,
  'services-training': <ServiceTrainingPage />,
  'services-application': <ServiceApplicationPage />,
};

const layoutChildren = routeCatalog.map((route) => ({
  path: route.path.slice(1),
  element:
    routeElementMap[route.key] ??
    (route.kind === 'home' ? <HomePage /> : <PlaceholderPage route={route} />),
  handle: {
    breadcrumb: route.breadcrumb,
  },
}));

export const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="/splash" replace />,
  },
  {
    path: '/splash',
    element: <SplashPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'governance/risk',
        element: <Navigate to="/governance" replace />,
      },
      {
        path: 'governance/pia',
        element: <Navigate to="/governance" replace />,
      },
      {
        path: 'governance/rectification',
        element: <Navigate to="/governance" replace />,
      },
      ...layoutChildren,
      {
        path: '*',
        element: <Navigate to="/home" replace />,
      },
    ],
  },
]);
