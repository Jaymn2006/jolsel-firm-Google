import type { CorporateContext } from "../context";

export class LongTermPlanner {
  static routeAssetClass(ctx: CorporateContext): void {
    if (ctx.walletBalanceUSDT < 200) {
      ctx.activeAssetClass = "MEME_COIN";
    } else if (ctx.walletBalanceUSDT < 1000) {
      ctx.activeAssetClass = "TOKENIZED_STOCK";
    } else {
      ctx.activeAssetClass = "PERPETUAL";
    }
  }
}
