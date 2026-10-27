export interface WhaleProfile {
  address: string;
  label: string;
  badge: "Insider Alpha" | "Jupiter Sniper" | "Momentum Whale" | "Early Dev";
  winRatePct: number;
  totalPnl7dUsd: number;
  totalVolume7dUsd: number;
  recentTokens: string[];
  activeCopy: boolean;
  copiedTradesCount: number;
  lastTrade: {
    symbol: string;
    side: "BUY" | "SELL";
    amountSol: number;
    timeAgo: string;
  };
}

export const INITIAL_WHALES: WhaleProfile[] = [
  {
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    label: "FOMO Alpha Whale #01",
    badge: "Insider Alpha",
    winRatePct: 84.6,
    totalPnl7dUsd: 142850,
    totalVolume7dUsd: 890000,
    recentTokens: ["BONK", "WIF", "POPCAT"],
    activeCopy: true,
    copiedTradesCount: 14,
    lastTrade: {
      symbol: "BONK",
      side: "BUY",
      amountSol: 12.5,
      timeAgo: "2m ago",
    },
  },
  {
    address: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
    label: "Raydium Sniper 99",
    badge: "Jupiter Sniper",
    winRatePct: 78.2,
    totalPnl7dUsd: 98400,
    totalVolume7dUsd: 620000,
    recentTokens: ["FARTCOIN", "MEW", "JUP"],
    activeCopy: false,
    copiedTradesCount: 8,
    lastTrade: {
      symbol: "FARTCOIN",
      side: "BUY",
      amountSol: 8.2,
      timeAgo: "11m ago",
    },
  },
  {
    address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    label: "Solana Smart Money #7",
    badge: "Momentum Whale",
    winRatePct: 81.0,
    totalPnl7dUsd: 115200,
    totalVolume7dUsd: 740000,
    recentTokens: ["POPCAT", "WIF", "RENDER"],
    activeCopy: true,
    copiedTradesCount: 19,
    lastTrade: {
      symbol: "POPCAT",
      side: "SELL",
      amountSol: 15.0,
      timeAgo: "34m ago",
    },
  },
  {
    address: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
    label: "Token-2022 Pioneer",
    badge: "Early Dev",
    winRatePct: 89.4,
    totalPnl7dUsd: 210500,
    totalVolume7dUsd: 1250000,
    recentTokens: ["JUP", "BONK", "FARTCOIN"],
    activeCopy: false,
    copiedTradesCount: 22,
    lastTrade: {
      symbol: "JUP",
      side: "BUY",
      amountSol: 25.0,
      timeAgo: "1h ago",
    },
  },
];
