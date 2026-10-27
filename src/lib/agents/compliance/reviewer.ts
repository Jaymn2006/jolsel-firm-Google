import type { CorporateContext } from "../context";

export class Reviewer {
  static auditContractSafety(ctx: CorporateContext, tokenSecurity?: { freezeAuthority?: string | null; mintAuthority?: string | null }): void {
    if (tokenSecurity?.freezeAuthority) {
      ctx.riskVetoTriggered = true;
      ctx.vetoReason = "Contract safety audit failed: Active freeze authority detected on mint";
      ctx.boardroomVotes["Reviewer"] = "VETO: Freeze authority enabled";
    } else {
      ctx.boardroomVotes["Reviewer"] = "APPROVE: Contract safety parameters verified";
    }
  }
}
