import { readAppPreferences, managedLocalStoragePrefixes } from '@/app/preferences';

export interface LocalStorageEntrySummary {
  key: string;
  size: number;
  preview: string;
}

export function getManagedLocalStorageEntries(): LocalStorageEntrySummary[] {
  return Object.keys(window.localStorage)
    .filter((key) => managedLocalStoragePrefixes.some((prefix) => key.startsWith(prefix)))
    .sort((left, right) => left.localeCompare(right, 'zh-CN'))
    .map((key) => {
      const value = window.localStorage.getItem(key) ?? '';

      return {
        key,
        size: value.length,
        preview: value.slice(0, 120),
      };
    });
}

export function clearManagedLocalStorage() {
  Object.keys(window.localStorage)
    .filter((key) => managedLocalStoragePrefixes.some((prefix) => key.startsWith(prefix)))
    .forEach((key) => {
      window.localStorage.removeItem(key);
    });
}

export function getRecentVisits() {
  return readAppPreferences().recentVisits;
}
