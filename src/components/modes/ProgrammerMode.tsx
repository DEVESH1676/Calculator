
import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import type { ThemeColors } from '../../theme/themes';

interface InputRowProps {
  label: string;
  val: string;
  radix: number;
  onChange: (val: string, radix: number) => void;
  theme: ThemeColors;
}

const InputRow: React.FC<InputRowProps> = ({ label, val, radix, onChange, theme }) => (
  <div
    className={`p - 3 rounded - xl border ${theme.border} ${theme.bg} bg - opacity - 20 flex items - center gap - 4`}
  >
    <span className={`w - 10 font - bold ${theme.primary} text - sm`}>{label}</span>
    <input
      type="text"
      value={val}
      onChange={(e) => onChange(e.target.value, radix)}
      className="flex-1 bg-transparent outline-none font-mono text-right tracking-wider uppercase text-lg"
    />
  </div>
);

const ProgrammerMode: React.FC = () => {
  const { theme } = useThemeStore();

  // Base value stored as integer
  const [value, setValue] = useState<number>(0);

  // Computed strings
  const [hex, setHex] = useState('0');
  const [dec, setDec] = useState('0');
  const [oct, setOct] = useState('0');
  const [bin, setBin] = useState('0');

  useEffect(() => {
    // Update all fields when value changes
    // Bitwise operations in JS operate on 32-bit signed integers
    // We mask with >>> 0 to treat as unsigned 32-bit for display if needed,
    // but calculator standard usually implies signed or unsigned toggle.
    // We'll stick to standard behavior.

    setHex(value.toString(16).toUpperCase());
    setDec(value.toString(10));
    setOct(value.toString(8));
    setBin(value.toString(2));
  }, [value]);

  const handleInputChange = (val: string, radix: number) => {
    if (val === '') {
      setValue(0);
      return;
    }
    // Clean input based on radix
    let cleanVal = val;
    if (radix === 2) cleanVal = val.replace(/[^0-1]/g, '');
    if (radix === 8) cleanVal = val.replace(/[^0-7]/g, '');
    if (radix === 10) cleanVal = val.replace(/[^0-9-]/g, '');
    if (radix === 16) cleanVal = val.replace(/[^0-9A-Fa-f]/g, '');

    const parsed = parseInt(cleanVal, radix);
    if (!isNaN(parsed)) {
      setValue(parsed);
    }
  };

  const bitwiseOp = (op: string) => {
    switch (op) {
      case 'AND' /* meaningful only with 2 operands, simplistic approach here just acting on current val against a mask? 
                   Standard implementation usually acts as operators input. 
                   For this "Mode" which acts like a converter, maybe we just have immediate ops like NOT, Shift? 
                   */:
        break;
      case 'NOT':
        setValue(~value);
        break;
      case '<<':
        setValue(value << 1);
        break;
      case '>>':
        setValue(value >> 1);
        break;
      case 'CLEAR':
        setValue(0);
        break;
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-6 items-center overflow-y-auto custom-scrollbar">
      <div
        className={`w - full max - w - 2xl grid gap - 4 p - 6 rounded - 3xl ${theme.glass} border ${theme.border} `}
      >
        <InputRow label="HEX" val={hex} radix={16} onChange={handleInputChange} theme={theme} />
        <InputRow label="DEC" val={dec} radix={10} onChange={handleInputChange} theme={theme} />
        <InputRow label="OCT" val={oct} radix={8} onChange={handleInputChange} theme={theme} />
        <InputRow label="BIN" val={bin} radix={2} onChange={handleInputChange} theme={theme} />
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 w-full max-w-2xl">
        {['NOT', '<<', '>>', 'CLEAR'].map((op) => (
          <button
            key={op}
            onClick={() => bitwiseOp(op)}
            className={`p - 4 rounded - xl font - bold transition - all ${theme.buttonBg} ${theme.text} hover: bg - opacity - 80 hover: scale - 105 shadow - lg border ${theme.border} `}
          >
            {op}
          </button>
        ))}
      </div>

      <div className="mt-8 opacity-50 text-xs text-center">
        Currently supports immediate bitwise modifiers.
      </div>
    </div>
  );
};

export default ProgrammerMode;
