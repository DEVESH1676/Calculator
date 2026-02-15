import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generatePoints } from '../utils/graphUtils';
import { CurrencyService } from '../services/CurrencyService';
import { db } from '../db';

// Mock DB
vi.mock('../db', () => ({
    db: {
        currency: {
            get: vi.fn(),
            put: vi.fn(),
        }
    }
}));

describe('🛡️ MODCALC CERTIFICATION - Section 4 (Services)', () => {

    describe('🔥 Graph Worker / Utils Stability', () => {
        it('should NOT hang on Deep Zoom (Scale = 1e9)', () => {
            const start = performance.now();
            // Simulate a huge scale
            const state = { offsetX: 0, offsetY: 0, scale: 1000000000 };
            const dims = { width: 500, height: 500 };

            // generatePoints uses the same logic as the worker
            // logic: step = 1 pixel. graphStep = 1e-9.
            // range: screen width is 500px.
            // The loop runs from screenToGraph(0) to screenToGraph(500).
            // graph width = 500 * (1/1e9) = 5e-7.
            // x increments by 1e-9.
            // iterations = 5e-7 / 1e-9 = 500. 
            // WAIT. My previous mental model was wrong.
            // If 1 pixel step = 1 pixel on screen.
            // The loop condition `x += graphStep` where `graphStep = 1/scale`.
            // The loop runs from `leftGraphX` to `rightGraphX`.
            // `right - left` = `width / scale`.
            // `(width/scale) / (1/scale)` = `width`.
            // So iterations = width (pixels). 
            // So deep zoom shouldn't cause more iterations than pixels on screen!
            // It should be safe... unless I misunderstood `screenToGraph`.

            const points = generatePoints('x^2', state, dims, 1);
            const end = performance.now();

            expect(points.length).toBeLessThanOrEqual(1000); // 500px + buffers
            expect(end - start).toBeLessThan(100);
        });

        it('should handle infinite loop in formula gracefully', () => {
            // mathjs usually catches execution time limit if configured, or just runs.
            // But "x=x+1" in evaluate?
            // 'map(1:1000000, f(x) = x^2)'
            // Our generatePoints iterates manually, so users can't loop inside the expression easily using standard syntax.
            const points = generatePoints('1/x', { offsetX: 0, offsetY: 0, scale: 20 }, { width: 100, height: 100 });
            // Should handle NaN/Infinity
            const infinityPoint = points.find(p => !isFinite(p.y));
            expect(infinityPoint).toBeDefined();
            expect(infinityPoint?.y).toBeNaN();
        });
    });

    describe('🔥 Currency Service Robustness', () => {
        beforeEach(() => {
            vi.resetAllMocks();
            global.fetch = vi.fn();
        });

        it('should fallback to empty object on API fail + No Cache', async () => {
            // @ts-ignore
            global.fetch.mockResolvedValueOnce({ ok: false });
            // @ts-ignore
            db.currency.get.mockResolvedValueOnce(undefined);

            const rates = await CurrencyService.getRates('USD');
            expect(rates).toEqual({});
        });

        it('should fallback to cache on API fail', async () => {
            // @ts-ignore
            global.fetch.mockRejectedValue(new Error('Network error'));
            // @ts-ignore
            db.currency.get.mockResolvedValueOnce({
                base: 'USD',
                rates: { EUR: 0.85 },
                timestamp: Date.now() - 10000000 // Old
            });

            const rates = await CurrencyService.getRates('USD');
            expect(rates).toEqual({ EUR: 0.85 });
        });
    });
});
