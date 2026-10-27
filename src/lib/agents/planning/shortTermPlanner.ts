import type { CorporateContext } from "../context";

export class ShortTermPlanner {
  static calculatePyramiding(ctx: CorporateContext): void {
    // Allocates 10-15% of total wallet balance up to a maximum safety cap
    const baseFraction = ctx.customIndicatorsScore > 90 ? 0.15 : 0.10;
    ctx.targetPositionSizeUSDT = Math.min(ctx.walletBalanceUSDT * baseFraction, 150);
  }
}
