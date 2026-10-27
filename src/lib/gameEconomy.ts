/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// In-game economy, player profiles, airdrop system, and global leaderboard for Jolsel Firm Devnet Game

export interface PlayerProfile {
  id: string;
  username: string;
  avatar: string; // e.g. "grok", "cyberpunk", "doge", "sage", "degen"
  region: string; // e.g. "USA (New York)", "USA (California)", "UK (London)", "Japan (Tokyo)", "Singapore", "Germany (Berlin)"
  riskTolerance: "degen" | "balanced" | "conservative" | "calculus_whale";
  grokPersonality: "sarcastic_genius" | "hype_coach" | "grumpy_risk" | "zen_master";
  soundEffects: boolean;
  jolselBalance: number;
  devnetSolBalance: number;
  totalPnlUsd: number;
  winStreak: number;
  bestStreak: number;
  totalTrades: number;
  winCount: number;
  lossCount: number;
  xp: number;
  level: number;
  airdropClaimed: boolean;
  badges: string[];
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatar: string;
  region: string;
  jolselBalance: number;
  pnlUsd: number;
  pnlPct: number;
  winRatePct: number;
  streak: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface JolselTokenStats {
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24hUsd: number;
  marketCapUsd: number;
  circulatingSupply: number;
  totalSupply: number;
  burnRatePct: number;
  stakingAprPct: number;
  vaultBackingSol: number;
}

export const INITIAL_JOLSEL_STATS: JolselTokenStats = {
  symbol: "JOLSEL",
  name: "Jolsel Firm In-Game Coin",
  priceUsd: 0.0425,
  change24h: 18.4,
  high24h: 0.0489,
  low24h: 0.0352,
  volume24hUsd: 1425800,
  marketCapUsd: 42500000,
  circulatingSupply: 240000000,
  totalSupply: 1000000000,
  burnRatePct: 2.5,
  stakingAprPct: 24.8,
  vaultBackingSol: 18500,
};

const DEFAULT_PROFILE: PlayerProfile = {
  id: "player_genesis",
  username: "ApexDegen_01",
  avatar: "grok",
  region: "USA (Miami)",
  riskTolerance: "calculus_whale",
  grokPersonality: "sarcastic_genius",
  soundEffects: true,
  jolselBalance: 10000, // 10,000 $JOLSEL airdrop
  devnetSolBalance: 1.0, // 1.0 SOL Devnet starter
  totalPnlUsd: 485.2,
  winStreak: 4,
  bestStreak: 7,
  totalTrades: 12,
  winCount: 9,
  lossCount: 3,
  xp: 1450,
  level: 4,
  airdropClaimed: true,
  badges: ["GENESIS_AIRDROP", "CALCULUS_ACOLYTE", "SOLANA_DEVNET_PIONEER"],
};

export const GLOBAL_LEADERBOARD_SEED: LeaderboardEntry[] = [
  {
    rank: 1,
    id: "lead_1",
    username: "QuantumKelly",
    avatar: "sage",
    region: "Singapore",
    jolselBalance: 845200,
    pnlUsd: 18920.4,
    pnlPct: 284.5,
    winRatePct: 82.4,
    streak: 11,
    badge: "Apex Council",
  },
  {
    rank: 2,
    id: "lead_2",
    username: "SolDegen99",
    avatar: "degen",
    region: "USA (Miami)",
    jolselBalance: 612400,
    pnlUsd: 12450.0,
    pnlPct: 195.2,
    winRatePct: 74.1,
    streak: 8,
    badge: "Whale Raider",
  },
  {
    rank: 3,
    id: "lead_3",
    username: "CryptoSamurai",
    avatar: "cyberpunk",
    region: "Japan (Tokyo)",
    jolselBalance: 524100,
    pnlUsd: 9812.2,
    pnlPct: 142.0,
    winRatePct: 70.8,
    streak: 6,
    badge: "Diamond Scalper",
  },
  {
    rank: 4,
    id: "lead_4",
    username: "LondonAlpha",
    avatar: "grok",
    region: "UK (London)",
    jolselBalance: 412900,
    pnlUsd: 7650.8,
    pnlPct: 118.5,
    winRatePct: 68.2,
    streak: 5,
    badge: "Perp Master",
  },
  {
    rank: 5,
    id: "lead_5",
    username: "BerlinKelly",
    avatar: "sage",
    region: "Germany (Berlin)",
    jolselBalance: 329000,
    pnlUsd: 5410.0,
    pnlPct: 89.4,
    winRatePct: 65.0,
    streak: 4,
    badge: "Stochastic Pro",
  },
  {
    rank: 6,
    id: "lead_6",
    username: "DubaiWhale",
    avatar: "degen",
    region: "UAE (Dubai)",
    jolselBalance: 298400,
    pnlUsd: 4890.3,
    pnlPct: 76.1,
    winRatePct: 62.5,
    streak: 3,
    badge: "Liquidity Beast",
  },
  {
    rank: 7,
    id: "lead_7",
    username: "SydneyTrader",
    avatar: "doge",
    region: "Australia (Sydney)",
    jolselBalance: 241500,
    pnlUsd: 3910.5,
    pnlPct: 64.8,
    winRatePct: 61.2,
    streak: 3,
    badge: "Memecoin Surfer",
  },
  {
    rank: 8,
    id: "lead_8",
    username: "SeoulSniper",
    avatar: "cyberpunk",
    region: "South Korea (Seoul)",
    jolselBalance: 189200,
    pnlUsd: 2840.1,
    pnlPct: 52.3,
    winRatePct: 59.0,
    streak: 2,
    badge: "Fast Execution",
  },
];

const LOCAL_STORAGE_KEY = "jolsel_firm_player_profile";

export function loadPlayerProfile(): PlayerProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PROFILE, ...parsed };
    }
  } catch (e) {
    console.warn("Failed to load player profile from localStorage:", e);
  }
  return DEFAULT_PROFILE;
}

export function savePlayerProfile(profile: PlayerProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn("Failed to save player profile:", e);
  }
}

/**
 * Claim the initial Airdrop: 10,000 $JOLSEL + 1.0 SOL Devnet starter
 */
export function claimStarterAirdrop(current: PlayerProfile): PlayerProfile {
  if (current.airdropClaimed && current.jolselBalance > 0) return current;
  const updated: PlayerProfile = {
    ...current,
    jolselBalance: current.jolselBalance + 10000,
    devnetSolBalance: current.devnetSolBalance + 1.0,
    airdropClaimed: true,
    badges: Array.from(new Set([...current.badges, "GENESIS_AIRDROP"])),
    xp: current.xp + 500,
  };
  savePlayerProfile(updated);
  return updated;
}

/**
 * Generate sorted leaderboard including the active user
 */
export function getAugmentedLeaderboard(player: PlayerProfile): LeaderboardEntry[] {
  const userEntry: LeaderboardEntry = {
    rank: 99,
    id: player.id,
    username: `${player.username} (You)`,
    avatar: player.avatar,
    region: player.region,
    jolselBalance: Math.round(player.jolselBalance),
    pnlUsd: Number(player.totalPnlUsd.toFixed(1)),
    pnlPct: Number(((player.totalPnlUsd / 500) * 100).toFixed(1)),
    winRatePct: player.totalTrades > 0 ? Number(((player.winCount / player.totalTrades) * 100).toFixed(1)) : 75.0,
    streak: player.winStreak,
    badge: player.level >= 5 ? "Diamond Hands" : player.level >= 3 ? "Kelly Scalper" : "Novice Cadet",
    isCurrentUser: true,
  };

  const combined = [...GLOBAL_LEADERBOARD_SEED, userEntry];
  combined.sort((a, b) => b.pnlUsd - a.pnlUsd);

  return combined.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));
}
