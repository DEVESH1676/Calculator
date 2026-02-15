import React from 'react';
import { useThemeStore } from '../../../store/useThemeStore';

export interface AmortizationItem {
  month: number;
  principal: string;
  interest: string;
  balance: string;
}

interface AmortizationTableProps {
  schedule: AmortizationItem[];
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ schedule }) => {
  const { theme } = useThemeStore();

  return (
    <div className={`w-full overflow-hidden rounded-xl border ${theme.border} mt-6`}>
      <div className={`overflow-x-auto max-h-96 custom-scrollbar`}>
        <table className="w-full text-sm text-left">
          <thead className={`text-xs uppercase ${theme.glass} sticky top-0 backdrop-blur-md`}>
            <tr>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Principal</th>
              <th className="px-4 py-3">Interest</th>
              <th className="px-4 py-3 text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {schedule.map((row) => (
              <tr key={row.month} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-2 font-mono opacity-70">{row.month}</td>
                <td className="px-4 py-2 font-mono text-green-400">{row.principal}</td>
                <td className="px-4 py-2 font-mono text-red-400">{row.interest}</td>
                <td className="px-4 py-2 font-mono text-right">{row.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AmortizationTable;
