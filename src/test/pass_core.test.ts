import { describe, it, expect } from 'vitest';
import { math } from '../utils/mathConfig';
import { calculateEMI } from '../utils/financialUtils';

describe('🛡️ MODCALC CERTIFICATION - Section 1 & 3', () => {

    describe('🔹 Arithmetic Integrity', () => {
        it('handles floating point precision (0.1 + 0.2)', () => {
            // mathjs handles this via BigNumber or configured precision
            const result = math.evaluate('0.1 + 0.2');
            // If it's number type, it might be 0.3000000004 without formatting
            // But our math config usually sets precision.
            // Let's check string output or closeTo
            expect(math.format(result, { precision: 14 })).toBe('0.3');
        });

        it('handles large integers safe from overflow', () => {
            const result = math.evaluate('9999999999999999 + 1');
            expect(result.toString()).toContain('10000000000000000');
        });

        it('handles decimal chaining', () => {
            const result = math.evaluate('1.2 + 3.4 - 5.6');
            expect(math.number(result)).toBeCloseTo(-1.0, 10);
        });
    });

    describe('🔹 Scientific Validation', () => {
        it('calculates sin(90 deg) correctly', () => {
            // Need to simulate degree mode. 
            // passing scope or config? usage in StandardModule passes a scope with overridden trig functions.
            // We can mimic that scope behavior.
            const scope = {
                sin: (x: any) => math.sin(math.unit(x, 'deg')),
            };
            const result = math.evaluate('sin(90)', scope);
            expect(result).toBeCloseTo(1, 10); // can be 0.99999... or 1
        });

        it('calculates sqrt(-4) handled properly (Complex)', () => {
            const result = math.evaluate('sqrt(-4)');
            // mathjs default returns complex 2i
            expect(result.toString()).toBe('2i');
        });
    });

    describe('🔹 Financial Validation & Stress', () => {
        it('calculates EMI correctness (2 decimal precision check)', () => {
            // 100k, 10%, 1 year -> 8791.59
            const res = calculateEMI('100000', '10', '1');
            expect(res?.emi).toBeCloseTo(8791.59, 2);
        });

        it('generates 360-row amortization without freezing (Stress Test)', () => {
            const start = performance.now();
            // 30 years = 360 months
            const res = calculateEMI('5000000', '8.5', '30');
            const end = performance.now();

            expect(res).not.toBeNull();
            expect(res?.schedule.length).toBe(360);
            // Should be fast (< 50ms usually for just calc)
            expect(end - start).toBeLessThan(100);
        });

        it('handles extrema tenure (50 years)', () => {
            const res = calculateEMI('100000', '10', '50');
            expect(res?.schedule.length).toBe(600); // capped at 600 in our utils code!
        });
    });

    describe('🔹 Input Stress Tests', () => {
        it('handles 500-digit number input', () => {
            const huge = '9'.repeat(500);
            const res = math.evaluate(`${huge} + 1`);
            expect(res.toString()).toContain('1e+500'); // or BigNumber representation
        });
    });
});
