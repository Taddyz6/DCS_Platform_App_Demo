import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import type { BusinessStatus } from '@/types/ui';
import { readJsonStorage, writeJsonStorage } from '@/utils/localStorage';
import type {
  CreatedGovernancePayload,
  GovernanceAssessmentDetail,
  GovernanceAssessmentRecord,
} from './data';
import { buildRectificationItems, deriveGovernanceDetail } from './data';

const RECORDS_KEY = 'dcs-governance-local-records';
const DETAILS_KEY = 'dcs-governance-local-details';
const TASK_STATUS_KEY = 'dcs-governance-task-status';

type GovernanceDetailMap = Record<string, GovernanceAssessmentDetail>;
type TaskStatusMap = Record<string, BusinessStatus>;

export function useGovernanceWorkspace() {
  const [records, setRecords] = useState<GovernanceAssessmentRecord[]>(() =>
    readJsonStorage<GovernanceAssessmentRecord[]>(RECORDS_KEY, []),
  );
  const [details, setDetails] = useState<GovernanceDetailMap>(() =>
    readJsonStorage<GovernanceDetailMap>(DETAILS_KEY, {}),
  );
  const [taskStatusMap, setTaskStatusMap] = useState<TaskStatusMap>(() =>
    readJsonStorage<TaskStatusMap>(TASK_STATUS_KEY, {}),
  );

  const sortedRecords = useMemo(
    () =>
      [...records].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
    [records],
  );

  const rectificationItems = useMemo(
    () => buildRectificationItems(sortedRecords, taskStatusMap),
    [sortedRecords, taskStatusMap],
  );

  const getRecordById = (id?: string) =>
    sortedRecords.find((record) => record.id === id);

  const getDetailById = (id?: string) => {
    if (!id) {
      return undefined;
    }

    const localDetail = details[id];

    if (localDetail) {
      return localDetail;
    }

    const record = getRecordById(id);

    if (!record) {
      return undefined;
    }

    return deriveGovernanceDetail(record);
  };

  const createRecord = (payload: CreatedGovernancePayload) => {
    const id = `governance-local-${Date.now()}`;
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const record: GovernanceAssessmentRecord = {
      id,
      name: payload.name,
      type: payload.type,
      assetId: payload.assetId,
      status: 'completed',
      riskLevel: payload.riskLevel,
      score: payload.score,
      summary: payload.summary,
      citations: payload.citations,
      createdAt: now,
      updatedAt: now,
    };
    const detail: GovernanceAssessmentDetail = {
      recordId: id,
      ...payload.detail,
    };

    setRecords((current) => {
      const next = [record, ...current];
      writeJsonStorage(RECORDS_KEY, next);
      return next;
    });
    setDetails((current) => {
      const next = { ...current, [id]: detail };
      writeJsonStorage(DETAILS_KEY, next);
      return next;
    });

    return id;
  };

  const updateTaskStatus = (taskId: string, status: BusinessStatus) => {
    setTaskStatusMap((current) => {
      const next = { ...current, [taskId]: status };
      writeJsonStorage(TASK_STATUS_KEY, next);
      return next;
    });
  };

  return {
    records: sortedRecords,
    rectificationItems,
    getRecordById,
    getDetailById,
    createRecord,
    updateTaskStatus,
  };
}
