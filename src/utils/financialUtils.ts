import { math } from './mathConfig';
import type { AmortizationItem } from '../modules/financial/components/AmortizationTable';
import type { ChartData } from '../modules/financial/components/FinancialChart';

export const calculateEMI = (principal: string, rate: string, tenure: string) => {
    if (!principal || !rate || !tenure) return null;

    try {
        const P = math.bignumber(principal);
        const R = math.bignumber(rate).div(100); // Annual rate
        const T = math.bignumber(tenure);

        // Security Patch: Prevent division by zero and illogical values
        if (T.equals(0) || R.equals(0)) return null;

        const r = R.div(12); // Monthly rate
        const n = T.mul(12); // Months

        // E = P * r * (1+r)^n / ((1+r)^n - 1)
        const scope = { P, r, n };
        const EMI = math.evaluate('P * r * (1 + r)^n / ((1 + r)^n - 1)', scope);

        const totalAmount = EMI.mul(n);
        const totalInterest = totalAmount.sub(P);

        // Generate Schedule
        const schedule: AmortizationItem[] = [];
        let balance = P;
        const monthlyRate = r.toNumber();

        // Limit iterations to prevent freezing on huge inputs, e.g. 50 years max
        const months = Math.min(n.toNumber(), 600);

        for (let i = 1; i <= months; i++) {
            const interest = balance.mul(monthlyRate);
            const principalPart = EMI.sub(interest);
            balance = balance.sub(principalPart);

            // Fix negative small balance at end due to precision
            if (i === months && balance.lessThan(0)) balance = math.bignumber(0);
            if (balance.lessThan(0)) balance = math.bignumber(0);

            schedule.push({
                month: i,
                principal: principalPart.toFixed(2),
                interest: interest.toFixed(2),
                balance: balance.toFixed(2),
            });
        }

        return {
            emi: EMI.toNumber(),
            totalInterest: totalInterest.toNumber(),
            totalAmount: totalAmount.toNumber(),
            schedule,
        };
    } catch (e) {
        console.error('EMI Error', e);
        return null;
    }
};

export const calculateSIP = (investment: string, rate: string, years: string) => {
    if (!investment || !rate || !years) return null;

    try {
        const P = math.bignumber(investment);
        const R = math.bignumber(rate).div(100);
        const T = math.bignumber(years);

        const i = R.div(12); // Monthly rate
        const n = T.mul(12); // Months

        const scope = { P, i, n };
        const FutureValue = math.evaluate('P * ((1 + i)^n - 1) / i * (1 + i)', scope);
        const InvestedAmount = P.mul(n);
        const TotalInterest = FutureValue.sub(InvestedAmount);

        // Generate Yearly Data for Chart
        const chartData: ChartData[] = [];
        const yearsNum = T.toNumber();

        for (let y = 0; y <= yearsNum; y++) {
            const months = y * 12;
            if (y === 0) {
                chartData.push({ year: y, invested: 0, value: 0 });
                continue;
            }

            const loopScope = { P, i, months };
            const fv = math.evaluate('P * ((1 + i)^months - 1) / i * (1 + i)', loopScope);

            // Invested = P * months
            const inv = P.mul(months);

            chartData.push({
                year: y,
                invested: inv.toNumber(),
                value: fv.toNumber(),
            });
        }

        return {
            totalInterest: TotalInterest.toNumber(),
            totalAmount: FutureValue.toNumber(),
            invested: InvestedAmount.toNumber(),
            chartData,
        };
    } catch (e) {
        console.error('SIP Error', e);
        return null;
    }
};

export const calculateCAGR = (beginningValue: string, endingValue: string, years: string) => {
    if (!beginningValue || !endingValue || !years) return null;

    try {
        const BV = math.bignumber(beginningValue);
        const EV = math.bignumber(endingValue);
        const T = math.bignumber(years);

        // Security Patch: Prevent division by zero and illogical values
        if (T.equals(0) || BV.equals(0)) return null;

        const CAGR = math.evaluate('(EV / BV)^(1/T) - 1', { BV, EV, T });

        // Generate Chart Data (Exponential growth curve)
        const chartData: ChartData[] = [];
        const yearsNum = T.toNumber();
        const bvNum = BV.toNumber();
        const cagrNum = CAGR.toNumber();

        for (let y = 0; y <= yearsNum; y++) {
            // Val = BV * (1 + CAGR)^y
            const val = bvNum * Math.pow(1 + cagrNum, y);
            chartData.push({
                year: y,
                invested: bvNum, // Initial investment stays constant
                value: val,
            });
        }

        return {
            cagr: CAGR.toNumber(),
            chartData,
        };
    } catch (e) {
        console.error('CAGR Error', e);
        return null;
    }
};
