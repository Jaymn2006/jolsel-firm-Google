import type { CorporateContext } from "../context";

export class Verdicter {
  static signMandate(ctx: CorporateContext): boolean {
    const isApproved = !ctx.riskVetoTriggered && ctx.isWorthIt && !/REJECTED/i.test(ctx.boardroomVotes["Judge"] || "");
    ctx.executionApproved = isApproved;
    ctx.boardroomVotes["Verdicter"] = isApproved
      ? `MANDATE SIGNED: ${ctx.tradeDirection} order sanctioned for ${ctx.selectedToken?.symbol ?? "SOL"}`
      : `MANDATE DENIED: ${ctx.riskVetoTriggered ? ctx.vetoReason : "Did not pass executive muster"}`;
    return isApproved;
  }
}
