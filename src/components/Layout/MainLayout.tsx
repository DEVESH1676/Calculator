import React, { useState } from 'react';
import { LayoutGrid, HelpCircle } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import type { Theme } from '../../theme/themes';
import TabNavigation from '../shared/TabNavigation';
import UserGuide from '../UserGuide';

export type CalculatorMode = 'standard' | 'financial' | 'unit' | 'programmer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme, setTheme, currentTheme } = useThemeStore();
  const [showGuide, setShowGuide] = useState(false);

  const themesList = [
    { id: 'light', color: 'bg-gray-100' },
    { id: 'dark', color: 'bg-[#1a2b34]' },
    { id: 'neon', color: 'bg-black border border-[#00f5ff]' },
    { id: 'minimal', color: 'bg-[#f5f5f5]' },
  ];

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
          <div className="flex gap-2">
            {themesList.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as Theme)}
                className={`w-6 h-6 rounded-full ${t.color} ${currentTheme === t.id ? 'ring-2 ring-offset-2 ring-blue-400' : 'opacity-50 hover:opacity-100'} transition-all`}
                title={t.id}
              />
            ))}
          </div>
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
