/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Trophy,
  Flame,
  Globe,
  TrendingUp,
  Award,
  Zap,
  Users,
  Search,
  ExternalLink,
} from "lucide-react";
import {
  type PlayerProfile,
  getAugmentedLeaderboard,
  type LeaderboardEntry,
} from "../../lib/gameEconomy";

interface LeaderboardProps {
  player: PlayerProfile;
  onNavigateToPerps?: () => void;
  onNavigateToCore?: () => void;
}

export function Leaderboard({
  player,
  onNavigateToPerps,
  onNavigateToCore,
}: LeaderboardProps) {
  const leaderboard = getAugmentedLeaderboard(player);

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl flex items-center gap-2">
                <span>Global Trader Leaderboard</span>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-xs font-mono text-cyan-400">
                  DEVNET LIVE
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time competitive standings for $JOLSEL traders and perpetual scalpers across the globe.
              </p>
            </div>
          </div>
        </div>

        {/* Current User Quick Badge */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2.5 backdrop-blur-md">
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400">Your Current Rank</span>
            <span className="font-mono text-lg font-black text-[#14F195]">
              #{leaderboard.find((e) => e.isCurrentUser)?.rank || 9}
            </span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-mono text-slate-400">Your Net PnL</span>
            <span className="font-mono text-sm font-extrabold text-amber-300">
              ${player.totalPnlUsd.toFixed(1)} USD
            </span>
          </div>
        </div>
      </div>

      {/* Prize Pool & League Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-slate-950 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-bold">
            <span>WEEKLY PRIZE POOL</span>
            <Trophy className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-white">500,000 $JOLSEL</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Top 10 traders split the devnet treasury pool every Sunday 00:00 UTC.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/60 to-slate-950 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-mono font-bold">
            <span>ACTIVE PLAYERS</span>
            <Users className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-white">1,482 Active</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Representing 42 countries across Americas, Europe, and Asia.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900/60 to-slate-950 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-mono font-bold">
            <span>24H VOLUME</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-white">$42.8M DEVNET</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Spot execution & 50x perpetuals simulated on Devnet.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-slate-900/60 to-slate-950 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-purple-400 font-mono font-bold">
            <span>CURRENT LEADER</span>
            <Award className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-white">QuantumKelly</p>
          <p className="text-[11px] text-slate-400 mt-1">
            +$18,920.40 USD (+284.5%) · 11 Win Streak
          </p>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-slate-950/80 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">Trader</th>
                <th className="py-3.5 px-4">Region / Country</th>
                <th className="py-3.5 px-4 text-right">In-Game $JOLSEL</th>
                <th className="py-3.5 px-4 text-right">Net PnL (USD)</th>
                <th className="py-3.5 px-4 text-right">PnL %</th>
                <th className="py-3.5 px-4 text-right">Win Rate</th>
                <th className="py-3.5 px-4 text-center">Streak</th>
                <th className="py-3.5 px-4">Tier / Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {leaderboard.map((entry) => (
                <tr
                  key={entry.id}
                  className={`transition ${
                    entry.isCurrentUser
                      ? "bg-[#14F195]/10 hover:bg-[#14F195]/15 border-l-4 border-l-[#14F195]"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 font-bold">
                    {entry.rank === 1 && (
                      <span className="inline-flex items-center gap-1 text-amber-400">
                        🥇 1
                      </span>
                    )}
                    {entry.rank === 2 && (
                      <span className="inline-flex items-center gap-1 text-slate-300">
                        🥈 2
                      </span>
                    )}
                    {entry.rank === 3 && (
                      <span className="inline-flex items-center gap-1 text-amber-600">
                        🥉 3
                      </span>
                    )}
                    {entry.rank > 3 && (
                      <span className={entry.isCurrentUser ? "text-[#14F195]" : "text-slate-400"}>
                        #{entry.rank}
                      </span>
                    )}
                  </td>

                  {/* Trader Username */}
                  <td className="py-3.5 px-4 font-sans font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 border border-white/10 text-xs">
                        {entry.avatar === "grok" && "🤖"}
                        {entry.avatar === "sage" && "🧙‍♂️"}
                        {entry.avatar === "degen" && "🦁"}
                        {entry.avatar === "cyberpunk" && "⚡"}
                        {entry.avatar === "doge" && "🐕"}
                      </div>
                      <span className={entry.isCurrentUser ? "text-[#14F195] font-bold" : "text-white"}>
                        {entry.username}
                      </span>
                    </div>
                  </td>

                  {/* Region */}
                  <td className="py-3.5 px-4 font-sans text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3 w-3 text-cyan-400 shrink-0" />
                      <span>{entry.region}</span>
                    </div>
                  </td>

                  {/* Jolsel Balance */}
                  <td className="py-3.5 px-4 text-right font-bold text-amber-300">
                    {entry.jolselBalance.toLocaleString()} $JOLSEL
                  </td>

                  {/* Net PnL USD */}
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                    +${entry.pnlUsd.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </td>

                  {/* PnL % */}
                  <td className="py-3.5 px-4 text-right font-semibold text-emerald-400">
                    +{entry.pnlPct.toFixed(1)}%
                  </td>

                  {/* Win Rate */}
                  <td className="py-3.5 px-4 text-right text-slate-200">
                    {entry.winRatePct.toFixed(1)}%
                  </td>

                  {/* Streak */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/20">
                      <Flame className="h-3 w-3 text-amber-400" />
                      {entry.streak}W
                    </span>
                  </td>

                  {/* Tier Badge */}
                  <td className="py-3.5 px-4">
                    <span className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-300">
                      {entry.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
