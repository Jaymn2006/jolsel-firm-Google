import test from "node:test";
import assert from "node:assert/strict";
import { computeProbabilityMatrix } from "./calculus";

test("Calculus Engine computes valid Bayesian probability and Kelly sizing", () => {
  const result = computeProbabilityMatrix({
    symbol: "BONK",
    priceUsd: 0.000021,
    priceChange24h: 15.4,
    volume24h: 85000000,
    liquidityUsd: 18000000,
    walletBalanceUsd: 2000,
  });

  assert.ok(result.winProbabilityPct > 50, "Positive momentum should yield win probability > 50%");
  assert.ok(result.kellyFraction > 0, "Favorable risk-reward should result in positive Kelly fraction");
  assert.ok(result.recommendedSizeUsd <= 500, "Position sizing must respect 25% single-position survival floor");
  assert.match(result.formulas.driftStr, /dX_t =/);
  assert.match(result.formulas.kellyStr, /f\* =/);
});

test("Calculus Engine flags low-liquidity extreme tail risk as VETO_TAIL_RISK", () => {
  const dangerousCandidate = computeProbabilityMatrix({
    symbol: "RUGPOOL",
    priceUsd: 0.01,
    priceChange24h: 300,
    volume24h: 10000,
    liquidityUsd: 2000, // < 15k floor
    walletBalanceUsd: 1000,
  });

  assert.equal(dangerousCandidate.calculusVerdict, "VETO_TAIL_RISK");
});
