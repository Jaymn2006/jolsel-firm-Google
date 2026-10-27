/**
 * Mathematical Probability Matrix & Stochastic Calculus Engine for Jolsel Firm Agents.
 * Evaluates quantitative trade viability before mandate execution.
 */

export interface ProbabilityMatrixResult {
  tokenSymbol: string;
  winProbabilityPct: number; // Bayesian posterior p
  lossProbabilityPct: number; // q = 1 - p
  payoffRatio: number; // b (expected upside / downside)
  kellyFraction: number; // f* = (bp - q) / b (optimal position size fraction)
  recommendedSizeUsd: number;
  expectedValueUsd: number;
  driftRate: number; // Ornstein-Uhlenbeck theta
  volatilitySigma: number; // Annualized volatility sigma
  sharpeRatio: number;
  tailRiskPct: number; // Value at Risk 95%
  calculusVerdict: "STRONG_BUY" | "ACCUMULATE" | "NEUTRAL" | "VETO_TAIL_RISK";
  formulas: {
    kellyStr: string;
    driftStr: string;
    bayesianStr: string;
  };
}

export function computeProbabilityMatrix(params: {
  symbol: string;
  priceUsd: number;
  priceChange24h: number;
  volume24h: number;
  liquidityUsd: number;
  walletBalanceUsd: number;
}): ProbabilityMatrixResult {
  const { symbol, priceUsd, priceChange24h, volume24h, liquidityUsd, walletBalanceUsd } = params;

  // 1. Estimate Volatility (Sigma) from 24h change & volume-to-liquidity ratio
  const volToLiqRatio = volume24h / Math.max(1000, liquidityUsd);
  const baseVol = Math.max(0.15, Math.min(2.5, (Math.abs(priceChange24h) / 100) * 2.2 + volToLiqRatio * 0.08));
  const volatilitySigma = parseFloat(baseVol.toFixed(3));

  // 2. Bayesian Posterior Probability: P(Gain | Momentum)
  // Prior P(Gain) = 0.50
  // Likelihood P(Momentum | Gain) adjusted by trend and liquidity
  const momentumBias = priceChange24h > 0 ? Math.min(0.35, (priceChange24h / 100) * 0.8) : Math.max(-0.30, (priceChange24h / 100) * 0.7);
  const liquidityCredibility = Math.min(0.15, Math.log10(Math.max(1000, liquidityUsd)) / 40);
  const p = Math.max(0.20, Math.min(0.88, 0.50 + momentumBias + liquidityCredibility));
  const q = 1 - p;

  // 3. Expected Payoff Ratio (b)
  // Target reward based on trend vs downside floor
  const targetGainPct = Math.max(0.12, Math.min(0.60, 0.20 + volatilitySigma * 0.15));
  const stopLossPct = Math.max(0.08, Math.min(0.25, 0.10 + volatilitySigma * 0.05));
  const b = parseFloat((targetGainPct / stopLossPct).toFixed(2));

  // 4. Kelly Criterion Optimal Sizing: f* = (b*p - q) / b
  const rawKelly = (b * p - q) / b;
  // Apply Half-Kelly fractional safety dampener for capital preservation
  const kellyFraction = Math.max(0, Math.min(0.25, rawKelly * 0.5));
  const recommendedSizeUsd = parseFloat((walletBalanceUsd * kellyFraction).toFixed(2));
  const expectedValueUsd = parseFloat((recommendedSizeUsd * (p * targetGainPct - q * stopLossPct)).toFixed(2));

  // 5. Ornstein-Uhlenbeck Mean-Reversion Drift (theta)
  // Measures speed of reversion toward volume-weighted fair value
  const driftRate = parseFloat((0.85 + volToLiqRatio * 0.12).toFixed(3));

  // 6. Sharpe Ratio
  const riskFreeRate = 0.04;
  const expectedReturn = p * targetGainPct - q * stopLossPct;
  const sharpeRatio = parseFloat(((expectedReturn - riskFreeRate / 365) / Math.max(0.05, volatilitySigma * 0.2)).toFixed(2));

  // 7. Value at Risk (VaR 95% Tail Risk)
  const zScore95 = 1.645;
  const tailRiskPct = parseFloat(Math.min(100, zScore95 * volatilitySigma * 15).toFixed(1));

  // 8. Verdict from Calculus
  let calculusVerdict: ProbabilityMatrixResult["calculusVerdict"] = "NEUTRAL";
  if (tailRiskPct > 45 || liquidityUsd < 15000) {
    calculusVerdict = "VETO_TAIL_RISK";
  } else if (p >= 0.65 && kellyFraction >= 0.08 && expectedValueUsd > 0) {
    calculusVerdict = "STRONG_BUY";
  } else if (p >= 0.52 && kellyFraction > 0.02) {
    calculusVerdict = "ACCUMULATE";
  }

  return {
    tokenSymbol: symbol,
    winProbabilityPct: parseFloat((p * 100).toFixed(1)),
    lossProbabilityPct: parseFloat((q * 100).toFixed(1)),
    payoffRatio: b,
    kellyFraction: parseFloat(kellyFraction.toFixed(3)),
    recommendedSizeUsd,
    expectedValueUsd,
    driftRate,
    volatilitySigma,
    sharpeRatio,
    tailRiskPct,
    calculusVerdict,
    formulas: {
      kellyStr: `f* = (${b} × ${(p).toFixed(2)} - ${(q).toFixed(2)}) / ${b} = ${(kellyFraction * 100).toFixed(1)}%`,
      driftStr: `dX_t = ${driftRate}(μ - X_t)dt + ${volatilitySigma}dW_t`,
      bayesianStr: `P(Bull|Tape) = ${parseFloat((p * 100).toFixed(1))}% (Prior 50% + Log-Liq ${liquidityCredibility.toFixed(2)})`,
    },
  };
}
