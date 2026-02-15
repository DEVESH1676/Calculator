
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, MessageSquare } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useCalculatorStore } from '../store/useCalculatorStore';

interface AIChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  formula?: string;
  explanation?: string;
  isTyping?: boolean;
}

const calculateResult = (text: string): AIChatMessage => {
  const percentageRegex = /(\d+(?:\.\d+)?)%\s+(?:of\s+)?(\d+(?:\.\d+)?)/i;
  const compoundInterestRegex =
    /(\d+(?:\.\d+)?(?:k|m)?)\s+(?:at|@)\s+(\d+(?:\.\d+)?)%\s+(?:for\s+)?(\d+)\s+years/i;
  const bmiRegex = /bmi(?:.*?)(\d+(?:\.\d+)?)\s*kg(?:.*?)(\d+(?:\.\d+)?)\s*cm/i;

  // Percentage
  if (percentageRegex.test(text)) {
    const match = text.match(percentageRegex)!;
    const percent = parseFloat(match[1]);
    const number = parseFloat(match[2]);
    const result = (number * percent) / 100;
    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: `${percent}% of ${number} is ${result.toFixed(2)} `,
      formula: `${number} * (${percent}/100)`,
      explanation: `To find ${percent}% of ${number}, multiply ${number} by ${percent / 100}.`,
    };
  }

  // Compound Interest
  if (compoundInterestRegex.test(text)) {
    const match = text.match(compoundInterestRegex)!;
    const initialStr = match[1].toLowerCase();
    let initial = parseFloat(initialStr);
    if (initialStr.includes('k')) initial *= 1000;
    if (initialStr.includes('m')) initial *= 1000000;

    const rate = parseFloat(match[2]);
    const years = parseInt(match[3]);
    const result = initial * Math.pow(1 + rate / 100, years);

    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: `Compound interest on ${initial.toLocaleString()} at ${rate}% for ${years} years is ${result.toLocaleString(undefined, { maximumFractionDigits: 2 })} `,
      formula: `${initial} * (1 + ${rate}/100)^ ${years} `,
      explanation: `Using formula A = P(1 + r / n) ^ nt.Principal=${initial}, Rate = ${rate}%, Time = ${years} years.`,
    };
  }

  // BMI
  if (bmiRegex.test(text)) {
    const match = text.match(bmiRegex)!;
    const weight = parseFloat(match[1]);
    const heightCm = parseFloat(match[2]);
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 24.9) category = 'Normal weight';
    else if (bmi < 29.9) category = 'Overweight';
    else category = 'Obesity';

    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: `BMI is ${bmi.toFixed(1)} (${category})`,
      formula: `${weight} / (${heightM})^2`,
      explanation: `BMI = Weight(kg) / Height(m)². ${weight} / ${heightM}² = ${bmi.toFixed(1)}.`,
    };
  }

  return {
    id: Date.now().toString(),
    sender: 'bot',
    text: "I didn't understand that. Try '45% of 380', '10k at 7% for 5 years', or 'BMI 70kg 175cm'.",
  };
};

const AIChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hi! Ask me things like '5% of 200' or 'BMI 70kg 175cm'.",
      isTyping: false,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: AIChatMessage = { id: Date.now().toString(), sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Simulate thinking delay
    setTimeout(() => {
      const botMsg = calculateResult(userMsg.text);
      botMsg.isTyping = true;
      setMessages((prev) => [...prev, botMsg]);

      // Reveal effect duration logic could go here, but for now we just show it.
      // We'll use a simple CSS animation for reveal in the render.
      // To strictly follow "step-by-step reveal", we can use a separate state or effect,
      // but let's stick to a clean CSS typing effect for simplicity and robustness first.

      // Remove typing flag after a short delay to "finish" typing
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsg.id ? { ...m, isTyping: false } : m))
        );
      }, 1500);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[85%] text-sm ${message.sender === 'user'
                ? 'bg-[#00f5ff]/20 text-white rounded-tr-sm'
                : 'bg-white/10 text-white/90 rounded-tl-sm border border-white/5'
                }`}
            >
              {message.isTyping ? (
                <div className="flex space-x-1 h-5 items-center px-2">
                  <div
                    className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  ></div>
                </div>
              ) : (
                <span>{message.text}</span>
              )}
            </div>

            {!message.isTyping && message.formula && message.sender === 'bot' && (
              <div className="mt-1 ml-2 text-xs text-[#00f5ff]/80 font-mono animate-fade-in">
                Formula: {message.formula}
              </div>
            )}
            {!message.isTyping && message.explanation && message.sender === 'bot' && (
              <div
                className="mt-1 ml-2 text-xs text-white/50 animate-fade-in"
                style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
              >
                {message.explanation}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask AI..."
            className="w-full bg-black/20 text-white text-sm rounded-xl pl-3 pr-10 py-2.5 outline-none focus:ring-1 focus:ring-[#00f5ff]/50 border border-white/5 transition-all placeholder:text-white/20"
          />
          <Sparkles className="absolute right-3 top-2.5 text-[#00f5ff]/70 w-4 h-4" />
        </div>
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-2.5 bg-[#00f5ff]/20 hover:bg-[#00f5ff]/30 text-[#00f5ff] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default AIChatPanel;
