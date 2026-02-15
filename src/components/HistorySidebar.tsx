import React, { useEffect, useState } from 'react';

interface HistoryItem {
    expression: string;
    result: string;
    timestamp: number;
}

interface HistorySidebarProps {
    isOpen: boolean;
    history: HistoryItem[];
    onClose: () => void;
    onSelect: (item: HistoryItem) => void;
    onClear: () => void;
    onExport: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
    isOpen,
    history,
    onClose,
    onSelect,
    onClear,
    onExport,
}) => {
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 h-full w-[85%] md:w-[30%] bg-[#0f2027]/95 backdrop-blur-2xl border-l border-[#00f5ff]/20 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full p-6 text-white">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00f5ff]">
                            History
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={onExport}
                            className="flex-1 py-2 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00f5ff]/50 hover:bg-[#00f5ff]/10 transition-all text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <span>Export JSON</span>
                        </button>
                        <button
                            onClick={onClear}
                            className="flex-1 py-2 px-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all text-sm font-medium"
                        >
                            Clear
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {history.length === 0 ? (
                            <div className="text-center text-white/30 mt-10">
                                No history yet
                            </div>
                        ) : (
                            history.map((item, index) => (
                                <div
                                    key={item.timestamp}
                                    onClick={() => onSelect(item)}
                                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#00f5ff]/50 hover:bg-white/10 cursor-pointer transition-all group animate-fade-in-up"
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animationFillMode: 'backwards',
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs text-white/40 font-mono">
                                            {new Date(item.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="text-right text-white/70 text-sm mb-1 font-mono break-all">
                                        {item.expression}
                                    </div>
                                    <div className="text-right text-xl font-semibold text-[#00f5ff] group-hover:text-white transition-colors break-all">
                                        = {item.result}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default HistorySidebar;
