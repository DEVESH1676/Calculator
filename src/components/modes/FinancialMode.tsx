import React, { useState } from 'react';
import { Calculator as CalculatorIcon, Home, Coins } from 'lucide-react';
import { math } from '../../utils/mathConfig';
import { useThemeStore } from '../../store/useThemeStore';
import { InputField } from './InputField';
import AmortizationTable from '../financial/AmortizationTable';
import FinancialChart from '../financial/FinancialChart';
import type { AmortizationItem } from '../financial/AmortizationTable';
import type { ChartData } from '../financial/FinancialChart';
import { calculateEMI, calculateSIP, calculateCAGR } from '../../utils/financialUtils';

const FinancialMode: React.FC = () => {
  const { theme } = useThemeStore();
  const [activeTool, setActiveTool] = useState<'emi' | 'sip' | 'cagr'>('emi');
  const [emiInputs, setEmiInputs] = useState({ principal: '', rate: '', tenure: '' });
  const [sipInputs, setSipInputs] = useState({ investment: '', rate: '', years: '' });
  const [cagrInputs, setCagrInputs] = useState({ beginningValue: '', endingValue: '', years: '' });
  const [showDetails, setShowDetails] = useState(false);

  // ... (component code)
  // The local functions calculateEMI, calculateSIP, calculateCAGR are removed and replaced by imports.
  // But wait, the component calls them with `emiInputs` state which is local.
  // The extracted functions accept arguments.
  // So I need to update the call sites in `switch (activeTool)` or create wrappers.

  // Looking at line 183 in original file:
  // case 'emi': result = calculateEMI(); break;
  // The original `calculateEMI` took no args and used closure state.
  // The new `calculateEMI` takes args.

  // So I should update the calls:
  // case 'emi': result = calculateEMI(emiInputs.principal, emiInputs.rate, emiInputs.tenure); break;


  interface FinancialResult {
    emi?: number;
    totalInterest?: number;
    totalAmount?: number;
    invested?: number;
    cagr?: number;
    schedule?: AmortizationItem[];
    chartData?: ChartData[];
  }

  let result: FinancialResult | null = null;
  switch (activeTool) {
    case 'emi':
      result = calculateEMI(emiInputs.principal, emiInputs.rate, emiInputs.tenure);
      break;
    case 'sip':
      result = calculateSIP(sipInputs.investment, sipInputs.rate, sipInputs.years);
      break;
    case 'cagr':
      result = calculateCAGR(cagrInputs.beginningValue, cagrInputs.endingValue, cagrInputs.years);
      break;
  }

  return (
    <div className={`flex flex-col h-full w-full p-4 overflow-y-auto custom-scrollbar`}>
      {/* Sub-tabs */}
      <div className="flex bg-black/5 p-1 rounded-xl mb-6 self-center">
        {[
          { id: 'emi', label: 'EMI', icon: Home },
          { id: 'sip', label: 'SIP', icon: Coins },
          { id: 'cagr', label: 'CAGR', icon: CalculatorIcon },
        ].map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id as 'emi' | 'sip' | 'cagr');
                setShowDetails(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                ? `${theme.accent} text-white shadow-md`
                : `${theme.text} opacity-60 hover:opacity-100`
                }`}
            >
              <Icon size={16} />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full items-start justify-center">
        {/* Input Section */}
        <div
          className={`w-full md:w-1/2 p-6 rounded-2xl ${theme.bg} bg-opacity-30 border ${theme.border} transition-all`}
        >
          {activeTool === 'emi' && (
            <>
              <InputField
                label="Principal Amount (P)"
                value={emiInputs.principal}
                onChange={(val) =>
                  setEmiInputs({ ...emiInputs, principal: val })
                }
                placeholder="e.g. 100000"
              />
              <InputField
                label="Interest Rate (R %)"
                value={emiInputs.rate}
                onChange={(val) =>
                  setEmiInputs({ ...emiInputs, rate: val })
                }
                placeholder="e.g. 8.5"
              />
              <InputField
                label="Tenure (Years)"
                value={emiInputs.tenure}
                onChange={(val) =>
                  setEmiInputs({ ...emiInputs, tenure: val })
                }
                placeholder="e.g. 5"
              />
            </>
          )}
          {activeTool === 'sip' && (
            <>
              <InputField
                label="Monthly Investment"
                value={sipInputs.investment}
                onChange={(val) =>
                  setSipInputs({ ...sipInputs, investment: val })
                }
                placeholder="e.g. 5000"
              />
              <InputField
                label="Expected Return Rate (R %)"
                value={sipInputs.rate}
                onChange={(val) =>
                  setSipInputs({ ...sipInputs, rate: val })
                }
                placeholder="e.g. 12"
              />
              <InputField
                label="Time Period (Years)"
                value={sipInputs.years}
                onChange={(val) =>
                  setSipInputs({ ...sipInputs, years: val })
                }
                placeholder="e.g. 10"
              />
            </>
          )}
          {activeTool === 'cagr' && (
            <>
              <InputField
                label="Beginning Value"
                value={cagrInputs.beginningValue}
                onChange={(val) =>
                  setCagrInputs({ ...cagrInputs, beginningValue: val })
                }
                placeholder="e.g. 1000"
              />
              <InputField
                label="Ending Value"
                value={cagrInputs.endingValue}
                onChange={(val) =>
                  setCagrInputs({ ...cagrInputs, endingValue: val })
                }
                placeholder="e.g. 2000"
              />
              <InputField
                label="Time Period (Years)"
                value={cagrInputs.years}
                onChange={(val) =>
                  setCagrInputs({ ...cagrInputs, years: val })
                }
                placeholder="e.g. 5"
              />
            </>
          )}
        </div>

        {/* Result Section */}
        <div
          className={`w-full md:w-1/2 p-6 rounded-2xl ${theme.glass} flex flex-col justify-start items-center text-center min-h-[400px] transition-all`}
        >
          {!result ? (
            <div className="opacity-50 mt-10">
              <p className="text-4xl mb-2">📊</p>
              <p className={theme.text}>Enter values to calculate</p>
            </div>
          ) : (
            <div className="space-y-4 w-full animate-fade-in-up">
              {activeTool === 'emi' && (
                <>
                  <div className="p-4 rounded-xl bg-black/10">
                    <p className={`text-sm ${theme.text} opacity-70`}>Monthly EMI</p>
                    <p className={`text-3xl font-bold ${theme.primary}`}>
                      {result.emi?.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm p-2 border-b border-white/10">
                    <span className={theme.text}>Total Interest</span>
                    <span className={`font-mono ${theme.text}`}>
                      {result.totalInterest?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm p-2">
                    <span className={theme.text}>Total Amount</span>
                    <span className={`font-mono ${theme.text}`}>
                      {result.totalAmount?.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className={`mt-4 w-full py-2 rounded-lg ${theme.buttonBg} ${theme.text} text-sm font-medium hover:brightness-110 transition-all`}
                  >
                    {showDetails ? 'Hide Schedule' : 'Show Amortization Schedule'}
                  </button>

                  {showDetails && result.schedule && (
                    <AmortizationTable schedule={result.schedule} />
                  )}
                </>
              )}
              {activeTool === 'sip' && (
                <>
                  <div className="p-4 rounded-xl bg-black/10">
                    <p className={`text-sm ${theme.text} opacity-70`}>Total Value</p>
                    <p className={`text-3xl font-bold ${theme.primary}`}>
                      {result.totalAmount?.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm p-2 border-b border-white/10">
                    <span className={theme.text}>Invested Amount</span>
                    <span className={`font-mono ${theme.text}`}>{result.invested?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm p-2">
                    <span className={theme.text}>Est. Returns</span>
                    <span className={`font-mono ${theme.text} text-green-400`}>
                      +{result.totalInterest?.toFixed(2)}
                    </span>
                  </div>

                  {result.chartData && <FinancialChart data={result.chartData} type="sip" />}
                </>
              )}
              {activeTool === 'cagr' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-xl bg-black/10">
                    <p className={`text-sm ${theme.text} opacity-70`}>CAGR</p>
                    <p className={`text-4xl font-bold ${theme.primary}`}>
                      {((result.cagr || 0) * 100).toFixed(2)}%
                    </p>
                  </div>
                  {result.chartData && <FinancialChart data={result.chartData} type="cagr" />}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialMode;
