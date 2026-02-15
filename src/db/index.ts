import Dexie, { type Table } from 'dexie';

export interface CalculationHistory {
    id?: number;
    expression: string;
    result: string;
    timestamp: number;
    module: 'standard' | 'scientific' | 'financial' | 'programmer' | 'unit';
    metadata?: Record<string, any>;
}

export interface CurrencyCache {
    id: string; // 'latest'
    rates: Record<string, number>;
    base: string;
    timestamp: number;
}

export interface UserSettings {
    id: string; // 'global'
    theme: string;
    precision: number;
    isDegree: boolean;
}

class ModCalcDB extends Dexie {
    history!: Table<CalculationHistory, number>;
    currency!: Table<CurrencyCache, string>;
    settings!: Table<UserSettings, string>;

    constructor() {
        super('ModCalcDB');
        this.version(1).stores({
            history: '++id, timestamp, module',
            currency: 'id',
            settings: 'id'
        });
    }
}

export const db = new ModCalcDB();
