import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    precision: number;
    isDegree: boolean;
    setPrecision: (precision: number) => void;
    toggleDegree: () => void;
    setDegree: (isDegree: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            precision: 8,
            isDegree: true, // Default to Degree
            setPrecision: (precision) => set({ precision }),
            toggleDegree: () => set((state) => ({ isDegree: !state.isDegree })),
            setDegree: (isDegree) => set({ isDegree }),
        }),
        {
            name: 'calculator-settings', // unique name
            // We rely on localStorage for simple settings for now, easier than async IndexedDB for synchronous UI state
        }
    )
);
