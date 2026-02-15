import { math } from './mathConfig';

// Unit Mapping for mathjs
export const unitMap: Record<string, string> = {
    Celsius: 'degC',
    Fahrenheit: 'degF',
    Kelvin: 'K',
    mile: 'mi',
};

export const getMathUnit = (u: string) => unitMap[u] || u;

export const convertUnit = (val: number, from: string, to: string, cat: string, currencyRates?: Record<string, number> | null) => {
    if (isNaN(val)) return '';
    if (from === to) return val.toString();

    if (cat === 'Currency') {
        if (!currencyRates) return '...';

        // Convert From -> USD -> To
        try {
            const amount = math.bignumber(val);
            const rateFrom = math.bignumber(currencyRates[from] || 1);
            const rateTo = math.bignumber(currencyRates[to] || 1);

            // Value (From) / Rate(From) = Value (USD)
            // Value (USD) * Rate(To) = Value (To)
            // Wait, standard quotes are usually 1 USD = X Unit.
            // So if I have 100 EUR. 1 USD = 0.9 EUR.
            // 100 EUR / 0.9 = 111 USD.
            // Then if 1 USD = 140 JPY.
            // 111 USD * 140 = 15540 JPY.
            // Formula: val / rateFrom * rateTo.
            // My previous logic was: amount.div(rateFrom).mul(rateTo).
            // That seems correct assuming rates are "Units per USD".

            const result = amount.div(rateFrom).mul(rateTo);
            return result.toFixed(2);
        } catch {
            return '';
        }
    }

    try {
        const fromU = getMathUnit(from);
        const toU = getMathUnit(to);

        const unitValue = math.unit(math.bignumber(val), fromU);
        const result = unitValue.to(toU);

        const num = result.toNumeric(toU);

        if (typeof num === 'number') {
            return num.toFixed(6).replace(/\.?0+$/, '');
        } else {
            return (num as unknown as { toFixed: (n: number) => string })
                .toFixed(6)
                .replace(/\.?0+$/, '');
        }
    } catch (e) {
        return '';
    }
};
