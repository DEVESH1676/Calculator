import { useLiveQuery } from 'dexie-react-hooks';
import { db, type CalculationHistory } from '../db';
import { useCallback } from 'react';

export const useHistory = () => {
    const history = useLiveQuery(() => db.history.orderBy('timestamp').reverse().toArray());

    const addHistoryItem = useCallback(async (item: Omit<CalculationHistory, 'id' | 'timestamp'>) => {
        try {
            await db.history.add({
                ...item,
                timestamp: Date.now(),
            });
        } catch (error) {
            console.error('Failed to add to history:', error);
        }
    }, []);

    const clearHistory = useCallback(async () => {
        try {
            await db.history.clear();
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    }, []);

    return {
        history,
        addHistoryItem,
        clearHistory,
    };
};
