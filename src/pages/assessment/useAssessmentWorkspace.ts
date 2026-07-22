import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { assessmentRecords } from '@/mock';
import type { AssessmentRecord } from '@/types/domain';
import { readJsonStorage, writeJsonStorage } from '@/utils/localStorage';
import type { AssessmentDetail, CreatedAssessmentPayload } from './data';
import { deriveAssessmentDetail } from './data';

const RECORDS_KEY = 'dcs-assessment-local-records';
const DETAILS_KEY = 'dcs-assessment-local-details';

type DetailMap = Record<string, AssessmentDetail>;

export function useAssessmentWorkspace() {
  const [localRecords, setLocalRecords] = useState<AssessmentRecord[]>(() =>
    readJsonStorage<AssessmentRecord[]>(RECORDS_KEY, []),
  );
  const [localDetails, setLocalDetails] = useState<DetailMap>(() =>
    readJsonStorage<DetailMap>(DETAILS_KEY, {}),
  );

  const records = useMemo(
    () =>
      [...localRecords, ...assessmentRecords].sort((left, right) =>
        right.updatedAt.localeCompare(left.updatedAt),
      ),
    [localRecords],
  );

  const getRecordById = (id?: string) =>
    records.find((item) => item.id === id);

  const getDetailById = (id?: string) => {
    if (!id) {
      return undefined;
    }

    const localDetail = localDetails[id];

    if (localDetail) {
      return localDetail;
    }

    const record = getRecordById(id);

    if (!record) {
      return undefined;
    }

    return deriveAssessmentDetail(record);
  };

  const createRecord = (payload: CreatedAssessmentPayload) => {
    const recordId = `assessment-local-${Date.now()}`;
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const newRecord: AssessmentRecord = {
      id: recordId,
      name: payload.name,
      type: payload.type,
      scenarioId: payload.scenarioId,
      status: 'completed',
      riskLevel: payload.riskLevel,
      resultSummary: payload.resultSummary,
      citations: payload.citations,
      createdAt: now,
      updatedAt: now,
    };
    const newDetail: AssessmentDetail = {
      recordId,
      ...payload.detail,
    };

    setLocalRecords((current) => {
      const next = [newRecord, ...current];
      writeJsonStorage(RECORDS_KEY, next);
      return next;
    });
    setLocalDetails((current) => {
      const next = { ...current, [recordId]: newDetail };
      writeJsonStorage(DETAILS_KEY, next);
      return next;
    });

    return recordId;
  };

  const deleteRecord = (id: string) => {
    setLocalRecords((current) => {
      const next = current.filter((item) => item.id !== id);
      writeJsonStorage(RECORDS_KEY, next);
      return next;
    });
    setLocalDetails((current) => {
      const next = { ...current };
      delete next[id];
      writeJsonStorage(DETAILS_KEY, next);
      return next;
    });
  };

  const duplicateRecord = (record: AssessmentRecord) => {
    const detail = getDetailById(record.id);

    if (!detail) {
      return undefined;
    }

    return createRecord({
      name: `${record.name}（副本）`,
      type: record.type,
      scenarioId: record.scenarioId ?? '',
      riskLevel: record.riskLevel ?? 'medium',
      resultSummary: record.resultSummary,
      citations: record.citations,
      detail: {
        ...detail,
        reportName: `${detail.reportName}（副本）`,
      },
    });
  };

  return {
    records,
    localRecords,
    getRecordById,
    getDetailById,
    createRecord,
    deleteRecord,
    duplicateRecord,
  };
}
