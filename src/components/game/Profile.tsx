/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  User,
  Globe,
  Shield,
  Bot,
  Flame,
  Award,
  Wallet,
  Settings,
  CheckCircle,
  Save,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  type PlayerProfile,
  savePlayerProfile,
} from "../../lib/gameEconomy";

interface ProfileProps {
  player: PlayerProfile;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerProfile>>;
}

const REGION_OPTIONS = [
  "USA (Miami, FL)",
  "USA (New York, NY)",
  "USA (California, SF)",
  "UK (London)",
  "Japan (Tokyo)",
  "Singapore",
  "Germany (Berlin)",
  "UAE (Dubai)",
  "Australia (Sydney)",
  "South Korea (Seoul)",
  "Brazil (São Paulo)",
  "Canada (Toronto)",
];

const AVATAR_OPTIONS = [
  { id: "grok", label: "Grok Cyber", icon: "🤖" },
  { id: "sage", label: "Quantum Sage", icon: "🧙‍♂️" },
  { id: "degen", label: "Solana Degen", icon: "🦁" },
  { id: "cyberpunk", label: "Neon Runner", icon: "⚡" },
  { id: "doge", label: "Diamond Doge", icon: "🐕" },
];

export function Profile({ player, setPlayer }: ProfileProps) {
  const [username, setUsername] = useState(player.username);
  const [region, setRegion] = useState(player.region);
  const [avatar, setAvatar] = useState(player.avatar);
  const [riskTolerance, setRiskTolerance] = useState(player.riskTolerance);
  const [grokPersonality, setGrokPersonality] = useState(player.grokPersonality);
  const [soundEffects, setSoundEffects] = useState(player.soundEffects);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PlayerProfile = {
      ...player,
      username,
      region,
      avatar,
      riskTolerance,
      grokPersonality,
      soundEffects,
    };
    setPlayer(updated);
    savePlayerProfile(updated);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div className="mx-auto max-w-[1400px] p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#14F195] to-[#9945FF] text-xl shadow-lg shadow-[#14F195]/20">
            {AVATAR_OPTIONS.find((a) => a.id === player.avatar)?.icon || "🤖"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {player.username}
              </h1>
              <span className="rounded-full bg-[#14F195]/20 border border-[#14F195]/30 px-2.5 py-0.5 text-xs font-mono font-bold text-[#14F195]">
                Level {player.level} Trader
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 font-sans">
              <Globe className="h-3 w-3 text-cyan-400" />
              <span>{player.region}</span>
              <span>·</span>
              <span className="font-mono text-slate-300">XP: {player.xp}</span>
            </p>
          </div>
        </div>

        {savedNotification && (
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 animate-pulse">
            <CheckCircle className="h-4 w-4" />
            <span>Preferences saved successfully!</span>
          </div>
        )}
      </div>

      {/* Grid: Player Stats + Profile Customization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Stats & Trophy Cabinet (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          {/* Card: Balances */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                In-Game Vault Balances
              </span>
              <Wallet className="h-4 w-4 text-[#14F195]" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl bg-slate-950/70 p-3 border border-white/5">
                <span className="text-[10px] uppercase font-mono text-slate-400">JOLSEL Token</span>
                <p className="mt-1 font-mono text-lg font-bold text-amber-300">
                  {player.jolselBalance.toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-500">In-game governance</span>
              </div>
              <div className="rounded-xl bg-slate-950/70 p-3 border border-white/5">
                <span className="text-[10px] uppercase font-mono text-slate-400">Devnet SOL</span>
                <p className="mt-1 font-mono text-lg font-bold text-[#14F195]">
                  {player.devnetSolBalance.toFixed(3)} SOL
                </p>
                <span className="text-[10px] text-slate-500">Gas & collateral</span>
              </div>
            </div>
          </div>

          {/* Card: Performance Metrics */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-2xl space-y-3">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
              Combat & Trading Metrics
            </span>

            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
              <div className="rounded-xl bg-slate-950/70 p-2.5 border border-white/5">
                <span className="text-[10px] text-slate-400">Total Trades</span>
                <p className="text-base font-bold text-white mt-0.5">{player.totalTrades}</p>
              </div>
              <div className="rounded-xl bg-slate-950/70 p-2.5 border border-white/5">
                <span className="text-[10px] text-slate-400">Win Rate</span>
                <p className="text-base font-bold text-emerald-400 mt-0.5">
                  {player.totalTrades > 0 ? ((player.winCount / player.totalTrades) * 100).toFixed(0) : 75}%
                </p>
              </div>
              <div className="rounded-xl bg-slate-950/70 p-2.5 border border-white/5">
                <span className="text-[10px] text-slate-400">Current Streak</span>
                <p className="text-base font-bold text-amber-300 mt-0.5">🔥 {player.winStreak}W</p>
              </div>
            </div>

            <div className="flex justify-between items-center rounded-xl bg-slate-950/70 p-3 border border-white/5 font-mono text-xs">
              <span className="text-slate-400">All-Time Net PnL:</span>
              <span className="font-bold text-emerald-400 text-sm">
                +${player.totalPnlUsd.toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Card: Badges Cabinet */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                Unlocked Badges & Achievements
              </span>
              <Award className="h-4 w-4 text-amber-400" />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {player.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-300 flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{badge.replace(/_/g, " ")}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Preferences Form (7 cols) */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-xl shadow-2xl lg:col-span-7">
          <div className="border-b border-white/10 pb-3 mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="h-4 w-4 text-cyan-400" />
              <span>Player Customization & Preferences</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure your regional location, trading profile, and Grok bot parameters.
            </p>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            {/* Player Username */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Player Callsign / Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-[#14F195] focus:outline-none font-mono"
                placeholder="e.g. SatoshiWhale_01"
                required
              />
            </div>

            {/* Region / Country */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Location & Region (Fulfills Localized User Preference)
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-[#14F195] focus:outline-none font-mono"
              >
                {REGION_OPTIONS.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Player Avatar Emblem
              </label>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatar(av.id)}
                    className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition border ${
                      avatar === av.id
                        ? "border-[#14F195] bg-[#14F195]/15 text-white shadow-md shadow-[#14F195]/20"
                        : "border-white/10 bg-slate-950 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <span className="text-xl mb-1">{av.icon}</span>
                    <span className="text-[10px] font-mono leading-tight">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Tolerance Profile */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Risk Appetite & Calculus Modeling
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "calculus_whale", label: "Kelly Optimal", desc: "Mathematical sizing" },
                  { id: "balanced", label: "Balanced", desc: "5-10% sizing" },
                  { id: "conservative", label: "Conservative", desc: "Max 3% size" },
                  { id: "degen", label: "Full Degen", desc: "Max leverage" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setRiskTolerance(mode.id as PlayerProfile["riskTolerance"])}
                    className={`rounded-xl p-2.5 text-left border transition ${
                      riskTolerance === mode.id
                        ? "border-cyan-400 bg-cyan-500/15 text-white"
                        : "border-white/10 bg-slate-950 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <p className="font-mono text-xs font-bold">{mode.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{mode.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Grok Bot Companion Personality */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Grok AI Bot Companion Voice
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "sarcastic_genius", label: "Sarcastic Genius", icon: "😏" },
                  { id: "hype_coach", label: "Hype Coach", icon: "🚀" },
                  { id: "grumpy_risk", label: "Zero-Tolerance Grumpy", icon: "🧐" },
                  { id: "zen_master", label: "Zen Master", icon: "🧘‍♂️" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setGrokPersonality(mode.id as PlayerProfile["grokPersonality"])}
                    className={`flex items-center gap-2 rounded-xl p-2.5 text-left border transition ${
                      grokPersonality === mode.id
                        ? "border-purple-400 bg-purple-500/15 text-white"
                        : "border-white/10 bg-slate-950 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <span className="text-lg">{mode.icon}</span>
                    <span className="font-mono text-xs font-bold">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-white/5">
              <div className="flex items-center gap-2">
                {soundEffects ? (
                  <Volume2 className="h-4 w-4 text-[#14F195]" />
                ) : (
                  <VolumeX className="h-4 w-4 text-slate-500" />
                )}
                <div>
                  <p className="text-xs font-bold text-white">Audio & Trade Effects</p>
                  <p className="text-[10px] text-slate-400">Play acoustic confirmation on fills and liquidation alerts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSoundEffects(!soundEffects)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  soundEffects ? "bg-[#14F195]" : "bg-slate-800"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    soundEffects ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#14F195] py-3 text-xs font-extrabold text-slate-950 hover:bg-[#14F195]/90 shadow-lg shadow-[#14F195]/20 transition"
            >
              <Save className="h-4 w-4" />
              <span>Save Profile & Sync Preferences</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
