import type { CorporateContext } from "../context";

export class CryptoGuru {
  static analyzeCrowd(ctx: CorporateContext, volume24h = 100000): void {
    const sentiment = Math.min(99, Math.max(40, 65 + Math.log10(Math.max(1, volume24h)) * 5));
    ctx.socialSentimentScore = Math.round(sentiment);
  }
}
