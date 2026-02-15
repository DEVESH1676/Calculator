import React, { useState, useEffect } from 'react';
import { math, formatResult } from '../../utils/mathConfig';
import HistorySidebar from '../HistorySidebar';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import type { HistoryItem } from '../../store/useCalculatorStore';
import AIChatPanel from '../AIChatPanel';
import {
    History,
    Minimize2,
    Bot,
    MoreHorizontal,
    ArrowUpRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';



const Calculator: React.FC = () => {
    // Global State
    const {
        isGraphOpen,
        toggleGraph,
        setExpression,
        isDegree,
        setIsDegree,
        history,
        addToHistory: addHistoryItem,
        clearHistory: clearHistoryStore,
        isHistoryOpen,
        toggleHistory,
        isAiOpen,
        toggleAi
    } = useCalculatorStore();

    const { theme } = useTheme();

    // Local Calculator State
    const [input, setInput] = useState<string>('0');
    const [result, setResult] = useState<string>('');
    const [isScientific, setIsScientific] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [lastCalculated, setLastCalculated] = useState<boolean>(false);

    useEffect(() => {
        setExpression(input);
    }, [input, setExpression]);

    const addToHistory = (expression: string, resultVal: string) => {
        const newItem: HistoryItem = {
            expression,
            result: resultVal,
            timestamp: Date.now(),
        };
        addHistoryItem(newItem);
    };

    const handleHistorySelect = (item: HistoryItem) => {
        setInput(item.result);
        setResult(`History: ${item.expression} =`);
        setLastCalculated(true);
        toggleHistory(false);
    };

    const handleClearHistory = () => {
        clearHistoryStore();
        localStorage.removeItem('calculator_history');
    };

    const handleExportHistory = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "calculator_history.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleButtonClick = (value: string) => {
        if (error) {
            setError(false);
            if (value === 'AC') {
                setInput('0');
                setResult('');
                return;
            }
            // If error, any other key just ignores or resets? 
            // Standard calc behavior: AC to clear.
            if (!['AC'].includes(value)) {
                setInput(value);
                // Or just return? Let's reset input.
            }
        }

        if (value === 'AC') {
            setInput('0');
            setResult('');
            setError(false);
            return;
        }

        if (value === 'C') {
            setInput(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
            return;
        }

        if (value === '=') {
            calculate();
            return;
        }

        if (lastCalculated && !['AC', 'DEL', '=', 'Deg', 'Rad', 'Sci', 'Basic', 'History'].includes(value)) {
            if (['+', '-', '*', '/', '^', '%'].includes(value)) {
                setLastCalculated(false);
            } else {
                // New number starts new calculation
                setInput(value);
                setLastCalculated(false);
                return;
            }
        }

        // Logic for specific keys
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

            // Replacements for mathjs
            let evalInput = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-')
                .replace(/π/g, 'pi')
                .replace(/√/g, 'sqrt')
                .replace(/e/g, 'e')
                .replace(/log\(/g, 'log10(')
                .replace(/ln\(/g, 'log(');


            const scope: any = {};
            if (isDegree) {
                // Ensure trig functions expect degrees if in Degree mode
                scope.sin = (x: any) => math.sin(math.unit(x, 'deg'));
                scope.cos = (x: any) => math.cos(math.unit(x, 'deg'));
                scope.tan = (x: any) => math.tan(math.unit(x, 'deg'));
            }

            const res = math.evaluate(evalInput, scope);

            const resString = formatResult(res);

            // Handle 'undefined' or NaN
            if (resString === 'NaN' || resString === 'undefined') {
                throw new Error("Invalid Result");
            }

            setResult(resString);
            setInput(resString);
            setLastCalculated(true);
            addToHistory(input, resString);

        } catch {
            setError(true);
            setInput('Error');
            setResult('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const key = e.key;
        if ((/[0-9]/.test(key))) handleButtonClick(key);
        if (key === '.') handleButtonClick('.');
        if (['+', '-', '*', '/'].includes(key)) handleButtonClick(key === '*' ? '×' : key === '/' ? '÷' : key);
        if (key === 'Enter') handleButtonClick('=');
        if (key === 'Backspace') handleButtonClick('C');
        if (key === 'Escape') handleButtonClick('AC');
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [input, lastCalculated, error, isScientific, isDegree, isGraphOpen]);

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add("ripple");

        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    };

    const handleButtonClickFn = (e: React.MouseEvent<HTMLButtonElement>, val: string) => {
        createRipple(e);
        handleButtonClick(val);
    };

    const scientificButtons = [
        'sin', 'cos', 'tan', 'log',
        'ln', '(', ')', '^',
        '√', 'π', 'e', 'deg'
    ];

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
            <div className={`flex flex-col justify-end p-8 pb-4 transition-all duration-300 ${isGraphOpen ? 'h-[35%]' : 'h-[35%] md:h-[45%]'} `}>
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

                <div className="text-right space-y-2">
                    <div className={`text-white/40 text-sm font-mono h-6 transition-opacity ${error ? 'opacity-0' : 'opacity-100'}`}>
                        {result}
                    </div>
                    <input
                        type="text"
                        value={input}
                        readOnly
                        className={`w-full bg-transparent text-right outline-none font-bold text-white transition-all ${isGraphOpen ? 'text-4xl' : 'text-5xl md:text-6xl'} font-mono overflow-x-auto custom-scrollbar`}
                    />
                </div>
            </div>

            {/* Keypad Area */}
            <div className={`flex-1 ${theme.glass} backdrop-blur-2xl rounded-t-[3rem] p-6 shadow-2xl border-t border-white/10 transition-all duration-500`}>
                <div className="flex flex-col h-full">
                    {/* Scientific Row (Collapsible) */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isScientific ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'}`}>
                        <div className="grid grid-cols-6 gap-2">
                            {scientificButtons.map(btn => (
                                <button
                                    key={btn}
                                    onClick={(e) => {
                                        if (btn === 'deg') {
                                            setIsDegree(!isDegree);
                                        } else {
                                            handleButtonClickFn(e, btn);
                                        }
                                    }}
                                    className={`p-2 rounded-xl text-xs font-medium bg-[#0f2027]/50 border border-[#00f5ff]/10 text-[#00f5ff] hover:bg-[#00f5ff]/10 transition-colors ${btn === 'deg' && isDegree ? 'bg-[#00f5ff]/20' : ''}`}
                                >
                                    {btn.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-4 gap-4 flex-1">
                        {standardButtons.map(btn => (
                            <button
                                key={btn.label}
                                onClick={(e) => {
                                    if (btn.val === 'sci') {
                                        setIsScientific(!isScientific);
                                    } else {
                                        handleButtonClickFn(e, btn.val);
                                    }
                                }}
                                className={`
                                    relative overflow-hidden rounded-2xl text-xl font-medium transition-all duration-200
                                    active:scale-95 hover:shadow-lg flex items-center justify-center
                                    ${btn.type === 'equal'
                                        ? 'bg-gradient-to-r from-[#00f5ff] to-[#00d2ff] text-[#0f2027] shadow-[0_0_20px_rgba(0,245,255,0.3)]'
                                        : btn.type === 'operator'
                                            ? 'bg-white/10 text-[#00f5ff] hover:bg-white/15'
                                            : btn.type === 'function'
                                                ? 'bg-white/5 text-white/60 hover:bg-white/10'
                                                : 'bg-white/5 text-white hover:bg-white/10' /* number */
                                    }
                                    ${btn.label === '0' ? 'col-span-1' : ''} 
                                    ${btn.val === 'sci' ? (isScientific ? 'text-[#00f5ff] bg-white/10' : '') : ''}
                                `}
                            >
                                {btn.label === 'Sci' ? <MoreHorizontal size={24} /> : btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebars */}
            <HistorySidebar
                isOpen={isHistoryOpen}
                history={history}
                onClose={() => toggleHistory(false)}
                onSelect={handleHistorySelect}
                onClear={handleClearHistory}
                onExport={handleExportHistory}
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

export default Calculator;
