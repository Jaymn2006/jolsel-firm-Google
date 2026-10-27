export interface VaultAsset {
  symbol: "SOL" | "USDC" | "USDT" | "BTC" | "ETH";
  name: string;
  depositAddress: string;
  mintAddress: string;
  balance: number;
  priceUsd: number;
  decimals: number;
  iconColor: string;
}

export interface BotTradingSettings {
  autoTradingEnabled: boolean;
  strategy: "SPOT_MEMECOINS" | "BLUECHIP_STABLES" | "COPYTRADE_WHALES" | "BALANCED_HYBRID";
  maxSingleTradeRiskPct: number;
  takeProfitPct: number;
  stopLossPct: number;
  allocatedCapitalPct: number;
  network: "devnet" | "mainnet-beta";
}

export interface BotExecutedTrade {
  id: string;
  timestamp: number;
  asset: string;
  type: "BUY" | "SELL";
  amount: number;
  costUsd: number;
  pnlUsd?: number;
  reason: string;
  txSig: string;
}

const STORAGE_KEY_VAULT = "jolsel_firm_vault_v2";

export const DEFAULT_VAULT_ASSETS: VaultAsset[] = [
  {
    symbol: "SOL",
    name: "Native Solana",
    depositAddress: "JolsEL7vNkM8eX5p9yA3RtG4mW2qC1zD6bV8uF4m9P2k",
    mintAddress: "So11111111111111111111111111111111111111112",
    balance: 8.5,
    priceUsd: 182.5,
    decimals: 9,
    iconColor: "from-[#14F195] to-emerald-400",
  },
  {
    symbol: "USDC",
    name: "USD Coin (Solana)",
    depositAddress: "JolsEL7vNkM8eX5p9yA3RtG4mW2qC1zD6bV8uF4m9P2k",
    mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    balance: 1500.0,
    priceUsd: 1.0,
    decimals: 6,
    iconColor: "from-blue-400 to-cyan-500",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    depositAddress: "JolsEL7vNkM8eX5p9yA3RtG4mW2qC1zD6bV8uF4m9P2k",
    mintAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    balance: 750.0,
    priceUsd: 1.0,
    decimals: 6,
    iconColor: "from-teal-400 to-emerald-500",
  },
  {
    symbol: "BTC",
    name: "Coinbase BTC (cbBTC / WBTC)",
    depositAddress: "JolsEL7vNkM8eX5p9yA3RtG4mW2qC1zD6bV8uF4m9P2k",
    mintAddress: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh",
    balance: 0.045,
    priceUsd: 68400.0,
    decimals: 8,
    iconColor: "from-amber-400 to-orange-500",
  },
  {
    symbol: "ETH",
    name: "Wrapped Ether (wETH)",
    depositAddress: "JolsEL7vNkM8eX5p9yA3RtG4mW2qC1zD6bV8uF4m9P2k",
    mintAddress: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
    balance: 0.85,
    priceUsd: 2650.0,
    decimals: 8,
    iconColor: "from-purple-400 to-indigo-500",
  },
];

export const DEFAULT_BOT_SETTINGS: BotTradingSettings = {
  autoTradingEnabled: true,
  strategy: "BALANCED_HYBRID",
  maxSingleTradeRiskPct: 15,
  takeProfitPct: 30,
  stopLossPct: 12,
  allocatedCapitalPct: 60,
  network: "devnet",
};

export function loadVaultAssets(): VaultAsset[] {
  if (typeof window === "undefined") return DEFAULT_VAULT_ASSETS;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_VAULT}:assets`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_VAULT_ASSETS;
}

export function saveVaultAssets(assets: VaultAsset[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_KEY_VAULT}:assets`, JSON.stringify(assets));
  } catch {}
}

export function loadBotSettings(): BotTradingSettings {
  if (typeof window === "undefined") return DEFAULT_BOT_SETTINGS;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_VAULT}:settings`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_BOT_SETTINGS;
}

export function saveBotSettings(settings: BotTradingSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_KEY_VAULT}:settings`, JSON.stringify(settings));
  } catch {}
}
