import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { themes } from '../theme/themes';
import type { Theme, ThemeColors } from '../theme/themes';

interface ThemeContextType {
  currentTheme: Theme;
  theme: ThemeColors;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    setTheme: setCurrentTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={`fixed inset-0 -z-50 transition-colors duration-500 ease-in-out ${themes[currentTheme].bg}`}
      />
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
