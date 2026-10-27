import React, { useState } from "react";
import { type WalletState } from "../../lib/wallet";
import { formatUsd } from "../../lib/dexscreener";
import {
  Shield,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  CheckCircle,
  Clock,
  Layers,
} from "lucide-react";

interface TreasuryProps {
  walletState: WalletState;
  onNavigateToTerminal: () => void;
}

export function Treasury({ walletState, onNavigateToTerminal }: TreasuryProps) {
  const [timeframe, setTimeframe] = useState<"1D" | "7D" | "30D" | "All">("7D");

  const solPrice = 180;
  const solValue = walletState.solBalance * solPrice;
  const usdcValue = walletState.usdcBalance;
  const positionsEstimate = 1450.0;
  const totalTreasuryValue = solValue + usdcValue + positionsEstimate;

  const solPercent = Math.round((solValue / totalTreasuryValue) * 100);
  const usdcPercent = Math.round((usdcValue / totalTreasuryValue) * 100);
  const posPercent = 100 - solPercent - usdcPercent;

  const [recentTxs] = useState([
    { type: "BUY", token: "BONK", amount: "1,250,000", value: "$26.75", time: "3m ago", status: "confirmed" },
    { type: "BUY", token: "WIF", amount: "40.5", value: "$100.44", time: "18m ago", status: "confirmed" },
    { type: "SELL", token: "POPCAT", amount: "75", value: "$100.50", time: "1h ago", status: "confirmed" },
    { type: "BUY", token: "FARTCOIN", amount: "150", value: "$102.60", time: "3h ago", status: "confirmed" },
    { type: "SELL", token: "JUP", amount: "92", value: "$99.36", time: "6h ago", status: "confirmed" },
  ]);

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-6 space-y-6">
      {/* Treasury Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl flex items-center gap-2">
            <Shield className="h-7 w-7 text-[#14F195]" />
            <span>Jolsel Firm On-Chain Treasury</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous Vault Management · Multi-Strategy Capital Allocation · Real-time Solscan Ledger
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToTerminal}
          className="rounded-xl bg-gradient-to-r from-[#14F195] to-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-[#14F195]/20 hover:opacity-90 transition"
        >
          Open Trading Terminal →
        </button>
      </div>

      {/* Top Value Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Total Treasury Capital
          </div>
          <div className="mt-2 font-mono text-3xl font-extrabold text-white">
            {formatUsd(totalTreasuryValue)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+14.8% all-time equity growth</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Liquid SOL Reserve
          </div>
          <div className="mt-2 font-mono text-3xl font-extrabold text-[#14F195]">
            {walletState.solBalance.toFixed(4)} SOL
          </div>
          <div className="mt-1 text-xs text-slate-400">
            ≈ {formatUsd(solValue)} USD reserve ({solPercent}% of vault)
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Active Strategy Allocations
          </div>
          <div className="mt-2 font-mono text-3xl font-extrabold text-white">
            {recentTxs.length} Live Pairs
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Avg trade conviction: 88.5% · Zero liquidation cascade
          </div>
        </div>
      </div>

      {/* Main Grid: Equity Chart + Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Treasury Performance Chart (7 cols) */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Treasury Equity Curve</h2>
              <p className="text-[11px] text-slate-400">Net asset value trajectory over time</p>
            </div>

            <div className="flex rounded-lg border border-white/10 bg-slate-950 p-1 text-xs">
              {(["1D", "7D", "30D", "All"] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`rounded-md px-2.5 py-1 font-mono transition ${
                    timeframe === tf
                      ? "bg-[#14F195] text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Visual Equity Curve */}
          <div className="h-64 w-full rounded-xl border border-white/5 bg-slate-950/80 p-4">
            <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14F195" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#14F195" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.05)" />

              {/* Area */}
              <polygon
                points="0,170 60,155 120,162 180,135 240,140 300,105 360,115 420,70 500,45 500,200 0,200"
                fill="url(#equityGrad)"
              />
              {/* Line */}
              <polyline
                points="0,170 60,155 120,162 180,135 240,140 300,105 360,115 420,70 500,45"
                fill="none"
                stroke="#14F195"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="mt-4 flex justify-between text-xs text-slate-400">
            <span>Starting Capital: $2,850.00</span>
            <span className="font-bold text-[#14F195]">Current: {formatUsd(totalTreasuryValue)}</span>
          </div>
        </div>

        {/* Audit Transaction Ledger (5 cols) */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">RecordKeeper Ledger</h2>
              <p className="text-[11px] text-slate-400">Confirmed on-chain swaps & fills</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Live Audited
            </span>
          </div>

          <div className="space-y-2.5">
            {recentTxs.map((tx, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/60 p-3 hover:border-white/10 transition"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-lg px-2 py-1 font-mono text-[10px] font-extrabold ${
                      tx.type === "BUY"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {tx.type}
                  </span>
                  <div>
                    <div className="font-bold text-white text-xs">{tx.token}</div>
                    <div className="text-[10px] text-slate-400">{tx.amount} tokens</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-white">{tx.value}</div>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{tx.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vault Asset Allocation Breakdown */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
        <h2 className="text-base font-bold text-white mb-4">Asset Class Allocation</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">SOL Reserve</span>
              <span className="font-mono text-[#14F195] font-bold">{solPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#14F195] to-emerald-400"
                style={{ width: `${solPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400">{formatUsd(solValue)}</div>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">USDC Stables</span>
              <span className="font-mono text-cyan-400 font-bold">{usdcPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                style={{ width: `${usdcPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400">{formatUsd(usdcValue)}</div>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">Active Momentum Positions</span>
              <span className="font-mono text-purple-400 font-bold">{posPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-[#9945FF]"
                style={{ width: `${posPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400">{formatUsd(positionsEstimate)}</div>
          </div>
        </div>
      </div>

      {/* Compliance & Risk Parameters Governance */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="h-5 w-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">Compliance & Risk Parameters</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
            <span className="text-[10px] text-slate-500 uppercase font-bold">MrGrumpy Zero-Tolerance</span>
            <div className="font-mono text-base font-bold text-white mt-1">Score ≥ 75.0</div>
            <p className="text-[10px] text-slate-400 mt-1">Trades below 75 automatically vetoed</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
            <span className="text-[10px] text-slate-500 uppercase font-bold">RiskManager Survival Floor</span>
            <div className="font-mono text-base font-bold text-white mt-1">Max 25% Single Position</div>
            <p className="text-[10px] text-slate-400 mt-1">Prevents overconcentration drawdown</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Reviewer Contract Check</span>
            <div className="font-mono text-base font-bold text-emerald-400 mt-1">Freeze Auth Revocation</div>
            <p className="text-[10px] text-slate-400 mt-1">Active freeze authority triggers veto</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Trader Slippage Guard</span>
            <div className="font-mono text-base font-bold text-violet-400 mt-1">Max 150 bps</div>
            <p className="text-[10px] text-slate-400 mt-1">Auto-rejects toxic MEV sandwiching</p>
          </div>
        </div>
      </div>
    </div>
  );
}
