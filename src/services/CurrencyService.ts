export interface CurrencyRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

const CACHE_KEY = 'calculator_currency_rates';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Fallback rates if API fails completely
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.75,
  INR: 83.5,
  JPY: 145.0,
  AUD: 1.5,
  CAD: 1.35,
  CHF: 0.88,
  CNY: 7.2,
  AED: 3.67,
};

export const CurrencyService = {
  async getRates(base: string = 'USD'): Promise<CurrencyRates> {
    // 1. Check Cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp, data } = JSON.parse(cached);
        const now = Date.now();
        if (now - timestamp < CACHE_DURATION && data.base === base) {
          console.log('Using cached currency rates');
          return data;
        }
      } catch (e) {
        console.warn('Invalid cache', e);
        localStorage.removeItem(CACHE_KEY);
      }
    }

    // 2. Fetch from API
    try {
      console.log('Fetching fresh currency rates...');
      // Free API: https://www.frankfurter.app/docs/
      const response = await fetch(`https://api.frankfurter.app/latest?from=${base}`);

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Normalize data structure if needed (frankfurter returns { amount: 1, base: 'USD', date: '...', rates: { ... } })
      const rates: CurrencyRates = {
        base: data.base,
        date: data.date,
        rates: { ...data.rates, [base]: 1 }, // Ensure base is included
      };

      // 3. Update Cache
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data: rates,
        })
      );

      return rates;
    } catch (error) {
      console.error('Failed to fetch rates, using fallback.', error);

      // 4. Return Fallback
      return {
        base: 'USD',
        date: new Date().toISOString().split('T')[0],
        rates: FALLBACK_RATES,
      };
    }
  },

  getAvailableCurrencies(): string[] {
    return Object.keys(FALLBACK_RATES);
  },
};
