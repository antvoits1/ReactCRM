import { create } from 'zustand';
import { INITIAL_LEADS, type Lead } from './data';

type NavMode = 'sidebar-slim' | 'sidebar-wide' | 'topbar';

export interface ThemeSettings {
  fontFamily: string;
  fontOffset: number;
  uiScale: number;
  bgCanvas: string;
  bgConsole: string;
}

interface Preferences extends ThemeSettings {
  dialerPinned: boolean;
  navMode: NavMode;
}

export interface AppState extends ThemeSettings {
  leads: Lead[];
  dialerPinned: boolean;
  dialerVisible: boolean;
  navMode: NavMode;
  setTheme: (theme: Partial<ThemeSettings>) => void;
  toggleDialerPin: () => void;
  setDialerVisible: (visible: boolean) => void;
  setNavMode: (mode: NavMode) => void;
}

const DEFAULT_PREFERENCES: Preferences = {
  fontFamily: "'IBM Plex Sans', sans-serif",
  fontOffset: 0,
  uiScale: 1,
  bgCanvas: '#EEF1F4',
  bgConsole: '#18263F',
  dialerPinned: false,
  navMode: 'sidebar-slim',
};

const SETTINGS_KEY = 'forge-crm-ui-settings-v5';

function loadPreferences(): Preferences {
  if (typeof localStorage === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') as Partial<Preferences>;
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      uiScale: typeof parsed.uiScale === 'number' ? Math.min(1.5, Math.max(0.75, parsed.uiScale)) : DEFAULT_PREFERENCES.uiScale,
      fontOffset: typeof parsed.fontOffset === 'number' ? Math.min(20, Math.max(-4, parsed.fontOffset)) : DEFAULT_PREFERENCES.fontOffset,
      navMode: ['sidebar-slim', 'sidebar-wide', 'topbar'].includes(parsed.navMode ?? '') ? parsed.navMode! : DEFAULT_PREFERENCES.navMode,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function savePreferences(preferences: Preferences): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(preferences));
  } catch {
    // UI preferences are optional; storage failure must not break the CRM.
  }
}

// Older builds stored the full lead dataset (including SSN/bank fields) in IndexedDB.
// Remove that legacy database so sensitive lead records are not left in browser storage.
if (typeof indexedDB !== 'undefined') {
  try {
    indexedDB.deleteDatabase('ForgeCRM');
  } catch {
    // Ignore browsers where IndexedDB cleanup is unavailable.
  }
}

const initialPreferences = loadPreferences();

export const useStore = create<AppState>((set) => ({
  leads: INITIAL_LEADS,
  ...initialPreferences,
  dialerVisible: false,

  setTheme: (theme) => set((state) => {
    const next: Preferences = {
      fontFamily: theme.fontFamily ?? state.fontFamily,
      fontOffset: theme.fontOffset ?? state.fontOffset,
      uiScale: theme.uiScale ?? state.uiScale,
      bgCanvas: theme.bgCanvas ?? state.bgCanvas,
      bgConsole: theme.bgConsole ?? state.bgConsole,
      dialerPinned: state.dialerPinned,
      navMode: state.navMode,
    };
    savePreferences(next);
    return theme;
  }),

  toggleDialerPin: () => set((state) => {
    const dialerPinned = !state.dialerPinned;
    savePreferences({
      fontFamily: state.fontFamily,
      fontOffset: state.fontOffset,
      uiScale: state.uiScale,
      bgCanvas: state.bgCanvas,
      bgConsole: state.bgConsole,
      dialerPinned,
      navMode: state.navMode,
    });
    return { dialerPinned, dialerVisible: true };
  }),

  setDialerVisible: (visible) => set((state) => ({
    dialerVisible: state.dialerPinned ? true : visible,
  })),

  setNavMode: (navMode) => set((state) => {
    savePreferences({
      fontFamily: state.fontFamily,
      fontOffset: state.fontOffset,
      uiScale: state.uiScale,
      bgCanvas: state.bgCanvas,
      bgConsole: state.bgConsole,
      dialerPinned: state.dialerPinned,
      navMode,
    });
    return { navMode };
  }),
}));
