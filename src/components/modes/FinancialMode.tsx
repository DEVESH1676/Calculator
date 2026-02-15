import React, { useState } from 'react';
import { Home, Coins, Calculator as CalculatorIcon } from 'lucide-react';
import { math } from '../../utils/mathConfig';
import { useTheme } from '../../context/ThemeContext';
import { InputField } from './InputField';
import AmortizationTable from '../financial/AmortizationTable';
import FinancialChart from '../financial/FinancialChart';
import type { AmortizationItem } from '../financial/AmortizationTable';
import type { ChartData } from '../financial/FinancialChart';

const FinancialMode: React.FC = () => {
  const { theme } = useTheme();
  const [activeTool, setActiveTool] = useState<'emi' | 'sip' | 'cagr'>('emi');
  const [emiInputs, setEmiInputs] = useState({ principal: '', rate: '', tenure: '' });
  const [sipInputs, setSipInputs] = useState({ investment: '', rate: '', years: '' });
  const [cagrInputs, setCagrInputs] = useState({ beginningValue: '', endingValue: '', years: '' });
  const [showDetails, setShowDetails] = useState(false);

  const calculateEMI = () => {
    const { principal, rate, tenure } = emiInputs;
    if (!principal || !rate || !tenure) return null;

    try {
      const P = math.bignumber(principal);
      const R = math.bignumber(rate).div(100); // Annual rate
      const T = math.bignumber(tenure);

      const r = R.div(12); // Monthly rate
      const n = T.mul(12); // Months

      // E = P * r * (1+r)^n / ((1+r)^n - 1)
      const scope = { P, r, n };
      const EMI = math.evaluate('P * r * (1 + r)^n / ((1 + r)^n - 1)', scope);

      const totalAmount = EMI.mul(n);
      const totalInterest = totalAmount.sub(P);

      // Generate Schedule
      const schedule = [];
      let balance = P;
      const monthlyRate = r.toNumber();

      // Limit iterations to prevent freezing on huge inputs, e.g. 50 years max
      const months = Math.min(n.toNumber(), 600);

      for (let i = 1; i <= months; i++) {
        const interest = balance.mul(monthlyRate);
        const principalPart = EMI.sub(interest);
        balance = balance.sub(principalPart);

        // Fix negative small balance at end due to precision
        if (i === months && balance.lessThan(0)) balance = math.bignumber(0);
        if (balance.lessThan(0)) balance = math.bignumber(0);

        schedule.push({
          month: i,
          principal: principalPart.toFixed(2),
          interest: interest.toFixed(2),
          balance: balance.toFixed(2),
        });
      }

      return {
        emi: EMI.toNumber(),
        totalInterest: totalInterest.toNumber(),
        totalAmount: totalAmount.toNumber(),
        schedule,
      };
    } catch (e) {
      console.error('EMI Error', e);
      return null;
    }
  };

  const calculateSIP = (): FinancialResult | null => {
    const { investment, rate, years } = sipInputs;
    if (!investment || !rate || !years) return null;

    try {
      const P = math.bignumber(investment);
      const R = math.bignumber(rate).div(100);
      const T = math.bignumber(years);

      const i = R.div(12); // Monthly rate
      const n = T.mul(12); // Months

      const scope = { P, i, n };
      const FutureValue = math.evaluate('P * ((1 + i)^n - 1) / i * (1 + i)', scope);
      const InvestedAmount = P.mul(n);
      const TotalInterest = FutureValue.sub(InvestedAmount);

      // Generate Yearly Data for Chart
      const chartData = [];
      const yearsNum = T.toNumber();
      // i is monthly rate.
      // FV = P * ((1+i)^months - 1)/i * (1+i)

      for (let y = 0; y <= yearsNum; y++) {
        const months = y * 12;
        if (y === 0) {
          chartData.push({ year: y, invested: 0, value: 0 });
          continue;
        }

        // Use evaluate for consistent type handling
        // FV = P * ((1+i)^months - 1)/i * (1+i)
        const loopScope = { P, i, months };
        const fv = math.evaluate('P * ((1 + i)^months - 1) / i * (1 + i)', loopScope);

        // Invested = P * months
        const inv = P.mul(months);

        chartData.push({
          year: y,
          invested: inv.toNumber(),
          value: fv.toNumber(),
        });
      }

      return {
        totalInterest: TotalInterest.toNumber(),
        totalAmount: FutureValue.toNumber(),
        invested: InvestedAmount.toNumber(),
        chartData,
      };
    } catch (e) {
      console.error('SIP Error', e);
      return null;
    }
  };

  const calculateCAGR = () => {
    const { beginningValue, endingValue, years } = cagrInputs;
    if (!beginningValue || !endingValue || !years) return null;

    try {
      const BV = math.bignumber(beginningValue);
      const EV = math.bignumber(endingValue);
      const T = math.bignumber(years);

      if (T.equals(0)) return null;

      const CAGR = math.evaluate('(EV / BV)^(1/T) - 1', { BV, EV, T });

      // Generate Chart Data (Exponential growth curve)
      const chartData = [];
      const yearsNum = T.toNumber();
      const bvNum = BV.toNumber();
      const cagrNum = CAGR.toNumber();

      for (let y = 0; y <= yearsNum; y++) {
        // Val = BV * (1 + CAGR)^y
        const val = bvNum * Math.pow(1 + cagrNum, y);
        chartData.push({
          year: y,
          invested: bvNum, // Initial investment stays constant
          value: val,
        });
      }

      return {
        cagr: CAGR.toNumber(),
        chartData,
      };
    } catch (e) {
      console.error('CAGR Error', e);
      return null;
    }
  };

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
      result = calculateEMI();
      break;
    case 'sip':
      result = calculateSIP();
      break;
    case 'cagr':
      result = calculateCAGR();
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
                theme={theme}
                label="Principal Amount (P)"
                value={emiInputs.principal}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmiInputs({ ...emiInputs, principal: e.target.value })
                }
                placeholder="e.g. 100000"
              />
              <InputField
                theme={theme}
                label="Interest Rate (R %)"
                value={emiInputs.rate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmiInputs({ ...emiInputs, rate: e.target.value })
                }
                placeholder="e.g. 8.5"
              />
              <InputField
                theme={theme}
                label="Tenure (Years)"
                value={emiInputs.tenure}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmiInputs({ ...emiInputs, tenure: e.target.value })
                }
                placeholder="e.g. 5"
              />
            </>
          )}
          {activeTool === 'sip' && (
            <>
              <InputField
                theme={theme}
                label="Monthly Investment"
                value={sipInputs.investment}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSipInputs({ ...sipInputs, investment: e.target.value })
                }
                placeholder="e.g. 5000"
              />
              <InputField
                theme={theme}
                label="Expected Return Rate (R %)"
                value={sipInputs.rate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSipInputs({ ...sipInputs, rate: e.target.value })
                }
                placeholder="e.g. 12"
              />
              <InputField
                theme={theme}
                label="Time Period (Years)"
                value={sipInputs.years}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSipInputs({ ...sipInputs, years: e.target.value })
                }
                placeholder="e.g. 10"
              />
            </>
          )}
          {activeTool === 'cagr' && (
            <>
              <InputField
                theme={theme}
                label="Beginning Value"
                value={cagrInputs.beginningValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCagrInputs({ ...cagrInputs, beginningValue: e.target.value })
                }
                placeholder="e.g. 1000"
              />
              <InputField
                theme={theme}
                label="Ending Value"
                value={cagrInputs.endingValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCagrInputs({ ...cagrInputs, endingValue: e.target.value })
                }
                placeholder="e.g. 2000"
              />
              <InputField
                theme={theme}
                label="Time Period (Years)"
                value={cagrInputs.years}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCagrInputs({ ...cagrInputs, years: e.target.value })
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
