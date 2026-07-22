import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import type { ConsultationRecord, ServiceApplicationRecord } from './data';
import { buildApplicationSeed, buildConsultationSeed } from './data';
import { readJsonStorage, writeJsonStorage } from '@/utils/localStorage';

const CONSULTATIONS_KEY = 'dcs-services-consultations';
const APPLICATIONS_KEY = 'dcs-services-applications';

export function useServicesWorkspace() {
  const [localConsultations, setLocalConsultations] = useState<ConsultationRecord[]>(() =>
    readJsonStorage<ConsultationRecord[]>(CONSULTATIONS_KEY, []),
  );
  const [localApplications, setLocalApplications] = useState<ServiceApplicationRecord[]>(() =>
    readJsonStorage<ServiceApplicationRecord[]>(APPLICATIONS_KEY, []),
  );

  const consultations = useMemo(
    () =>
      [...localConsultations, ...buildConsultationSeed()].sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt),
      ),
    [localConsultations],
  );

  const applications = useMemo(
    () =>
      [...localApplications, ...buildApplicationSeed()].sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt),
      ),
    [localApplications],
  );

  const createConsultation = (payload: Omit<ConsultationRecord, 'id' | 'createdAt'>) => {
    const nextRecord: ConsultationRecord = {
      id: `consultation-local-${Date.now()}`,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      ...payload,
    };

    setLocalConsultations((current) => {
      const next = [nextRecord, ...current];
      writeJsonStorage(CONSULTATIONS_KEY, next);
      return next;
    });

    return nextRecord.id;
  };

  const createApplication = (payload: Omit<ServiceApplicationRecord, 'id' | 'createdAt'>) => {
    const nextRecord: ServiceApplicationRecord = {
      id: `service-application-local-${Date.now()}`,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      ...payload,
    };

    setLocalApplications((current) => {
      const next = [nextRecord, ...current];
      writeJsonStorage(APPLICATIONS_KEY, next);
      return next;
    });

    return nextRecord.id;
  };

  return {
    consultations,
    applications,
    createConsultation,
    createApplication,
  };
}
