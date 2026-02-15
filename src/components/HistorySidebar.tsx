import React, { useEffect, useState } from 'react';
import { X, Clock, Trash2, Download } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useCalculatorStore } from '../store/useCalculatorStore';
import type { HistoryItem } from '../store/useCalculatorStore';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const { history, clearHistory } = useCalculatorStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleExport = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'calculator_history.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`absolute top-0 right-0 h-full w-80 ${theme.glass} backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out z-20 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className={`text-lg font-bold ${theme.text} flex items-center gap-2`}>
          <Clock size={20} /> History
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className={`p-2 rounded-lg hover:bg-white/10 ${theme.text} transition-colors`}
            title="Export History"
          >
            <Download size={18} />
          </button>
          <button
            onClick={clearHistory}
            className={`p-2 rounded-lg hover:bg-white/10 ${theme.text} transition-colors`}
            title="Clear History"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-white/10 ${theme.text} transition-colors`}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {history.length === 0 ? (
          <div className={`text-center py-10 opacity-50 ${theme.text}`}>No history yet</div>
        ) : (
          history.map((item, index) => (
            <div
              key={item.timestamp + index}
              onClick={() => onSelect(item)}
              className={`p-3 rounded-xl bg-black/20 hover:bg-black/30 cursor-pointer transition-all border border-white/5 group`}
            >
              <div className={`text-right text-sm opacity-60 mb-1 ${theme.text} font-mono`}>
                {item.expression} =
              </div>
              <div className={`text-right text-xl font-bold ${theme.primary} font-mono`}>
                {item.result}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
