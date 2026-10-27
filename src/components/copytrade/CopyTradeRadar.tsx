import React, { useState } from "react";
import { INITIAL_WHALES, type WhaleProfile } from "../../lib/copytrade";
import { formatUsd } from "../../lib/dexscreener";
import {
  Users,
  TrendingUp,
  Activity,
  Check,
  Zap,
  Sliders,
  ExternalLink,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react";

interface CopyTradeRadarProps {
  onMirrorTrade: (whale: WhaleProfile) => void;
}

export function CopyTradeRadar({ onMirrorTrade }: CopyTradeRadarProps) {
  const [whales, setWhales] = useState<WhaleProfile[]>(INITIAL_WHALES);
  const [copySizeSol, setCopySizeSol] = useState("0.15");
  const [copiedWhaleSuccess, setCopiedWhaleSuccess] = useState<string | null>(null);

  const toggleCopy = (address: string) => {
    const updated = whales.map((w) =>
      w.address === address ? { ...w, activeCopy: !w.activeCopy } : w
    );
    setWhales(updated);
    const target = updated.find((w) => w.address === address);
    if (target?.activeCopy) {
      setCopiedWhaleSuccess(`Mirroring enabled for ${target.label}! Allocating ${copySizeSol} SOL per on-chain signal.`);
      onMirrorTrade(target);
      setTimeout(() => setCopiedWhaleSuccess(null), 4000);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-7 w-7 text-[#14F195]" />
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Whale & Insider CopyTrade Radar
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-Time Solana Smart Money Tracking (FOMO.family / Jupiter tape). Automatically mirror top-tier wallets on Devnet/Mainnet.
          </p>
        </div>

        {/* Global Copy Size Slider */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2">
          <span className="text-xs text-slate-400 font-semibold">Copy Size:</span>
          <div className="flex gap-1.5 text-xs font-mono">
            {["0.05", "0.15", "0.30", "0.50"].map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setCopySizeSol(sz)}
                className={`rounded-lg px-2.5 py-1 transition ${
                  copySizeSol === sz
                    ? "bg-[#14F195] text-slate-950 font-bold"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {sz} SOL
              </button>
            ))}
          </div>
        </div>
      </div>

      {copiedWhaleSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-300">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{copiedWhaleSuccess}</span>
        </div>
      )}

      {/* Whale Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {whales.map((w) => (
          <div
            key={w.address}
            className={`rounded-2xl border p-5 shadow-xl backdrop-blur-md transition ${
              w.activeCopy
                ? "border-[#14F195]/40 bg-slate-900/90 shadow-[#14F195]/10"
                : "border-white/10 bg-slate-900/60"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  w.badge === "Insider Alpha"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : w.badge === "Jupiter Sniper"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                }`}
              >
                {w.badge}
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {w.winRatePct}% Win Rate
              </span>
            </div>

            <h3 className="font-bold text-white text-base">{w.label}</h3>
            <div className="mt-1 flex items-center gap-1 font-mono text-[11px] text-slate-400">
              <span>{w.address.slice(0, 6)}...{w.address.slice(-4)}</span>
              <a
                href={`https://solscan.io/account/${w.address}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-y border-white/5 py-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">7D PnL</span>
                <div className="font-mono font-bold text-emerald-400 mt-0.5">
                  +{formatUsd(w.totalPnl7dUsd)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">7D Volume</span>
                <div className="font-mono font-bold text-white mt-0.5">
                  {formatUsd(w.totalVolume7dUsd)}
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Recent Trade</span>
              <div className="mt-1 flex items-center justify-between font-mono text-[11px]">
                <span className="font-bold text-white">
                  {w.lastTrade.side} {w.lastTrade.amountSol} SOL of {w.lastTrade.symbol}
                </span>
                <span className="text-slate-500">{w.lastTrade.timeAgo}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleCopy(w.address)}
              className={`mt-4 w-full rounded-xl py-2.5 text-xs font-bold shadow-md transition ${
                w.activeCopy
                  ? "bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30"
                  : "bg-gradient-to-r from-[#14F195] to-emerald-400 text-slate-950 hover:opacity-90"
              }`}
            >
              {w.activeCopy ? "Disable Copytrade" : "Copy This Whale"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
