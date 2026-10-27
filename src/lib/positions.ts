export type Position = {
  id: string;
  mint: string;
  symbol: string;
  name: string;
  pairAddress?: string;
  entryPriceUsd: number;
  amountTokens: number;
  amountRaw?: string;
  decimals?: number;
  costUsd: number;
  openedAt: number;
  side: "long" | "short";
  status: "open" | "closed";
  exitPriceUsd?: number;
  closedAt?: number;
  realizedPnlUsd?: number;
  txSig?: string;
  inputMint?: string;
};

const KEY = "jolsel_firm_positions_v1";

export function loadPositions(walletKey: string): Position[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${KEY}:${walletKey}`);
    if (raw) return JSON.parse(raw);
    return [];
  } catch {
    return [];
  }
}

export function savePositions(walletKey: string, positions: Position[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${KEY}:${walletKey}`, JSON.stringify(positions));
  } catch {
    // ignore
  }
}

export function unrealizedPnl(pos: Position, markPriceUsd: number) {
  const currentPrice = markPriceUsd > 0 ? markPriceUsd : pos.entryPriceUsd;
  const value = pos.amountTokens * currentPrice;
  const pnl = pos.side === "short" ? pos.costUsd - value : value - pos.costUsd;
  const pct = pos.costUsd > 0 ? (pnl / pos.costUsd) * 100 : 0;
  return { value, pnl, pct };
}

export function formatUsd(n?: number | string | null): string {
  const v = typeof n === "string" ? parseFloat(n) : n ?? 0;
  if (!isFinite(v) || isNaN(v) || v === 0) return "$0.00";
  if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (Math.abs(v) >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
  if (Math.abs(v) >= 1) return `$${v.toFixed(2)}`;
  if (Math.abs(v) >= 0.01) return `$${v.toFixed(4)}`;
  if (Math.abs(v) >= 0.000001) return `$${v.toFixed(7)}`;
  return `$${v.toFixed(8)}`;
}

export function formatPct(n?: number | null): string {
  if (n == null || !isFinite(n)) return "0.00%";
  const s = n >= 0 ? "+" : "";
  return `${s}${n.toFixed(2)}%`;
}
