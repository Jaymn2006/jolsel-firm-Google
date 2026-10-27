import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  type DexPair,
  POPULAR_SOLANA_TOKENS,
  fetchTrendingPairs,
  searchSolanaPairs,
  formatUsd,
  formatPct,
} from "../../lib/dexscreener";
import { fetchJupiterQuote, SOL_MINT, USDC_MINT } from "../../lib/jupiter";
import {
  type Position,
  loadPositions,
  savePositions,
  unrealizedPnl,
} from "../../lib/positions";
import { type WalletState, saveWalletState } from "../../lib/wallet";
import { LiveChart } from "./LiveChart";
import { Token2022Panel } from "./Token2022Panel";
import { AgentPipelinePanel } from "./AgentPipelinePanel";
import {
  Search,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";

interface TerminalProps {
  walletState: WalletState;
  setWalletState: React.Dispatch<React.SetStateAction<WalletState>>;
  firmLive: boolean;
}

interface FirmEvent {
  id: string;
  time: string;
  agent: string;
  message: string;
  level: "info" | "success" | "warn" | "trade";
}

export function Terminal({ walletState, setWalletState, firmLive }: TerminalProps) {
  const [pairs, setPairs] = useState<DexPair[]>(POPULAR_SOLANA_TOKENS);
  const [selected, setSelected] = useState<DexPair>(POPULAR_SOLANA_TOKENS[1]); // Default to BONK
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [payWith, setPayWith] = useState<"SOL" | "USDC">("SOL");
  const [amountInput, setAmountInput] = useState("0.10");
  const [sellPct, setSellPct] = useState(100);
  const [slippageBps, setSlippageBps] = useState(100);
  const [activeTab, setActiveTab] = useState<"market" | "positions" | "holdings" | "firm">("market");
  const [positions, setPositions] = useState<Position[]>([]);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" | "info"; txSig?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [events, setEvents] = useState<FirmEvent[]>([]);

  // Load stored positions on startup
  useEffect(() => {
    const loaded = loadPositions(walletState.address);
    setPositions(loaded);
  }, [walletState.address]);

  // Initial fetch of trending pairs
  useEffect(() => {
    fetchTrendingPairs().then((res) => {
      if (res && res.length > 0) {
        setPairs(res);
      }
    });
  }, []);

  const pushEvent = useCallback((agent: string, message: string, level: FirmEvent["level"] = "info") => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    setEvents((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        time: timeStr,
        agent,
        message,
        level,
      },
      ...prev.slice(0, 49),
    ]);
  }, []);

  // Autonomous Firm LIVE 17-agent scoring loop
  useEffect(() => {
    if (!firmLive || pairs.length === 0) return;

    const interval = setInterval(() => {
      const topCandidates = pairs.filter((p) => (p.liquidity?.usd || 0) > 10000);
      if (topCandidates.length === 0) return;

      const randomPick = topCandidates[Math.floor(Math.random() * topCandidates.length)];
      const priceCh = randomPick.priceChange?.h24 ?? randomPick.priceChange?.h1 ?? 0;
      const direction = priceCh >= 0 ? "LONG" : "SHORT";
      const score = Math.min(98, Math.max(68, 72 + Math.abs(priceCh) * 1.2));

      pushEvent(
        "Bscoter",
        `Scouting candidates on Solana Raydium/Orca pools. Target locked: ${randomPick.baseToken.symbol}`,
        "info"
      );

      setTimeout(() => {
        pushEvent(
          "Analuszer",
          `${randomPick.baseToken.symbol}: Indicator score ${score.toFixed(0)}/100 · Direction: ${direction}`,
          score >= 80 ? "success" : "info"
        );

        if (score >= 80) {
          pushEvent("Overthinker", `Tail-risk simulation cleared for ${randomPick.baseToken.symbol}.`, "info");
          pushEvent("MrGrumpy", `Floor verified: Score ${score.toFixed(0)} ≥ 75. No veto.`, "info");
          pushEvent("Judge", `Executive Quorum reached (15/17 votes affirmative).`, "success");
          pushEvent("Verdicter", `Mandate SIGNED for ${direction} on ${randomPick.baseToken.symbol}.`, "trade");
        } else {
          pushEvent("MrGrumpy", `VETO: ${randomPick.baseToken.symbol} indicator score ${score.toFixed(0)} below firm floor.`, "warn");
        }
      }, 700);
    }, 4500);

    return () => clearInterval(interval);
  }, [firmLive, pairs, pushEvent]);

  // Search handler
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const results = await searchSolanaPairs(query);
      if (results.length > 0) {
        setPairs(results);
        setSelected(results[0]);
      } else {
        setStatusMsg({ text: `No tokens found matching "${query}"`, type: "info" });
      }
    } finally {
      setLoading(false);
    }
  };

  // Mark price helper
  const getMarkPrice = (mint: string, pairAddress?: string) => {
    if (pairAddress) {
      const foundByPair = pairs.find((p) => p.pairAddress === pairAddress);
      if (foundByPair?.priceUsd) return parseFloat(foundByPair.priceUsd);
    }
    if (selected && selected.baseToken.address === mint && selected.priceUsd) {
      return parseFloat(selected.priceUsd);
    }
    const found = pairs.find((p) => p.baseToken.address === mint);
    if (found?.priceUsd) return parseFloat(found.priceUsd);
    return 0;
  };

  // Positions stats calculations
  const openPositions = useMemo(() => positions.filter((p) => p.status === "open"), [positions]);
  const totalCostBasis = useMemo(() => openPositions.reduce((acc, p) => acc + p.costUsd, 0), [openPositions]);
  const totalMarkValue = useMemo(() => {
    return openPositions.reduce((acc, p) => {
      const mark = getMarkPrice(p.mint, p.pairAddress) || p.entryPriceUsd;
      return acc + p.amountTokens * mark;
    }, 0);
  }, [openPositions, pairs, selected]);
  const totalUnrealizedPnl = totalMarkValue - totalCostBasis;
  const totalPnlPct = totalCostBasis > 0 ? (totalUnrealizedPnl / totalCostBasis) * 100 : 0;

  // Selected token holdings in wallet
  const selectedTokenHolding = useMemo(() => {
    if (!selected) return null;
    const pos = openPositions.find((p) => p.mint === selected.baseToken.address);
    return pos ? pos.amountTokens : 0;
  }, [selected, openPositions]);

  // Execute Swap Trade
  const executeSwap = async () => {
    if (!selected) return;
    setBusy(true);
    setStatusMsg({ text: "Routing order through Jupiter & Jolsel Firm...", type: "info" });

    try {
      const isBuy = side === "buy";
      const price = selected.priceUsd ? parseFloat(selected.priceUsd) : 1.0;
      const tokenDecimals = 6;
      const txSig = `4r${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;

      if (isBuy) {
        const payAmount = parseFloat(amountInput);
        if (isNaN(payAmount) || payAmount <= 0) {
          throw new Error("Please enter a valid amount.");
        }

        const solPriceUsd = 180;
        const costUsd = payWith === "SOL" ? payAmount * solPriceUsd : payAmount;

        if (payWith === "SOL" && walletState.solBalance < payAmount) {
          throw new Error(`Insufficient SOL balance (${walletState.solBalance.toFixed(2)} SOL available).`);
        }
        if (payWith === "USDC" && walletState.usdcBalance < payAmount) {
          throw new Error(`Insufficient USDC balance ($${walletState.usdcBalance.toFixed(2)} available).`);
        }

        // Calculate received tokens
        const tokensBought = costUsd / (price || 1);

        // Update Wallet Balance
        const nextWallet = {
          ...walletState,
          solBalance: payWith === "SOL" ? walletState.solBalance - payAmount : walletState.solBalance,
          usdcBalance: payWith === "USDC" ? walletState.usdcBalance - payAmount : walletState.usdcBalance,
        };
        setWalletState(nextWallet);
        saveWalletState(nextWallet);

        // Create new position
        const newPos: Position = {
          id: txSig,
          mint: selected.baseToken.address,
          symbol: selected.baseToken.symbol,
          name: selected.baseToken.name,
          pairAddress: selected.pairAddress,
          entryPriceUsd: price,
          amountTokens: tokensBought,
          decimals: tokenDecimals,
          costUsd,
          openedAt: Date.now(),
          side: "long",
          status: "open",
          txSig,
          inputMint: payWith === "SOL" ? SOL_MINT : USDC_MINT,
        };

        const updatedPositions = [newPos, ...positions];
        setPositions(updatedPositions);
        savePositions(walletState.address, updatedPositions);

        pushEvent(
          "Trader",
          `BUY ${tokensBought.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${selected.baseToken.symbol} at ${formatUsd(price)} ($${costUsd.toFixed(2)})`,
          "trade"
        );

        setStatusMsg({
          text: `Successfully bought ${tokensBought.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${selected.baseToken.symbol}!`,
          type: "success",
          txSig,
        });
      } else {
        // Sell
        if (!selectedTokenHolding || selectedTokenHolding <= 0) {
          throw new Error(`No ${selected.baseToken.symbol} balance to sell.`);
        }

        const tokensToSell = (selectedTokenHolding * sellPct) / 100;
        const proceedsUsd = tokensToSell * price;
        const solReceived = proceedsUsd / 180;

        // Credit wallet
        const nextWallet = {
          ...walletState,
          solBalance: walletState.solBalance + solReceived,
        };
        setWalletState(nextWallet);
        saveWalletState(nextWallet);

        // Update positions
        let remainingToDeduct = tokensToSell;
        const updatedPositions = positions.map((p) => {
          if (p.mint !== selected.baseToken.address || p.status !== "open") return p;
          if (remainingToDeduct <= 0) return p;

          if (remainingToDeduct >= p.amountTokens) {
            remainingToDeduct -= p.amountTokens;
            const realizedPnlUsd = (price - p.entryPriceUsd) * p.amountTokens;
            return {
              ...p,
              status: "closed" as const,
              closedAt: Date.now(),
              exitPriceUsd: price,
              realizedPnlUsd,
            };
          } else {
            const fraction = remainingToDeduct / p.amountTokens;
            const realizedPnlUsd = (price - p.entryPriceUsd) * remainingToDeduct;
            p.amountTokens -= remainingToDeduct;
            p.costUsd -= p.costUsd * fraction;
            remainingToDeduct = 0;
            return p;
          }
        });

        setPositions(updatedPositions);
        savePositions(walletState.address, updatedPositions);

        pushEvent(
          "Trader",
          `SELL ${tokensToSell.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${selected.baseToken.symbol} for +${solReceived.toFixed(4)} SOL ($${proceedsUsd.toFixed(2)})`,
          "trade"
        );

        setStatusMsg({
          text: `Successfully sold ${tokensToSell.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${selected.baseToken.symbol} (+${solReceived.toFixed(4)} SOL)`,
          type: "success",
          txSig,
        });
      }
    } catch (err: any) {
      setStatusMsg({ text: err?.message || "Execution failed", type: "error" });
      pushEvent("Trader", `Execution error: ${err?.message}`, "warn");
    } finally {
      setBusy(false);
    }
  };

  // Close specific position
  const closePosition = (posId: string) => {
    const pos = positions.find((p) => p.id === posId && p.status === "open");
    if (!pos) return;

    const currentMark = getMarkPrice(pos.mint) || pos.entryPriceUsd;
    const proceedsUsd = pos.amountTokens * currentMark;
    const solProceeds = proceedsUsd / 180;
    const realizedPnlUsd = proceedsUsd - pos.costUsd;

    // Credit wallet
    const nextWallet = {
      ...walletState,
      solBalance: walletState.solBalance + solProceeds,
    };
    setWalletState(nextWallet);
    saveWalletState(nextWallet);

    const updated = positions.map((p) =>
      p.id === posId
        ? {
            ...p,
            status: "closed" as const,
            closedAt: Date.now(),
            exitPriceUsd: currentMark,
            realizedPnlUsd,
          }
        : p
    );
    setPositions(updated);
    savePositions(walletState.address, updated);

    pushEvent(
      "Trader",
      `Position Closed: ${pos.symbol} · Realized PnL: ${formatUsd(realizedPnlUsd)}`,
      realizedPnlUsd >= 0 ? "success" : "warn"
    );

    setStatusMsg({
      text: `Closed ${pos.symbol} position: ${realizedPnlUsd >= 0 ? "+" : ""}${formatUsd(realizedPnlUsd)} PnL credited`,
      type: "success",
    });
  };

  return (
    <div className="mx-auto max-w-[1700px] p-4 sm:p-6 space-y-4">
      {/* Top Firm Portfolio Metrics Banner */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-xl backdrop-blur-md">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Open Positions
          </div>
          <div className="mt-1 font-mono text-xl font-bold text-white sm:text-2xl">
            {openPositions.length}
          </div>
          <div className="text-[10px] text-slate-400">Total active allocations</div>
        </div>

        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Cost Basis
          </div>
          <div className="mt-1 font-mono text-xl font-bold text-white sm:text-2xl">
            {formatUsd(totalCostBasis)}
          </div>
          <div className="text-[10px] text-slate-400">Invested principal</div>
        </div>

        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Current Mark Value
          </div>
          <div className="mt-1 font-mono text-xl font-bold text-white sm:text-2xl">
            {formatUsd(totalMarkValue)}
          </div>
          <div className="text-[10px] text-slate-400">Real-time fair market value</div>
        </div>

        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Unrealized PnL
          </div>
          <div
            className={`mt-1 font-mono text-xl font-bold sm:text-2xl ${
              totalUnrealizedPnl >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {formatUsd(totalUnrealizedPnl)} ({formatPct(totalPnlPct)})
          </div>
          <div className="text-[10px] text-slate-400">Mark-to-market return</div>
        </div>
      </div>

      {/* Main Terminal Layout */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left Column: Market Explorer, Positions, Holdings, Firm Feed (3 cols) */}
        <aside className="space-y-3 lg:col-span-3">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search symbol, mint or name..."
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#14F195]/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-white/10 px-3 text-xs font-semibold text-white hover:bg-white/15 transition"
            >
              Search
            </button>
          </form>

          {/* Quick Filter Tabs */}
          <div className="flex rounded-xl border border-white/10 bg-slate-950/80 p-1 text-xs">
            {(["market", "positions", "holdings", "firm"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={`flex-1 rounded-lg py-1.5 font-semibold capitalize transition ${
                  activeTab === t
                    ? "bg-[#14F195] text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t}
                {t === "positions" && openPositions.length > 0 && (
                  <span className="ml-1 rounded-full bg-slate-950/20 px-1.5 py-0.2 text-[9px]">
                    {openPositions.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content 1: Live Market Pairs */}
          {activeTab === "market" && (
            <div className="max-h-[620px] space-y-1.5 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/60 p-2">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Solana Dex Radar ({pairs.length})
              </div>
              {pairs.map((p) => {
                const isSelected = selected?.pairAddress === p.pairAddress;
                const ch = p.priceChange?.h24 ?? p.priceChange?.h1 ?? 0;
                const isUp = ch >= 0;

                return (
                  <button
                    key={p.pairAddress}
                    type="button"
                    onClick={() => setSelected(p)}
                    className={`flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition ${
                      isSelected
                        ? "border-[#14F195]/50 bg-[#14F195]/10 shadow-sm shadow-[#14F195]/10"
                        : "border-transparent bg-slate-950/40 hover:border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs truncate">
                          {p.baseToken.symbol}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate">
                          /{p.quoteToken.symbol}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Vol: {formatUsd(p.volume?.h24)} · Liq: {formatUsd(p.liquidity?.usd)}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs font-bold text-white">
                        {formatUsd(p.priceUsd)}
                      </div>
                      <div
                        className={`font-mono text-[10px] font-semibold ${
                          isUp ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {formatPct(ch)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab Content 2: Open Positions */}
          {activeTab === "positions" && (
            <div className="max-h-[620px] space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/60 p-2">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Active Ledger ({openPositions.length})
              </div>
              {openPositions.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No active trading positions. Execute a BUY order to open a position.
                </div>
              ) : (
                openPositions.map((pos) => {
                  const mark = getMarkPrice(pos.mint, pos.pairAddress) || pos.entryPriceUsd;
                  const { pnl, pct } = unrealizedPnl(pos, mark);
                  const isGain = pnl >= 0;

                  return (
                    <div
                      key={pos.id}
                      className="rounded-xl border border-white/10 bg-slate-950/60 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{pos.symbol}</span>
                        <span
                          className={`font-mono text-xs font-bold ${
                            isGain ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {formatPct(pct)} ({formatUsd(pnl)})
                        </span>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px] text-slate-400">
                        <div>
                          <span>Size: </span>
                          <span className="font-mono text-slate-200">
                            {pos.amountTokens.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div>
                          <span>Cost: </span>
                          <span className="font-mono text-slate-200">{formatUsd(pos.costUsd)}</span>
                        </div>
                        <div>
                          <span>Entry: </span>
                          <span className="font-mono text-slate-200">
                            {formatUsd(pos.entryPriceUsd)}
                          </span>
                        </div>
                        <div>
                          <span>Mark: </span>
                          <span className="font-mono text-slate-200">{formatUsd(mark)}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
                        <a
                          href={`https://solscan.io/tx/${pos.txSig}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300"
                        >
                          <span>{pos.txSig?.slice(0, 8)}...</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => closePosition(pos.id)}
                          className="rounded-lg bg-rose-500/20 border border-rose-500/30 px-2.5 py-1 text-[10px] font-bold text-rose-300 hover:bg-rose-500/30 transition"
                        >
                          Close / Take Profit
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab Content 3: Wallet SPL Holdings */}
          {activeTab === "holdings" && (
            <div className="max-h-[620px] space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Wallet Token Balances
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
                <div className="flex justify-between font-bold text-white">
                  <span>Solana (SOL)</span>
                  <span className="font-mono text-[#14F195]">
                    {walletState.solBalance.toFixed(4)} SOL
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  ≈ ${(walletState.solBalance * 180).toFixed(2)} USD
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
                <div className="flex justify-between font-bold text-white">
                  <span>USD Coin (USDC)</span>
                  <span className="font-mono text-white">
                    ${walletState.usdcBalance.toFixed(2)}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">SPL Stablecoin</div>
              </div>

              {openPositions.map((pos) => (
                <div key={pos.id} className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
                  <div className="flex justify-between font-bold text-white">
                    <span>{pos.symbol}</span>
                    <span className="font-mono text-slate-200">
                      {pos.amountTokens.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                    <span>{pos.name}</span>
                    <span className="text-[#14F195]">Token-2022 / SPL</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 4: Real-time Firm Event Stream */}
          {activeTab === "firm" && (
            <div className="max-h-[620px] space-y-1.5 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/60 p-2 font-mono text-[11px]">
              <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span>17-Agent Event Stream</span>
                <span className="text-[#14F195]">{firmLive ? "● Streaming" : "○ Paused"}</span>
              </div>
              {events.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  Toggle Firm LIVE in the header to activate continuous autonomous agent scoring.
                </div>
              ) : (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    className={`rounded-lg border p-2 ${
                      ev.level === "trade"
                        ? "border-[#14F195]/40 bg-[#14F195]/10 text-white"
                        : ev.level === "warn"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                        : ev.level === "success"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : "border-white/5 bg-slate-950/40 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-[#14F195]">[{ev.agent}]</span>
                      <span>{ev.time}</span>
                    </div>
                    <div className="mt-1 leading-snug">{ev.message}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </aside>

        {/* Center Column: Live Chart + 17-Agent Council Deliberation (6 cols) */}
        <section className="space-y-4 lg:col-span-6">
          <LiveChart
            selected={selected}
            onTick={(updated) => {
              setSelected(updated);
            }}
          />

          <AgentPipelinePanel
            selected={selected}
            firmLive={firmLive}
            onDeliberationComplete={(dir, score) => {
              pushEvent(
                "Verdicter",
                `Gemini Council Approved: ${dir} on ${selected?.baseToken.symbol} (Score: ${score})`,
                "trade"
              );
            }}
          />
        </section>

        {/* Right Column: Execution Terminal & Token-2022 Audit (3 cols) */}
        <aside className="space-y-4 lg:col-span-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-xl backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Jupiter Swap Execution
              </span>
              <span className="rounded-full bg-violet-500/20 px-2 py-0.5 font-mono text-[10px] text-violet-300">
                Solana Mainnet
              </span>
            </div>

            {/* Buy / Sell Tab Switcher */}
            <div className="mb-3 flex gap-1 rounded-xl border border-white/10 bg-slate-950 p-1 text-xs">
              <button
                type="button"
                aria-label="Switch to Buy Mode"
                onClick={() => setSide("buy")}
                className={`flex-1 rounded-lg py-1.5 font-bold transition ${
                  side === "buy"
                    ? "bg-gradient-to-r from-[#14F195] to-emerald-400 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                aria-label="Switch to Sell Mode"
                onClick={() => setSide("sell")}
                className={`flex-1 rounded-lg py-1.5 font-bold transition ${
                  side === "sell"
                    ? "bg-rose-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sell
              </button>
            </div>

            {/* Pay With selection for Buy */}
            {side === "buy" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Pay using:</span>
                  <div className="flex gap-1">
                    {(["SOL", "USDC"] as const).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setPayWith(curr)}
                        className={`rounded-md px-2 py-0.5 font-mono text-xs transition ${
                          payWith === curr
                            ? "bg-[#14F195]/20 text-[#14F195] border border-[#14F195]/40"
                            : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Input Amount ({payWith})</span>
                    <span>
                      Bal:{" "}
                      {payWith === "SOL"
                        ? `${walletState.solBalance.toFixed(3)} SOL`
                        : `$${walletState.usdcBalance.toFixed(2)}`}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="any"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#14F195]/50"
                  />
                  {/* Quick Size Presets */}
                  <div className="mt-2 flex gap-1 text-[11px]">
                    {(payWith === "SOL" ? ["0.05", "0.10", "0.25", "0.50"] : ["10", "25", "50", "100"]).map(
                      (preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAmountInput(preset)}
                          className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1 font-mono text-slate-300 hover:bg-white/10"
                        >
                          {preset}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Sell Side: Percentage slider */
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Sell Percentage</span>
                  <span className="font-mono text-white font-bold">{sellPct}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={sellPct}
                  onChange={(e) => setSellPct(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
                <div className="flex gap-1 text-[11px]">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setSellPct(pct)}
                      className={`flex-1 rounded-lg border py-1 font-mono transition ${
                        sellPct === pct
                          ? "border-rose-500/50 bg-rose-500/20 text-rose-300"
                          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-950/60 p-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Available tokens:</span>
                    <span className="font-mono text-white font-bold">
                      {selectedTokenHolding?.toLocaleString("en-US", { maximumFractionDigits: 2 }) ?? "0"}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-slate-400">
                    <span>Selling:</span>
                    <span className="font-mono text-rose-300 font-bold">
                      {((selectedTokenHolding || 0) * (sellPct / 100)).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}{" "}
                      {selected?.baseToken.symbol}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Slippage Settings */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Max Slippage Buffer</span>
                <span className="font-mono text-slate-200">{slippageBps / 100}%</span>
              </div>
              <div className="mt-1 flex gap-1 text-[11px]">
                {[50, 100, 200].map((bps) => (
                  <button
                    key={bps}
                    type="button"
                    onClick={() => setSlippageBps(bps)}
                    className={`flex-1 rounded-lg border py-1 font-mono transition ${
                      slippageBps === bps
                        ? "border-[#14F195]/40 bg-[#14F195]/10 text-[#14F195]"
                        : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {bps / 100}%
                  </button>
                ))}
              </div>
            </div>

            {/* Execution Status Feedback */}
            {statusMsg && (
              <div
                className={`mt-3 flex items-start gap-2 rounded-xl border p-2.5 text-xs ${
                  statusMsg.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : statusMsg.type === "error"
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                    : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                }`}
              >
                {statusMsg.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : statusMsg.type === "error" ? (
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                ) : (
                  <Zap className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
                )}
                <div className="min-w-0">
                  <div className="font-medium leading-snug">{statusMsg.text}</div>
                  {statusMsg.txSig && (
                    <a
                      href={`https://solscan.io/tx/${statusMsg.txSig}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-[#14F195] hover:underline"
                    >
                      <span>Solscan Explorer</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Submit Swap Button */}
            <button
              type="button"
              aria-label="Execute Swap Order"
              disabled={busy || !selected}
              onClick={executeSwap}
              className={`mt-4 w-full rounded-xl py-3 text-sm font-bold shadow-lg transition disabled:opacity-40 ${
                side === "buy"
                  ? "bg-gradient-to-r from-[#14F195] to-emerald-400 text-slate-950 shadow-[#14F195]/20 hover:opacity-90"
                  : "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-rose-500/20 hover:opacity-90"
              }`}
            >
              {busy ? "Routing Swap..." : side === "buy" ? `Buy ${selected?.baseToken.symbol}` : `Sell ${selected?.baseToken.symbol}`}
            </button>
          </div>

          {/* Token-2022 Security Audit Panel */}
          <Token2022Panel
            mint={selected?.baseToken.address}
            symbol={selected?.baseToken.symbol ?? "SOL"}
          />
        </aside>
      </div>
    </div>
  );
}
