import { describe, it, expect } from 'vitest';
import { calculateEMI, calculateSIP, calculateCAGR } from '../utils/financialUtils';

describe('Financial Utils', () => {
    describe('calculateEMI', () => {
        it('should calculate EMI correctly for standard input', () => {
            // P=100000, R=10, T=1 year
            // EMI should be around 8791.59
            const result = calculateEMI('100000', '10', '1');
            expect(result).not.toBeNull();
            expect(result?.emi).toBeCloseTo(8791.59, 2);
            expect(result?.totalAmount).toBeCloseTo(105499.08, 1); // 8791.59 * 12
        });

        it('should handle invalid inputs gracefully', () => {
            expect(calculateEMI('', '10', '1')).toBeNull();
        });
    });

    describe('calculateSIP', () => {
        it('should calculate SIP returns correctly', () => {
            // P=5000, R=12%, T=10 years
            // Invested = 6,00,000
            // Expected Value = ~11,61,695.38 (assuming monthly compounding end of period logic or similar)
            // Our logic: P * ((1+i)^n - 1)/i * (1+i) (Investment at START of month?)
            // Let's verify against standard calculator.
            // 5000 * 12 * 10 = 600000 invested.

            const result = calculateSIP('5000', '12', '10');
            expect(result).not.toBeNull();
            expect(result?.invested).toBe(600000);
            expect(result?.totalAmount).toBeGreaterThan(1100000); // Rough check
        });
    });

    describe('calculateCAGR', () => {
        it('should calculate CAGR correctly', () => {
            // BV=1000, EV=2000, T=5
            // (2)^(1/5) - 1 = 1.148... - 1 = 14.87%
            const result = calculateCAGR('1000', '2000', '5');
            expect(result).not.toBeNull();
            expect(result?.cagr).toBeCloseTo(0.1487, 3);
        });

        it('should handle zero tenure gracefully', () => {
            expect(calculateCAGR('1000', '2000', '0')).toBeNull();
        });
    });

    describe('Regression Tests (Security Patches)', () => {
        it('should return null for Zero Tenure in EMI', () => {
            expect(calculateEMI('10000', '10', '0')).toBeNull();
        });

        it('should return null for Negative Investment in SIP', () => {
            expect(calculateSIP('-5000', '10', '5')).toBeNull();
        });

        it('should handle 0% Interest in SIP as linear growth', () => {
            // P=5000, R=0%, T=1 year (12 months)
            // Should just be 5000 * 12 = 60000
            const result = calculateSIP('5000', '0', '1');
            expect(result).not.toBeNull();
            expect(result?.totalAmount).toBe(60000);
            expect(result?.totalInterest).toBe(0);
        });
    });
});
