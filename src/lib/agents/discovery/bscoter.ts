import type { CorporateContext } from "../context";

export class Bscoter {
  static scout(ctx: CorporateContext, candidateList?: any[]): void {
    if (candidateList && candidateList.length > 0) {
      ctx.scoutedTokens = candidateList;
      ctx.selectedToken = candidateList[0];
    } else if (!ctx.selectedToken) {
      ctx.scoutedTokens = [
        {
          symbol: "SOL",
          name: "Wrapped SOL",
          mint: "So11111111111111111111111111111111111111112",
          score: 92,
        },
      ];
      ctx.selectedToken = ctx.scoutedTokens[0];
    }
  }
}
