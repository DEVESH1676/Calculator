import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { useCalculatorStore } from '../store/useCalculatorStore';
import LoadingSpinner from '../components/LoadingSpinner';
import GlobalToastProvider from '../components/ui/GlobalToastProvider';

// Lazy load modes
const StandardMode = lazy(() => import('../modules/standard/StandardModule'));
const FinancialMode = lazy(() => import('../modules/financial/FinancialModule'));
const UnitConverterMode = lazy(() => import('../modules/unit/UnitModule'));
const ProgrammerMode = lazy(() => import('../modules/programmer/ProgrammerModule'));
const GraphPanel = lazy(() => import('../modules/graph/GraphModule'));
// const AIChatPanel = lazy(() => import('../modules/ai/AIModule')); // Not used in routes yet

// Extracted component to prevent recreation on re-renders
const StandardWithGraph = () => {
  const isGraphOpen = useCalculatorStore((state) => state.isGraphOpen);

  return (
    <div className="flex h-full w-full relative">
      <div
        className={`flex justify-center items-center transition-all duration-500 ease-in-out ${isGraphOpen ? 'w-1/2' : 'w-full'} h-full`}
      >
        <StandardMode />
      </div>
      <div
        className={`transition-all duration-500 ease-in-out flex flex-col justify-center items-center p-4 h-full
              ${isGraphOpen ? 'w-1/2 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full pointer-events-none absolute right-0'}`}
      >
        {isGraphOpen && (
          <Suspense fallback={<LoadingSpinner />}>
            <GraphPanel />
          </Suspense>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <GlobalToastProvider />
      <MainLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<StandardWithGraph />} />
            <Route path="/financial" element={<FinancialMode />} />
            <Route path="/unit" element={<UnitConverterMode />} />
            <Route path="/programmer" element={<ProgrammerMode />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </Router>
  );
}

export default App;
