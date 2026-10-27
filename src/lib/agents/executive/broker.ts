import type { CorporateContext } from "../context";

export class Broker {
  static advocateMomentum(ctx: CorporateContext): void {
    if (ctx.customIndicatorsScore >= 80) {
      ctx.boardroomVotes["Broker"] = `YES — strong ${ctx.tradeDirection} momentum backed by velocity`;
    } else {
      ctx.boardroomVotes["Broker"] = "ABSTAIN — momentum insufficient";
    }
  }
}
