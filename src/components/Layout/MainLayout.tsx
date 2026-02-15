import React from 'react';
import { Calculator, DollarSign, Scale, Terminal, LayoutGrid } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { Theme } from '../../theme/themes';

export type CalculatorMode = 'standard' | 'financial' | 'unit' | 'programmer';

interface MainLayoutProps {
  activeMode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ activeMode, onModeChange, children }) => {
  const { theme, setTheme, currentTheme } = useTheme();

  const tabs = [
    { id: 'standard', label: 'Standard', icon: Calculator },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'unit', label: 'Unit', icon: Scale },
    { id: 'programmer', label: 'Programmer', icon: Terminal },
  ];

  const themesList = [
    { id: 'light', color: 'bg-gray-100' },
    { id: 'dark', color: 'bg-[#1a2b34]' },
    { id: 'neon', color: 'bg-black border border-[#00f5ff]' },
    { id: 'minimal', color: 'bg-[#f5f5f5]' },
  ];

  return (
    <div className={`flex flex-col h-screen w-full ${theme.text} transition-colors duration-500`}>
      {/* Header / Tabs */}
      <header className={`flex items-center justify-between px-6 py-4 ${theme.glass} z-50`}>
        <div className="flex items-center gap-2">
          <LayoutGrid className={theme.primary} />
          <h1 className="font-bold text-xl tracking-tight hidden md:block">ModCalc</h1>
        </div>

        <div className="flex bg-black/5 p-1 rounded-xl overflow-x-auto custom-scrollbar gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onModeChange(tab.id as CalculatorMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive
                    ? `${theme.accent} text-white shadow-lg shadow-${theme.accent}/20`
                    : `${theme.text} hover:bg-black/5 opacity-70 hover:opacity-100`
                  }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

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
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative p-4 md:p-8">
        <div
          className={`w-full h-full ${theme.glass} rounded-3xl overflow-hidden shadow-2xl relative border ${theme.border}`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
