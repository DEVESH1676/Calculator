import { create, all } from 'mathjs';
import type { ConfigOptions } from 'mathjs';

// Configure math.js for BigNumber precision
const config: ConfigOptions = {
  epsilon: 1e-60,
  matrix: 'Matrix',
  number: 'BigNumber', // Default type for numbers
  precision: 64, // Significant digits for BigNumbers
  predictable: false,
  randomSeed: null,
};

export const math = create(all, config);

/**
 * Formats a mathjs result (BigNumber, Unit, etc.) into a clean string.
 * Removes unnecessary trailing zeros and handles scientific notation for very large/small numbers.
 */
export const formatResult = (value: any): string => {
  if (value === null || value === undefined) return '';

  // math.format handles BigNumbers nicely with the configured precision
  // 'auto' style usually works best, but we can tweak 'fixed' or 'exponential'
  const formatted = math.format(value, {
    precision: 14, // Display precision (lower than internal calculation precision)
    lowerExp: -9,
    upperExp: 15,
  });

  // Remove surrounding quotes if result is a string (rare with this config but possible)
  if (typeof formatted === 'string' && formatted.startsWith('"') && formatted.endsWith('"')) {
    return formatted.slice(1, -1);
  }

  return formatted;
};
