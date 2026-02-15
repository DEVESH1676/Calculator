import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export interface ChartData {
  year: number;
  invested: number;
  value: number;
}

interface Props {
  data: ChartData[];
  type: 'sip' | 'cagr';
}

const FinancialChart: React.FC<Props> = ({ data, type }) => {
  const { theme } = useTheme();

  return (
    <div className={`w-full h-64 mt-6 rounded-xl border ${theme.border} p-4 bg-black/20`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis
            dataKey="year"
            stroke="rgba(255,255,255,0.5)"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f2027', borderColor: '#333', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#00f5ff"
            fillOpacity={1}
            fill="url(#colorValue)"
            name="Total Value"
          />
          {type === 'sip' && (
            <Area
              type="monotone"
              dataKey="invested"
              stroke="#ffffff"
              strokeOpacity={0.5}
              fillOpacity={1}
              fill="url(#colorInvested)"
              name="Invested"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;
