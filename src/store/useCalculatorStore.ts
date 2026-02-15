import { create } from 'zustand';
import type { CalculatorMode } from '../components/Layout/MainLayout';

export interface HistoryItem {
    expression: string;
    result: string;
    timestamp: number;
}

interface CalculatorState {
    activeMode: CalculatorMode;
    isGraphOpen: boolean;
    isHistoryOpen: boolean;
    isAiOpen: boolean;
    isDegree: boolean;
    expression: string;
    history: HistoryItem[];

    // Actions
    setActiveMode: (mode: CalculatorMode) => void;
    toggleGraph: (isOpen: boolean) => void;
    toggleHistory: (isOpen: boolean) => void;
    toggleAi: (isOpen: boolean) => void;
    setIsDegree: (isDegree: boolean) => void;
    setExpression: (expr: string) => void;
    addToHistory: (item: HistoryItem) => void;
    clearHistory: () => void;
    setHistory: (items: HistoryItem[]) => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
    activeMode: 'standard',
    isGraphOpen: false,
    isHistoryOpen: false,
    isAiOpen: false,
    isDegree: true,
    expression: '',
    history: [],

    setActiveMode: (mode) => set({ activeMode: mode }),
    toggleGraph: (isOpen) => set({ isGraphOpen: isOpen }),
    toggleHistory: (isOpen) => set({ isHistoryOpen: isOpen }),
    toggleAi: (isOpen) => set({ isAiOpen: isOpen }),
    setIsDegree: (isDegree) => set({ isDegree: isDegree }),
    setExpression: (expr) => set({ expression: expr }),

    addToHistory: (item) => set((state) => ({
        history: [item, ...state.history].slice(0, 50)
    })),

    clearHistory: () => set({ history: [] }),
    setHistory: (items) => set({ history: items }),
}));
