/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Coins,
  TrendingUp,
  Flame,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Gift,
  RefreshCw,
  Lock,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  type PlayerProfile,
  INITIAL_JOLSEL_STATS,
  type JolselTokenStats,
  savePlayerProfile,
} from "../../lib/gameEconomy";

interface CoinPageProps {
  player: PlayerProfile;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerProfile>>;
  onNavigateToPerps?: () => void;
  onNavigateToCore?: () => void;
}

export function CoinPage({
  player,
  setPlayer,
  onNavigateToPerps,
  onNavigateToCore,
}: CoinPageProps) {
  const [stats, setStats] = useState<JolselTokenStats>(INITIAL_JOLSEL_STATS);
  const [stakeAmount, setStakeAmount] = useState<string>("2500");
  const [stakedBalance, setStakedBalance] = useState<number>(5000);
  const [faucetCooldown, setFaucetCooldown] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState<"1H" | "24H" | "7D" | "ALL">("24H");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Simulated SVG Candlestick / Price Chart Points
  const chartPoints = [
    { time: "00:00", price: 0.0352 },
    { time: "04:00", price: 0.0368 },
    { time: "08:00", price: 0.0394 },
    { time: "12:00", price: 0.0381 },
    { time: "16:00", price: 0.0415 },
    { time: "20:00", price: 0.0439 },
    { time: "Now", price: 0.0425 },
  ];

  const minPrice = 0.034;
  const maxPrice = 0.046;
  const range = maxPrice - minPrice;

  // Stake tokens
  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(stakeAmount);
    if (isNaN(amt) || amt <= 0 || amt > player.jolselBalance) {
      setActionMessage("Invalid amount or insufficient $JOLSEL balance.");
      return;
    }
    const updated: PlayerProfile = {
      ...player,
      jolselBalance: player.jolselBalance - amt,
      xp: player.xp + 100,
    };
    setStakedBalance((prev) => prev + amt);
    setPlayer(updated);
    savePlayerProfile(updated);
    setActionMessage(`Successfully staked ${amt.toLocaleString()} $JOLSEL! Earning 24.8% APR.`);
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Claim Faucet Bonus
  const handleClaimFaucet = () => {
    if (faucetCooldown) return;
    const bonus = 1000;
    const updated: PlayerProfile = {
      ...player,
      jolselBalance: player.jolselBalance + bonus,
      xp: player.xp + 50,
    };
    setPlayer(updated);
    savePlayerProfile(updated);
    setFaucetCooldown(true);
    setActionMessage(`+${bonus.toLocaleString()} $JOLSEL Airdropped from Faucet!`);
    setTimeout(() => {
      setFaucetCooldown(false);
      setActionMessage(null);
    }, 15000);
  };

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
            $J
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                JOLSEL In-Game Coin ($JOLSEL)
              </h1>
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-300">
                DEVNET NATIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              The mathematical governance and trading fuel powering the Jolsel Firm 17-agent scoring ecosystem.
            </p>
          </div>
        </div>

        {/* Faucet Claim Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClaimFaucet}
            disabled={faucetCooldown}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-md ${
              faucetCooldown
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
                : "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-amber-500/20"
            }`}
          >
            <Gift className="h-4 w-4" />
            <span>{faucetCooldown ? "Faucet Cooling Down..." : "Claim +1,000 $JOLSEL Faucet"}</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="rounded-xl bg-amber-500/20 border border-amber-500/40 p-3 text-xs font-bold text-amber-200 animate-pulse text-center">
          {actionMessage}
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400">Mark Price</span>
          <p className="mt-1 font-mono text-xl font-bold text-white">
            ${stats.priceUsd.toFixed(4)}
          </p>
          <span className="text-[11px] font-mono font-bold text-emerald-400">
            +{stats.change24h}% (24h)
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400">Market Cap</span>
          <p className="mt-1 font-mono text-xl font-bold text-white">
            ${(stats.marketCapUsd / 1000000).toFixed(1)}M
          </p>
          <span className="text-[10px] text-slate-500">Fully Diluted</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400">24H Volume</span>
          <p className="mt-1 font-mono text-xl font-bold text-cyan-300">
            ${(stats.volume24hUsd / 1000000).toFixed(2)}M
          </p>
          <span className="text-[10px] text-slate-500">Devnet Trades</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400">Circulating</span>
          <p className="mt-1 font-mono text-xl font-bold text-slate-200">
            240M
          </p>
          <span className="text-[10px] text-slate-500">of 1,000,000,000</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400">Staking APR</span>
          <p className="mt-1 font-mono text-xl font-bold text-emerald-400">
            {stats.stakingAprPct}%
          </p>
          <span className="text-[10px] text-slate-500">Compounding daily</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400">Vault Backing</span>
          <p className="mt-1 font-mono text-xl font-bold text-[#14F195]">
            {stats.vaultBackingSol.toLocaleString()} SOL
          </p>
          <span className="text-[10px] text-slate-500">Autonomous reserve</span>
        </div>
      </div>

      {/* Main Grid: Live Interactive Chart (8 cols) + Staking & Utility (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Live Price Chart (8 cols) */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-xl shadow-2xl lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4 mb-4">
              <div>
                <span className="font-mono text-2xl font-black text-white">
                  ${stats.priceUsd.toFixed(4)} USD
                </span>
                <span className="ml-2 font-mono text-xs font-bold text-emerald-400">
                  +$0.0073 (+18.4%)
                </span>
              </div>

              {/* Timeframe buttons */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-950 p-1 border border-white/10">
                {(["1H", "24H", "7D", "ALL"] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setActiveTimeframe(tf)}
                    className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition ${
                      activeTimeframe === tf
                        ? "bg-amber-400 text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Price Chart Graphic */}
            <div className="relative h-64 sm:h-72 w-full pt-4">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 600 240">
                <defs>
                  <linearGradient id="chartGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                {[0, 60, 120, 180, 240].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="600"
                    y2={y}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Area under curve */}
                <path
                  d={`M 0,${240 - ((chartPoints[0].price - minPrice) / range) * 220}
                     C 100,${240 - ((chartPoints[1].price - minPrice) / range) * 220}
                       200,${240 - ((chartPoints[2].price - minPrice) / range) * 220}
                       300,${240 - ((chartPoints[3].price - minPrice) / range) * 220}
                     S 450,${240 - ((chartPoints[5].price - minPrice) / range) * 220}
                       600,${240 - ((chartPoints[6].price - minPrice) / range) * 220}
                     L 600,240 L 0,240 Z`}
                  fill="url(#chartGlow)"
                />

                {/* Main line path */}
                <path
                  d={`M 0,${240 - ((chartPoints[0].price - minPrice) / range) * 220}
                     C 100,${240 - ((chartPoints[1].price - minPrice) / range) * 220}
                       200,${240 - ((chartPoints[2].price - minPrice) / range) * 220}
                       300,${240 - ((chartPoints[3].price - minPrice) / range) * 220}
                     S 450,${240 - ((chartPoints[5].price - minPrice) / range) * 220}
                       600,${240 - ((chartPoints[6].price - minPrice) / range) * 220}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                />

                {/* Points */}
                {chartPoints.map((pt, i) => {
                  const cx = (i / (chartPoints.length - 1)) * 600;
                  const cy = 240 - ((pt.price - minPrice) / range) * 220;
                  return (
                    <g key={pt.time}>
                      <circle cx={cx} cy={cy} r="4" fill="#020617" stroke="#fbbf24" strokeWidth="2" />
                      <text
                        x={cx}
                        y="235"
                        fill="#64748b"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {pt.time}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-slate-400">
            <span className="font-mono">Bonding Curve: Bancor Staking Formula · Real Devnet Sim</span>
            <button
              type="button"
              onClick={onNavigateToPerps}
              className="text-[#14F195] font-bold hover:underline flex items-center gap-1"
            >
              <span>Trade $JOLSEL Perpetuals (Up to 30x)</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right: In-Game Staking Pool & Utility (4 cols) */}
        <div className="space-y-4 lg:col-span-4">
          {/* Staking Card */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                In-Game Staking Vault
              </span>
              <Lock className="h-4 w-4 text-amber-400" />
            </div>

            <div className="space-y-1 font-mono">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Your Staked:</span>
                <span className="font-bold text-amber-300">{stakedBalance.toLocaleString()} $JOLSEL</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Wallet Available:</span>
                <span className="font-bold text-white">{player.jolselBalance.toLocaleString()} $JOLSEL</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Estimated Yield:</span>
                <span className="font-bold text-emerald-400">+{(stakedBalance * 0.248 / 365).toFixed(1)} / day</span>
              </div>
            </div>

            <form onSubmit={handleStake} className="space-y-3 pt-2">
              <div>
                <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                  Stake Amount ($JOLSEL)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                    placeholder="e.g. 1000"
                  />
                  <button
                    type="button"
                    onClick={() => setStakeAmount(player.jolselBalance.toString())}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-amber-400 hover:underline"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-300 transition shadow-md shadow-amber-400/20"
              >
                Stake $JOLSEL & Earn 24.8% APR
              </button>
            </form>
          </div>

          {/* Council Weight Utility */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>17-Desk Quorum Weight</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Holding and staking $JOLSEL gives you direct voting multiplier on the 17-agent War Room decisions. Each 5,000 $JOLSEL gives your call +1 seat on the Executive Chamber.
            </p>
            <button
              type="button"
              onClick={onNavigateToCore}
              className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View Active Mandate in War Room</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
