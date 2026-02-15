import { describe, it, expect } from 'vitest';
import { convertUnit } from '../utils/unitUtils';

describe('Unit Utils', () => {
    describe('convertUnit - Length/Weight', () => {
        it('should convert length correctly', () => {
            // 1 km = 1000 m
            expect(convertUnit(1, 'km', 'm', 'Length')).toBe('1000');
        });

        it('should convert weight correctly', () => {
            // 1 kg = 1000 g
            expect(convertUnit(1, 'kg', 'g', 'Weight')).toBe('1000');
        });

        it('should handle zero', () => {
            expect(convertUnit(0, 'm', 'cm', 'Length')).toBe('0');
        });
    });

    describe('convertUnit - Temperature', () => {
        it('should convert celsius to fahrenheit', () => {
            // 0 C = 32 F
            expect(convertUnit(0, 'Celsius', 'Fahrenheit', 'Temperature')).toBe('32');
        });

        it('should convert kelvin to celsius', () => {
            // 273.15 K = 0 C
            // Using closeTo because of float precision potentially
            expect(Number(convertUnit(273.15, 'Kelvin', 'Celsius', 'Temperature'))).toBeCloseTo(0, 1);
        });
    });

    describe('convertUnit - Currency', () => {
        const mockRates = {
            USD: 1,
            EUR: 0.85,
            GBP: 0.75,
        };

        it('should convert currency using rates', () => {
            // 100 USD to EUR => 100 / 1 * 0.85 = 85
            expect(convertUnit(100, 'USD', 'EUR', 'Currency', mockRates)).toBe('85.00');
        });

        it('should convert cross currency', () => {
            // 85 EUR to GBP
            // 85 / 0.85 * 0.75 = 100 * 0.75 = 75
            expect(convertUnit(85, 'EUR', 'GBP', 'Currency', mockRates)).toBe('75.00');
        });

        it('should return placeholder if no rates', () => {
            expect(convertUnit(100, 'USD', 'EUR', 'Currency', null)).toBe('...');
        });
    });
});
