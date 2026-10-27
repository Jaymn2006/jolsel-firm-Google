import type { CorporateContext } from "../context";

export class MrGrumpy {
  static enforceZeroTolerance(ctx: CorporateContext): void {
    if (ctx.customIndicatorsScore < 75) {
      ctx.riskVetoTriggered = true;
      ctx.vetoReason = "MrGrumpy Zero-Tolerance: Custom indicator score below hard floor (<75)";
      ctx.boardroomVotes["MrGrumpy"] = "VETO: Standard not met";
    } else {
      ctx.boardroomVotes["MrGrumpy"] = "APPROVE: Barely acceptable floor maintained";
    }
  }
}
