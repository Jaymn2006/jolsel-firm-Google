import type { CorporateContext } from "../context";

export class Analuszer {
  static calculatePrecisionMetrics(ctx: CorporateContext, priceChange24h = 5): void {
    const isBullish = priceChange24h >= 0;
    const baseScore = Math.min(99, Math.max(50, 70 + Math.abs(priceChange24h) * 1.5));
    ctx.customIndicatorsScore = Math.round(baseScore);
    ctx.tradeDirection = isBullish ? "LONG" : "SHORT";
  }
}
