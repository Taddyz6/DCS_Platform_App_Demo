import { create } from 'zustand';
import { readAppPreferences } from './preferences';

type ThemeMode = 'light';

interface AppState {
  lastVisitedRoute: string;
  themeMode: ThemeMode;
  setLastVisitedRoute: (route: string) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
}

const preferences = typeof window === 'undefined' ? undefined : readAppPreferences();

export const useAppStore = create<AppState>((set) => ({
  lastVisitedRoute: '/home',
  themeMode: preferences?.themeMode ?? 'light',
  setLastVisitedRoute: (route) => set({ lastVisitedRoute: route }),
  setThemeMode: (themeMode) => set({ themeMode }),
}));
