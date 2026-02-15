import React, { Suspense } from 'react';
import StandardMode from './components/modes/StandardMode';
// Lazy load other modes
const FinancialMode = React.lazy(() => import('./components/modes/FinancialMode'));
const UnitConverterMode = React.lazy(() => import('./components/modes/UnitConverterMode'));
const ProgrammerMode = React.lazy(() => import('./components/modes/ProgrammerMode'));

import GraphPanel from './components/GraphPanel';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/Layout/MainLayout';
import { useCalculatorStore } from './store/useCalculatorStore';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { activeMode, setActiveMode, isGraphOpen } = useCalculatorStore();

  const renderMode = () => {
    switch (activeMode) {
      case 'standard':
        return (
          <div className="flex h-full w-full relative">
            <div className={`flex justify-center items-center transition-all duration-500 ease-in-out ${isGraphOpen ? 'w-1/2' : 'w-full'} h-full`}>
              <StandardMode />
            </div>
            <div
              className={`transition-all duration-500 ease-in-out flex flex-col justify-center items-center p-4 h-full
                    ${isGraphOpen ? 'w-1/2 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full pointer-events-none absolute right-0'}`}
            >
              {isGraphOpen && <GraphPanel />}
            </div>
          </div >
        );
      case 'financial':
        return <FinancialMode />;
      case 'unit':
        return <UnitConverterMode />;
      case 'programmer':
        return <ProgrammerMode />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <MainLayout activeMode={activeMode} onModeChange={setActiveMode}>
        <Suspense fallback={<LoadingSpinner />}>
          {renderMode()}
        </Suspense>
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
