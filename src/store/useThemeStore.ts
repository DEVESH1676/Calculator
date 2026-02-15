import { create } from 'zustand';
import { themes } from '../theme/themes';
import type { Theme, ThemeColors } from '../theme/themes';

interface ThemeState {
    currentTheme: Theme;
    theme: ThemeColors;
    setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    currentTheme: 'dark',
    theme: themes['dark'],
    setTheme: (theme) => set({ currentTheme: theme, theme: themes[theme] }),
}));
