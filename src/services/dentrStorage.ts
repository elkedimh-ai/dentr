import { StudentGroupId, PresetTabId } from '../types/dentr';

const STORAGE_KEYS = {
  GROUP: 'dentr_selected_group',
  THEME: 'dentr_theme',
  ACTIVE_TAB: 'dentr_active_tab',
  ADMIN_AUTH: 'dentr_admin_authenticated',
};

export const dentrStorage = {
  getSelectedGroup: (): StudentGroupId => {
    return (localStorage.getItem(STORAGE_KEYS.GROUP) as StudentGroupId) || 'all';
  },
  setSelectedGroup: (group: StudentGroupId): void => {
    localStorage.setItem(STORAGE_KEYS.GROUP, group);
  },

  getTheme: (): 'dark' | 'light' => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light') || 'dark';
  },
  setTheme: (theme: 'dark' | 'light'): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  getActiveTab: (): PresetTabId => {
    return (localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) as PresetTabId) || 'overview';
  },
  setActiveTab: (tab: PresetTabId): void => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
  },

  isAdminAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },
  setAdminAuthenticated: (auth: boolean): void => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, auth ? 'true' : 'false');
  }
};
