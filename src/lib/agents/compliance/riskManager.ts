import type { CorporateContext } from "../context";

export class RiskManager {
  static verifySurvivalFloor(ctx: CorporateContext): void {
    const maxSafeSize = ctx.walletBalanceUSDT * 0.25;
    if (ctx.targetPositionSizeUSDT > maxSafeSize) {
      ctx.riskVetoTriggered = true;
      ctx.vetoReason = `Survival Floor: Target size $${ctx.targetPositionSizeUSDT.toFixed(2)} exceeds 25% max single-trade risk`;
      ctx.boardroomVotes["RiskManager"] = "VETO: Survival floor breach";
    } else {
      ctx.boardroomVotes["RiskManager"] = "APPROVE: Position within risk budget";
    }
  }
}
