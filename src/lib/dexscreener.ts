export { formatUsd, formatPct } from "./positions";

export type DexPair = {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceNative?: string;
  priceUsd?: string;
  txns?: {
    m5?: { buys: number; sells: number };
    h1?: { buys: number; sells: number };
    h24?: { buys: number; sells: number };
  };
  volume?: { m5?: number; h1?: number; h6?: number; h24?: number };
  priceChange?: { m5?: number; h1?: number; h6?: number; h24?: number };
  liquidity?: { usd?: number; base?: number; quote?: number };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
};

export const POPULAR_SOLANA_TOKENS: DexPair[] = [
  {
    chainId: "solana",
    dexId: "raydium",
    url: "https://dexscreener.com/solana/8phqtsjrmpax4g3pwnq3x4c1j3b96k9m9a9k9m9a9k",
    pairAddress: "8phqtsjrmpax4g3pwnq3x4c1j3b96k9m9a9k9m9a9k",
    baseToken: {
      address: "So11111111111111111111111111111111111111112",
      name: "Solana",
      symbol: "SOL",
    },
    quoteToken: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      name: "USD Coin",
      symbol: "USDC",
    },
    priceUsd: "182.45",
    priceChange: { m5: 0.42, h1: 1.85, h6: 3.2, h24: 6.84 },
    volume: { h24: 342000000 },
    liquidity: { usd: 42500000 },
    marketCap: 84500000000,
  },
  {
    chainId: "solana",
    dexId: "raydium",
    url: "https://dexscreener.com/solana/fz3yq8c8d8x7b8f9e6a5b4c3d2e1f0a9b8c7d6e5",
    pairAddress: "fz3yq8c8d8x7b8f9e6a5b4c3d2e1f0a9b8c7d6e5",
    baseToken: {
      address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      name: "Bonk",
      symbol: "BONK",
    },
    quoteToken: {
      address: "So11111111111111111111111111111111111111112",
      name: "Wrapped SOL",
      symbol: "SOL",
    },
    priceUsd: "0.0000214",
    priceChange: { m5: 1.15, h1: 4.82, h6: 8.5, h24: 14.2 },
    volume: { h24: 86500000 },
    liquidity: { usd: 18400000 },
    marketCap: 1420000000,
  },
  {
    chainId: "solana",
    dexId: "raydium",
    url: "https://dexscreener.com/solana/ep2wgfm8vhc1h7f9v6a5b4c3d2e1f0a9b8c7d6e5",
    pairAddress: "ep2wgfm8vhc1h7f9v6a5b4c3d2e1f0a9b8c7d6e5",
    baseToken: {
      address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
      name: "dogwifhat",
      symbol: "WIF",
    },
    quoteToken: {
      address: "So11111111111111111111111111111111111111112",
      name: "Wrapped SOL",
      symbol: "SOL",
    },
    priceUsd: "2.48",
    priceChange: { m5: -0.32, h1: 2.15, h6: 6.4, h24: 11.8 },
    volume: { h24: 112000000 },
    liquidity: { usd: 24500000 },
    marketCap: 2470000000,
  },
  {
    chainId: "solana",
    dexId: "orca",
    url: "https://dexscreener.com/solana/7u3yw8c8d8x7b8f9e6a5b4c3d2e1f0a9b8c7d6e5",
    pairAddress: "7u3yw8c8d8x7b8f9e6a5b4c3d2e1f0a9b8c7d6e5",
    baseToken: {
      address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      name: "Popcat",
      symbol: "POPCAT",
    },
    quoteToken: {
      address: "So11111111111111111111111111111111111111112",
      name: "Wrapped SOL",
      symbol: "SOL",
    },
    priceUsd: "1.34",
    priceChange: { m5: 0.82, h1: -1.25, h6: 4.1, h24: 8.9 },
    volume: { h24: 64000000 },
    liquidity: { usd: 12800000 },
    marketCap: 1310000000,
  },
  {
    chainId: "solana",
    dexId: "raydium",
    url: "https://dexscreener.com/solana/9fc2q8c8d8x7b8f9e6a5b4c3d2e1f0a9b8c7d6e5",
    pairAddress: "9fc2q8c8d8x7b8f9e6a5b4c3d2e1f0a9b8c7d6e5",
    baseToken: {
      address: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
      name: "Fartcoin",
      symbol: "FARTCOIN",
    },
    quoteToken: {
      address: "So11111111111111111111111111111111111111112",
      name: "Wrapped SOL",
      symbol: "SOL",
    },
    priceUsd: "0.684",
    priceChange: { m5: 2.45, h1: 8.92, h6: 18.4, h24: 34.6 },
    volume: { h24: 78000000 },
    liquidity: { usd: 14200000 },
    marketCap: 684000000,
  },
  {
    chainId: "solana",
    dexId: "meteora",
    url: "https://dexscreener.com/solana/2jupw8c8d8x7b8f9e6a5b4c3d2e1f0a9b8c7d6e5",
    pairAddress: "2jupw8c8d8x7b8f9e6a5b4c3d2e1f0a9b8c7d6e5",
    baseToken: {
      address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
      name: "Jupiter",
      symbol: "JUP",
    },
    quoteToken: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      name: "USD Coin",
      symbol: "USDC",
    },
    priceUsd: "1.08",
    priceChange: { m5: 0.15, h1: 0.85, h6: 2.1, h24: 5.2 },
    volume: { h24: 92000000 },
    liquidity: { usd: 28000000 },
    marketCap: 1450000000,
  },
  {
    chainId: "solana",
    dexId: "raydium",
    url: "https://dexscreener.com/solana/mew3w8c8d8x7b8f9e6a5b4c3d2e1f0a9b8c7d6e5",
    pairAddress: "mew3w8c8d8x7b8f9e6a5b4c3d2e1f0a9b8c7d6e5",
    baseToken: {
      address: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5",
      name: "cat in a dogs world",
      symbol: "MEW",
    },
    quoteToken: {
      address: "So11111111111111111111111111111111111111112",
      name: "Wrapped SOL",
      symbol: "SOL",
    },
    priceUsd: "0.00945",
    priceChange: { m5: -0.62, h1: 3.4, h6: 7.8, h24: 15.6 },
    volume: { h24: 42000000 },
    liquidity: { usd: 9800000 },
    marketCap: 840000000,
  },
  {
    chainId: "solana",
    dexId: "raydium",
    url: "https://dexscreener.com/solana/rndrw8c8d8x7b8f9e6a5b4c3d2e1f0a9b8c7d6e5",
    pairAddress: "rndrw8c8d8x7b8f9e6a5b4c3d2e1f0a9b8c7d6e5",
    baseToken: {
      address: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof",
      name: "Render Token",
      symbol: "RENDER",
    },
    quoteToken: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      name: "USD Coin",
      symbol: "USDC",
    },
    priceUsd: "6.72",
    priceChange: { m5: 0.28, h1: 1.15, h6: 2.8, h24: 4.9 },
    volume: { h24: 38000000 },
    liquidity: { usd: 14500000 },
    marketCap: 2600000000,
  },
];

export async function fetchTrendingPairs(): Promise<DexPair[]> {
  try {
    const res = await fetch("/api/dex/trending");
    if (!res.ok) throw new Error("API route error");
    const data = await res.json();
    if (Array.isArray(data.pairs) && data.pairs.length > 0) {
      return data.pairs;
    }
  } catch (err) {
    console.warn("Falling back to curated Solana trending pairs", err);
  }
  return POPULAR_SOLANA_TOKENS;
}

export async function searchSolanaPairs(query: string): Promise<DexPair[]> {
  if (!query.trim()) return POPULAR_SOLANA_TOKENS;
  try {
    const res = await fetch(`/api/dex/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Search API error");
    const data = await res.json();
    if (Array.isArray(data.pairs) && data.pairs.length > 0) {
      return data.pairs;
    }
  } catch (err) {
    console.warn("Falling back to local search", err);
  }
  const q = query.toLowerCase().trim();
  return POPULAR_SOLANA_TOKENS.filter(
    (p) =>
      p.baseToken.symbol.toLowerCase().includes(q) ||
      p.baseToken.name.toLowerCase().includes(q) ||
      p.baseToken.address.toLowerCase().includes(q)
  );
}
