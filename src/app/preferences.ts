import { readJsonStorage, writeJsonStorage } from '@/utils/localStorage';

export type ThemeMode = 'light';

export interface RecentVisitRecord {
  path: string;
  title: string;
  visitedAt: string;
}

export interface AppPreferences {
  themeMode: ThemeMode;
  recentVisits: RecentVisitRecord[];
}

const PREFERENCES_KEY = 'dcs-app-preferences';
const MAX_RECENT_VISITS = 8;

const defaultPreferences: AppPreferences = {
  themeMode: 'light',
  recentVisits: [],
};

export function readAppPreferences() {
  return readJsonStorage<AppPreferences>(PREFERENCES_KEY, defaultPreferences);
}

export function writeAppPreferences(value: AppPreferences) {
  writeJsonStorage(PREFERENCES_KEY, value);
}

export function saveThemeMode(themeMode: ThemeMode) {
  const current = readAppPreferences();

  writeAppPreferences({
    ...current,
    themeMode,
  });
}

export function pushRecentVisit(path: string, title: string, visitedAt: string) {
  const current = readAppPreferences();
  const nextVisits = [
    { path, title, visitedAt },
    ...current.recentVisits.filter((item) => item.path !== path),
  ].slice(0, MAX_RECENT_VISITS);

  writeAppPreferences({
    ...current,
    recentVisits: nextVisits,
  });
}

export function clearAppPreferences() {
  window.localStorage.removeItem(PREFERENCES_KEY);
}

export const managedLocalStoragePrefixes = ['dcs-'];
