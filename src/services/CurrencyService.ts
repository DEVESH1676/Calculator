import { db } from '../db';

const API_URL = 'https://api.exchangerate-api.com/v4/latest/';
const CACHE_TTL = 3600 * 1000; // 1 hour

export const CurrencyService = {
  async getRates(base: string = 'USD'): Promise<Record<string, number>> {
    try {
      // Check cache
      const cached = await db.currency.get('latest');
      const now = Date.now();

      if (cached && cached.base === base && (now - cached.timestamp < CACHE_TTL)) {
        return cached.rates;
      }

      // Fetch new
      const response = await fetch(`${API_URL}${base}`);
      if (!response.ok) throw new Error('Failed to fetch rates');

      const data = await response.json();
      const rates = data.rates;

      // Update cache
      await db.currency.put({
        id: 'latest',
        base,
        rates,
        timestamp: now,
      });

      return rates;
    } catch (error) {
      console.error('Currency Fetch Error:', error);
      // Fallback to cache if available even if expired, or empty
      const cached = await db.currency.get('latest');
      return cached ? cached.rates : {};
    }
  }
};
