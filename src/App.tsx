import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StandardMode from './components/modes/StandardMode';
import GraphPanel from './components/GraphPanel';
import MainLayout from './components/Layout/MainLayout';
import LoadingSpinner from './components/LoadingSpinner';
import { useCalculatorStore } from './store/useCalculatorStore';
import GlobalToastProvider from './components/ui/GlobalToastProvider';

// Lazy load other modes
const FinancialMode = React.lazy(() => import('./components/modes/FinancialMode'));
const UnitConverterMode = React.lazy(() => import('./components/modes/UnitConverterMode'));
const ProgrammerMode = React.lazy(() => import('./components/modes/ProgrammerMode'));

function App() {
  const { isGraphOpen } = useCalculatorStore();

  const StandardWithGraph = () => (
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
        {isGraphOpen && <GraphPanel />}
      </div>
    </div>
  );

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
