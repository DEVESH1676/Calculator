import React, { useState, useEffect, type KeyboardEvent } from 'react';
import { math, formatResult } from '../../utils/mathConfig';
import { cn } from '../../utils/cn';
import HistorySidebar from '../HistorySidebar';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import type { HistoryItem } from '../../store/useCalculatorStore';
import { useHistory } from '../../hooks/useHistory';
import AIChatPanel from '../AIChatPanel';
import { History, Minimize2, Bot, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';
import { useThemeStore } from '../../store/useThemeStore';
import InputDisplay from '../shared/InputDisplay';
import CalculatorButton from '../shared/CalculatorButton';

const StandardMode: React.FC = () => {
  // Global State
  // Global State with granular selectors to prevent re-renders on 'expression' change
  const isGraphOpen = useCalculatorStore((state) => state.isGraphOpen);
  const toggleGraph = useCalculatorStore((state) => state.toggleGraph);
  const setExpression = useCalculatorStore((state) => state.setExpression);
  const isDegree = useCalculatorStore((state) => state.isDegree);
  const setIsDegree = useCalculatorStore((state) => state.setIsDegree);
  const isHistoryOpen = useCalculatorStore((state) => state.isHistoryOpen);
  const toggleHistory = useCalculatorStore((state) => state.toggleHistory);
  const isAiOpen = useCalculatorStore((state) => state.isAiOpen);
  const toggleAi = useCalculatorStore((state) => state.toggleAi);

  const { theme } = useThemeStore();
  const { addToast } = useToastStore();

  // Local Calculator State
  const [input, setInput] = useState<string>('0');
  const [result, setResult] = useState<string>('');
  const [isScientific, setIsScientific] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [lastCalculated, setLastCalculated] = useState<boolean>(false);

  useEffect(() => {
    setExpression(input);
  }, [input, setExpression]);

  const { addHistoryItem } = useHistory();

  const addToHistory = (expression: string, resultVal: string) => {
    addHistoryItem({
      expression,
      result: resultVal,
      module: 'standard',
    });
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setInput(item.result);
    setResult(`History: ${item.expression} =`);
    setLastCalculated(true);
    toggleHistory(false);
  };

  const handleButtonClick = (value: string) => {
    if (error) {
      setError(false);
      if (value === 'AC') {
        setInput('0');
        setResult('');
        return;
      }
      if (!['AC'].includes(value)) {
        setInput(value);
      }
    }

    if (value === 'AC') {
      setInput('0');
      setResult('');
      setError(false);
      return;
    }

    if (value === 'C') {
      setInput((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }

    if (value === '=') {
      calculate();
      return;
    }

    if (
      lastCalculated &&
      !['AC', 'DEL', '=', 'Deg', 'Rad', 'Sci', 'Basic', 'History'].includes(value)
    ) {
      if (['+', '-', '*', '/', '^', '%'].includes(value)) {
        setLastCalculated(false);
      } else {
        setInput(value);
        setLastCalculated(false);
        return;
      }
    }

    switch (value) {
      case 'History':
        toggleHistory(true);
        break;
      case 'Graph':
        toggleGraph(!isGraphOpen);
        break;
      case 'Basic':
      case 'Sci':
        setIsScientific(!isScientific);
        break;
      case 'Deg':
      case 'Rad':
        setIsDegree(!isDegree);
        break;
      case 'sin':
      case 'cos':
      case 'tan':
      case 'log':
      case 'ln':
      case 'sqrt':
        if (input === '0' || lastCalculated) setInput(value + '(');
        else setInput(input + value + '(');
        break;
      case 'x²':
        setInput(input + '^2');
        break;
      case 'xʸ':
        setInput(input + '^');
        break;
      case 'π':
        if (input === '0' || lastCalculated) setInput('pi');
        else setInput(input + 'pi');
        break;
      case 'e':
        if (input === '0' || lastCalculated) setInput('e');
        else setInput(input + 'e');
        break;
      default:
        if (input === '0' && !['.', '+', '-', '*', '/', '^', '%', ')'].includes(value)) {
          setInput(value);
        } else {
          setInput(input + value);
        }
        break;
    }
  };

  const calculate = () => {
    try {
      const expression = input;

      const evalInput = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/π/g, 'pi')
        .replace(/√/g, 'sqrt')
        .replace(/e/g, 'e')
        .replace(/log\(/g, 'log10(')
        .replace(/ln\(/g, 'log(');

      const scope: Record<string, unknown> = {};
      if (isDegree) {
        scope.sin = (x: unknown) => math.sin(math.unit(x as number, 'deg'));
        scope.cos = (x: unknown) => math.cos(math.unit(x as number, 'deg'));
        scope.tan = (x: unknown) => math.tan(math.unit(x as number, 'deg'));
      }

      const res = math.evaluate(evalInput, scope);
      const resString = formatResult(res);

      if (resString === 'NaN' || resString === 'undefined') {
        addToast({ message: 'Invalid Result', type: 'error' });
        throw new Error('Invalid Result');
      }

      setResult(resString);
      setInput(resString);
      setLastCalculated(true);
      addToHistory(input, resString);
    } catch {
      setError(true);
      setInput('Error');
      setResult('');
      addToast({ message: 'Calculation Error', type: 'error' });
    }
  };

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9]/.test(key)) handleButtonClick(key);
      if (key === '.') handleButtonClick('.');
      if (['+', '-', '*', '/'].includes(key))
        handleButtonClick(key === '*' ? '×' : key === '/' ? '÷' : key);
      if (key === 'Enter') handleButtonClick('=');
      if (key === 'Backspace') handleButtonClick('C');
      if (key === 'Escape') handleButtonClick('AC');
    },
    [input, lastCalculated, error, isScientific, isDegree, isGraphOpen]
  );

  useEffect(() => {
    // @ts-ignore
    window.addEventListener('keydown', handleKeyDown);
    // @ts-ignore
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  const handleButtonClickFn = (e: React.MouseEvent<HTMLButtonElement>, val: string) => {
    createRipple(e);
    handleButtonClick(val);
  };

  const scientificButtons = ['sin', 'cos', 'tan', 'log', 'ln', '(', ')', '^', '√', 'π', 'e', 'deg'];

  const standardButtons = [
    { label: 'AC', type: 'function', val: 'AC' },
    { label: 'C', type: 'function', val: 'C' },
    { label: '%', type: 'function', val: '%' },
    { label: '÷', type: 'operator', val: '÷' },
    { label: '7', type: 'number', val: '7' },
    { label: '8', type: 'number', val: '8' },
    { label: '9', type: 'number', val: '9' },
    { label: '×', type: 'operator', val: '×' },
    { label: '4', type: 'number', val: '4' },
    { label: '5', type: 'number', val: '5' },
    { label: '6', type: 'number', val: '6' },
    { label: '−', type: 'operator', val: '−' },
    { label: '1', type: 'number', val: '1' },
    { label: '2', type: 'number', val: '2' },
    { label: '3', type: 'number', val: '3' },
    { label: '+', type: 'operator', val: '+' },
    { label: 'Sci', type: 'function', val: 'sci' },
    { label: '0', type: 'number', val: '0' },
    { label: '.', type: 'number', val: '.' },
    { label: '=', type: 'equal', val: '=' },
  ];

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden">
      {/* Display Area */}
      <div
        className={`flex flex-col justify-end p-8 pb-4 transition-all duration-300 ${isGraphOpen ? 'h-[35%]' : 'h-[35%] md:h-[45%]'}`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => toggleHistory(!isHistoryOpen)}
              className={`p-2 rounded-full ${isHistoryOpen ? 'bg-[#00f5ff]/20 text-[#00f5ff]' : 'bg-white/5 text-white/60'} hover:bg-white/10 transition-colors`}
            >
              <History size={20} />
            </button>
            <button
              onClick={() => toggleAi(!isAiOpen)}
              className={`p-2 rounded-full ${isAiOpen ? 'bg-[#00f5ff]/20 text-[#00f5ff]' : 'bg-white/5 text-white/60'} hover:bg-white/10 transition-colors`}
            >
              <Bot size={20} />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleGraph(!isGraphOpen)}
              className={`p-2 rounded-full ${isGraphOpen ? 'bg-[#00f5ff]/20 text-[#00f5ff]' : 'bg-white/5 text-white/60'} hover:bg-white/10 transition-colors`}
            >
              {isGraphOpen ? <Minimize2 size={20} /> : <ArrowUpRight size={20} />}
            </button>
          </div>
        </div>

        <InputDisplay
          input={input}
          result={result}
          error={error}
          isScientific={isGraphOpen} // Reusing this intentionally for size variant
        />
      </div>

      {/* Keypad Area */}
      <div
        className={`flex-1 ${theme.glass} backdrop-blur-2xl rounded-t-[3rem] p-6 shadow-2xl border-t border-white/10 transition-all duration-500`}
      >
        <div className="flex flex-col h-full">
          {/* Scientific Row (Collapsible) */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isScientific ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'}`}
          >
            <div className="grid grid-cols-6 gap-2">
              {scientificButtons.map((btn) => (
                <CalculatorButton
                  key={btn}
                  label={btn.toUpperCase()}
                  variant="scientific"
                  isActive={btn === 'deg' && isDegree}
                  onClick={(e) => {
                    if (btn === 'deg') {
                      setIsDegree(!isDegree);
                    } else {
                      handleButtonClickFn(e, btn);
                    }
                  }}
                  className="rounded-xl text-xs" // Override base class
                />
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-4 gap-4 flex-1">
            {standardButtons.map((btn) => (
              <CalculatorButton
                key={btn.label}
                label={btn.label === 'Sci' ? <MoreHorizontal size={24} /> : btn.label}
                variant={btn.type as any} // Cast specific type
                isActive={btn.val === 'sci' && isScientific}
                onClick={(e) => {
                  if (btn.val === 'sci') {
                    setIsScientific(!isScientific);
                  } else {
                    handleButtonClickFn(e, btn.val);
                  }
                }}
                className={cn(
                  btn.label === '0' ? 'col-span-1' : '',
                  // Special handling for Sci button active state visual override if needed, 
                  // but variant='scientific' logic handles isActive
                  btn.val === 'sci' && isScientific ? 'text-[#00f5ff] bg-white/10' : ''
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sidebars */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => toggleHistory(false)}
        onSelect={handleHistorySelect}
      />

      {isAiOpen && (
        <div className="absolute top-20 left-4 z-50 w-80 h-[400px] shadow-2xl animate-fade-in-up">
          <AIChatPanel />
        </div>
      )}

      <style>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          background-color: rgba(255, 255, 255, 0.3);
        }
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default StandardMode;
