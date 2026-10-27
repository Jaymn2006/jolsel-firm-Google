import type { CorporateContext } from "../context";

export class Trader {
  static formatExecutionOrder(ctx: CorporateContext): {
    symbol: string;
    direction: "LONG" | "SHORT";
    targetSizeUsd: number;
    slippageMax: number;
    stopLossPct: number;
    takeProfitPct: number;
  } {
    return {
      symbol: ctx.selectedToken?.symbol ?? "SOL",
      direction: ctx.tradeDirection,
      targetSizeUsd: ctx.targetPositionSizeUSDT,
      slippageMax: ctx.slippageMax,
      stopLossPct: ctx.reversalProtectionPlan?.trailingStopLossPercent ?? 15,
      takeProfitPct: ctx.reversalProtectionPlan?.takeProfitPercent ?? 30,
    };
  }
}
