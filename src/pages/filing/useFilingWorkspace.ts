import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { materials as mockMaterials } from '@/mock';
import type { Material, MaterialCheckResult } from '@/types/domain';
import { readJsonStorage, writeJsonStorage } from '@/utils/localStorage';
import type {
  CreatedFilingPayload,
  FilingMaterialDetail,
  FilingRecord,
  UploadedMaterialMeta,
} from './data';
import {
  deriveCheckResult,
  deriveMaterialDetail,
  filingRecordsSeed,
} from './data';

const RECORDS_KEY = 'dcs-filing-local-records';
const MATERIALS_KEY = 'dcs-filing-local-materials';
const DETAILS_KEY = 'dcs-filing-local-details';
const CHECKS_KEY = 'dcs-filing-local-checks';

type DetailMap = Record<string, FilingMaterialDetail>;

export function useFilingWorkspace() {
  const [localRecords, setLocalRecords] = useState<FilingRecord[]>(() =>
    readJsonStorage<FilingRecord[]>(RECORDS_KEY, []),
  );
  const [localMaterials, setLocalMaterials] = useState<Material[]>(() =>
    readJsonStorage<Material[]>(MATERIALS_KEY, []),
  );
  const [localDetails, setLocalDetails] = useState<DetailMap>(() =>
    readJsonStorage<DetailMap>(DETAILS_KEY, {}),
  );
  const [localChecks, setLocalChecks] = useState<MaterialCheckResult[]>(() =>
    readJsonStorage<MaterialCheckResult[]>(CHECKS_KEY, []),
  );

  const records = useMemo(
    () =>
      [...localRecords, ...filingRecordsSeed].sort((left, right) =>
        right.updatedAt.localeCompare(left.updatedAt),
      ),
    [localRecords],
  );

  const mergedMaterials = useMemo(
    () =>
      Array.from(
        new Map(
          [...mockMaterials, ...localMaterials].map((material) => [material.id, material]),
        ).values(),
      ).sort((left, right) =>
        right.updatedAt.localeCompare(left.updatedAt),
      ),
    [localMaterials],
  );

  const getRecordById = (id?: string) => records.find((record) => record.id === id);

  const getMaterial = (id?: string) => mergedMaterials.find((material) => material.id === id);

  const getDetailById = (materialId?: string) => {
    if (!materialId) {
      return undefined;
    }

    const localDetail = localDetails[materialId];

    if (localDetail) {
      return localDetail;
    }

    const material = getMaterial(materialId);
    const record = records.find((item) => item.materialId === materialId);

    if (!material) {
      return undefined;
    }

    return deriveMaterialDetail(material, record);
  };

  const createEntry = (payload: CreatedFilingPayload) => {
    const timestamp = Date.now();
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const materialId = `filing-material-local-${timestamp}`;
    const recordId = `filing-record-local-${timestamp}`;
    const material: Material = {
      id: materialId,
      name: payload.record.materialName,
      filingType: payload.record.filingType,
      status: payload.record.materialStatus,
      completeness: payload.record.completeness,
      updatedAt: now,
      issues: payload.record.materialIssues,
    };
    const record: FilingRecord = {
      id: recordId,
      materialId,
      name: payload.record.name,
      filingType: payload.record.filingType,
      scenarioId: payload.record.scenarioId,
      destination: payload.record.destination,
      status: payload.record.status,
      completeness: payload.record.completeness,
      summary: payload.record.summary,
      citations: payload.record.citations,
      createdAt: now,
      updatedAt: now,
    };
    const detail: FilingMaterialDetail = {
      materialId,
      ...payload.detail,
    };

    setLocalMaterials((current) => {
      const next = [material, ...current];
      writeJsonStorage(MATERIALS_KEY, next);
      return next;
    });
    setLocalRecords((current) => {
      const next = [record, ...current];
      writeJsonStorage(RECORDS_KEY, next);
      return next;
    });
    setLocalDetails((current) => {
      const next = { ...current, [materialId]: detail };
      writeJsonStorage(DETAILS_KEY, next);
      return next;
    });

    return { recordId, materialId };
  };

  const updateMaterialDetail = (
    materialId: string,
    patch: Partial<Pick<FilingMaterialDetail, 'documentTitle' | 'notes' | 'sections' | 'uploads'>>,
  ) => {
    const existing = getDetailById(materialId);

    if (!existing) {
      return;
    }

    const nextDetail: FilingMaterialDetail = {
      ...existing,
      ...patch,
    };

    setLocalDetails((current) => {
      const next = { ...current, [materialId]: nextDetail };
      writeJsonStorage(DETAILS_KEY, next);
      return next;
    });

    setLocalMaterials((current) => {
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const existingMaterial = current.find((item) => item.id === materialId) ?? getMaterial(materialId);

      if (!existingMaterial) {
        return current;
      }

      const updatedMaterial: Material = {
        ...existingMaterial,
        name: patch.documentTitle ?? existingMaterial.name,
        updatedAt: now,
      };
      const next = [
        updatedMaterial,
        ...current.filter((item) => item.id !== materialId),
      ];
      writeJsonStorage(MATERIALS_KEY, next);
      return next;
    });

    setLocalRecords((current) => {
      const next = current.map((item) =>
        item.materialId === materialId
          ? {
              ...item,
              updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }
          : item,
      );
      writeJsonStorage(RECORDS_KEY, next);
      return next;
    });
  };

  const updateMaterialUploads = (materialId: string, uploads: UploadedMaterialMeta[]) => {
    updateMaterialDetail(materialId, { uploads });
  };

  const runMaterialCheck = (materialId: string) => {
    const material = getMaterial(materialId);
    const detail = getDetailById(materialId);

    if (!material) {
      return undefined;
    }

    const nextCheck = deriveCheckResult(material, detail);

    setLocalChecks((current) => {
      const next = [nextCheck, ...current.filter((item) => item.materialId !== materialId)];
      writeJsonStorage(CHECKS_KEY, next);
      return next;
    });

    return nextCheck;
  };

  return {
    records,
    materials: mergedMaterials,
    localMaterials,
    checks: localChecks,
    getRecordById,
    getMaterialById: getMaterial,
    getDetailById,
    createEntry,
    updateMaterialDetail,
    updateMaterialUploads,
    runMaterialCheck,
  };
}
