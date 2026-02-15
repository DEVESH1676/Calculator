import React, { useState } from 'react';
import { LayoutGrid, HelpCircle, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import TabNavigation from '../shared/TabNavigation';
import UserGuide from '../UserGuide';

export type CalculatorMode = 'standard' | 'financial' | 'unit' | 'programmer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme, setTheme, currentTheme } = useThemeStore();
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className={`flex flex-col h-screen w-full ${theme.text} transition-colors duration-500`}>
      {/* Background Layer for Theme */}
      <div
        className={`fixed inset-0 -z-50 transition-colors duration-500 ease-in-out ${theme.bg}`}
      />

      {/* Header / Tabs */}
      <header className={`flex items-center justify-between px-6 py-4 ${theme.glass} z-50`}>
        <div className="flex items-center gap-2">
          <LayoutGrid className={theme.primary} />
          <h1 className="font-bold text-xl tracking-tight hidden md:block">ModCalc</h1>
        </div>

        <TabNavigation />

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowGuide(true)}
            className={`opacity-60 hover:opacity-100 transition-opacity`}
            title="User Guide"
          >
            <HelpCircle size={24} />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-full transition-all duration-300 ${currentTheme === 'dark'
              ? 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.2)]'
              : 'bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600/20'
              }`}
            title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative p-4 md:p-8">
        <div
          className={`w-full h-full ${theme.glass} rounded-3xl overflow-hidden shadow-2xl relative border ${theme.border}`}
        >
          {children}
        </div>
      </main>

      <UserGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
};

export default MainLayout;
