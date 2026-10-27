export interface WalletState {
  connected: boolean;
  address: string;
  isPaperWallet: boolean;
  solBalance: number;
  usdcBalance: number;
}

const STORAGE_KEY_WALLET = "jolsel_firm_wallet_v1";

const DEFAULT_PAPER_WALLET: WalletState = {
  connected: true,
  address: "JolsEL7vNkM8eX5p9yA3RtG4mW2qC1zD6bV8uF4m9P2k",
  isPaperWallet: true,
  solBalance: 12.5,
  usdcBalance: 2500.0,
};

export function loadWalletState(): WalletState {
  if (typeof window === "undefined") return DEFAULT_PAPER_WALLET;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WALLET);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return DEFAULT_PAPER_WALLET;
}

export function saveWalletState(state: WalletState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export async function detectBrowserWallet(): Promise<{ name: string; provider: any } | null> {
  if (typeof window === "undefined") return null;
  const win = window as any;
  if (win.phantom?.solana?.isPhantom) {
    return { name: "Phantom", provider: win.phantom.solana };
  }
  if (win.solflare?.isSolflare) {
    return { name: "Solflare", provider: win.solflare };
  }
  if (win.solana?.isPhantom || win.solana?.isSolflare || win.solana) {
    return { name: "Solana Wallet", provider: win.solana };
  }
  return null;
}
