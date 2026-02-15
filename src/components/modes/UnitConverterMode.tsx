import React, { useState, useEffect } from 'react';
import { Scale, Ruler, Thermometer, DollarSign, ArrowRightLeft, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { math } from '../../utils/mathConfig';
import { CurrencyService } from '../../services/CurrencyService';

const UnitConverterMode: React.FC = () => {
  const { theme } = useTheme();

  const categories = [
    { id: 'Length', icon: Ruler },
    { id: 'Weight', icon: Scale },
    { id: 'Temperature', icon: Thermometer },
    { id: 'Currency', icon: DollarSign },
  ];

  const [activeCategory, setActiveCategory] = useState('Length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [value, setValue] = useState<string>('1');

  // Currency State
  const [currencyRates, setCurrencyRates] = useState<Record<string, number> | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const units: any = {
    Length: ['m', 'km', 'cm', 'mm', 'inch', 'ft', 'yd', 'mile'],
    Weight: ['kg', 'g', 'mg', 'lb', 'oz'],
    Temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
    Currency: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'MXN', 'CHF', 'CNY', 'NZD'], // Expanded list
  };

  // Unit Mapping for mathjs
  const unitMap: any = {
    Celsius: 'degC',
    Fahrenheit: 'degF',
    Kelvin: 'K',
    mile: 'mi', // mathjs uses 'mi' for dates? No, 'mi' or 'mile' usually works. 'mi' is safer.
  };

  const getMathUnit = (u: string) => unitMap[u] || u;

  useEffect(() => {
    if (activeCategory === 'Currency') {
      fetchRates();
    }
  }, [activeCategory]);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      // Fetch based on USD for simplicity in this demo, or based on fromUnit if we want dynamic base.
      // Frankfurter API free allow changing base.
      // Let's stick to USD base and calculate cross rates if needed,
      // OR just fetch rates for 'from' unit?
      // Better: fetch rates relative to USD (or EUR is default for Frankfurter).
      // Let's use EUR as base for Frankfurter default, or request USD.
      // CurrencyService defaults to USD base.
      const data = await CurrencyService.getRates('USD');
      setCurrencyRates(data.rates);
      setLastUpdated(data.date);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Conversion Logic
  const convert = (val: number, from: string, to: string, cat: string) => {
    if (isNaN(val)) return '';
    if (from === to) return val.toString();

    if (cat === 'Currency') {
      if (!currencyRates) return '...';

      // Convert From -> USD -> To
      // Rates are based on USD.
      // 1 USD = x From
      // 1 USD = y To
      // Value (From) / Rate(From) = Value (USD)
      // Value (USD) * Rate(To) = Value (To)

      try {
        const amount = math.bignumber(val);
        const rateFrom = math.bignumber(currencyRates[from] || 1); // Default 1 if missing
        const rateTo = math.bignumber(currencyRates[to] || 1);

        const result = amount.div(rateFrom).mul(rateTo);
        return result.toFixed(2);
      } catch (e) {
        return '';
      }
    }

    try {
      // Use mathjs unit conversion
      const fromU = getMathUnit(from);
      const toU = getMathUnit(to);

      const unitValue = math.unit(math.bignumber(val), fromU);
      const result = unitValue.to(toU);

      // result.toNumeric(unit) returns the numeric value (number or BigNumber)
      const num = result.toNumeric(toU);

      // Format
      if (typeof num === 'number') {
        return num.toFixed(6).replace(/\.?0+$/, '');
      } else {
        // BigNumber
        return (num as any).toFixed(6).replace(/\.?0+$/, '');
      }
    } catch (e) {
      // console.error("Conversion Warning:", e);
      return '';
    }
  };

  // Set default units on category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setFromUnit(units[category][0]);
    setToUnit(units[category][1]);
  };

  // Recalculate on any change (derived state)
  const result = convert(parseFloat(value), fromUnit, toUnit, activeCategory);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="flex flex-col h-full w-full p-4 overflow-y-auto custom-scrollbar items-center">
      {/* Category Tabs */}
      <div className="flex bg-black/5 p-1 rounded-xl mb-8 overflow-x-auto max-w-full">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? `${theme.accent} text-white shadow-md`
                  : `${theme.text} opacity-60 hover:opacity-100`
              }`}
            >
              <Icon size={16} />
              <span>{cat.id}</span>
            </button>
          );
        })}
      </div>

      <div
        className={`w-full max-w-md p-8 rounded-3xl ${theme.bg} bg-opacity-30 border ${theme.border} relative transition-all duration-300`}
      >
        {/* Input Group */}
        <div className="space-y-6">
          <div className="relative">
            <label className={`block text-xs font-medium mb-1 ${theme.text} opacity-70`}>
              From
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`flex-1 p-3 rounded-xl outline-none text-lg font-mono ${theme.displayBg} ${theme.text} border ${theme.border} focus:ring-2 focus:ring-blue-400`}
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className={`p-3 rounded-xl outline-none ${theme.displayBg} ${theme.text} border ${theme.border} w-[100px] cursor-pointer`}
              >
                {units[activeCategory]?.map((u: string) => (
                  <option key={u} value={u} className="text-black">
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className={`p-2 rounded-full ${theme.buttonBg} ${theme.text} hover:scale-110 transition-transform shadow-lg border ${theme.border}`}
            >
              <ArrowRightLeft size={20} />
            </button>
          </div>

          <div className="relative">
            <label className={`block text-xs font-medium mb-1 ${theme.text} opacity-70`}>To</label>
            <div className="flex gap-2">
              <div
                className={`flex-1 p-3 rounded-xl text-lg font-mono flex items-center ${theme.glass} ${theme.primary} font-bold border ${theme.border}`}
              >
                {isLoading ? <RefreshCw className="animate-spin" size={20} /> : result || '...'}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className={`p-3 rounded-xl outline-none ${theme.displayBg} ${theme.text} border ${theme.border} w-[100px] cursor-pointer`}
              >
                {units[activeCategory]?.map((u: string) => (
                  <option key={u} value={u} className="text-black">
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center opacity-50 text-xs flex flex-col items-center gap-1">
          {activeCategory === 'Currency' && (
            <>
              <span>Rates by Frankfurter API</span>
              {lastUpdated && <span>Updated: {lastUpdated}</span>}
              <button
                onClick={fetchRates}
                className="underline hover:text-white mt-1 flex items-center gap-1"
              >
                <RefreshCw size={10} /> Refresh
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitConverterMode;
