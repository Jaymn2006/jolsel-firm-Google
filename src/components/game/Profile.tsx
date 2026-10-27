/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  User,
  Shield,
  Trophy,
  Flame,
  Globe,
  Wallet,
  Zap,
  CheckCircle,
  Copy,
  RefreshCw,
  Sparkles,
  Bot,
  Volume2,
  Gift,
  Award,
  Layers,
} from "lucide-react";
import type { PlayerProfile } from "../../lib/gameEconomy";
import type { WalletState } from "../../lib/wallet";
import type { UserGeoLocation } from "../../lib/location";
import { playSfx } from "../../lib/sound";

interface ProfileProps {
  player: PlayerProfile;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerProfile>>;
  walletState: WalletState;
  userLocation: UserGeoLocation | null;
  onRefreshLocation?: () => void;
  onOpenAirdropModal: () => void;
}

const AVATARS = [
  { id: "jolsy", label: "Jolsy Cyber", icon: "🤖" },
  { id: "sage", label: "Stochastic Sage", icon: "🧙‍♂️" },
  { id: "degen", label: "Apex Trench Raider", icon: "🦁" },
  { id: "cyberpunk", label: "Neon Scalper", icon: "⚡" },
  { id: "doge", label: "Doge Quant", icon: "🐕" },
];

const JOLSY_MODES = [
  { id: "sarcastic_genius", label: "Sarcastic Genius", desc: "Sharp mathematical quips and probability roasts" },
  { id: "hype_coach", label: "Hype Coach", desc: "Relentless positive reinforcement and momentum energy" },
  { id: "grumpy_risk", label: "Grumpy Risk Officer", desc: "Strict margin warnings and anti-liquidation discipline" },
  { id: "zen_master", label: "Zen Master", desc: "Equilibrium mindset, patience, and harmonic order flow" },
];

export function Profile({
  player,
  setPlayer,
  walletState,
  userLocation,
  onRefreshLocation,
  onOpenAirdropModal,
}: ProfileProps) {
  const [username, setUsername] = useState(player.username);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopyAddress = () => {
    playSfx("click");
    navigator.clipboard?.writeText(walletState.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playSfx("win");
    const updated: PlayerProfile = {
      ...player,
      username: username.trim() || player.username,
      region: userLocation ? `${userLocation.city}, ${userLocation.country}` : player.region,
      latitude: userLocation?.latitude ?? player.latitude,
      longitude: userLocation?.longitude ?? player.longitude,
    };
    setPlayer(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const xpNextLevel = player.level * 500;
  const xpCurrentLevelProgress = player.xp % 500;
  const progressPct = Math.min(100, Math.round((xpCurrentLevelProgress / 500) * 100));

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Profile Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              PLAYER PROFILE & SETTINGS
            </h1>
            <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
              LEVEL {player.level}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Manage your on-chain Devnet identity, detected real location, Jolsy copilot voice, and trading perks.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 animate-in fade-in">
            <CheckCircle className="h-4 w-4" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Player Identity Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-[#14F195]/20 border border-[#14F195]/40 text-3xl shadow-lg">
                {player.avatar === "jolsy" ? "🤖" : player.avatar === "sage" ? "🧙‍♂️" : player.avatar === "degen" ? "🦁" : "⚡"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{player.username}</h2>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <Globe className="h-3 w-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{userLocation ? `${userLocation.city}, ${userLocation.country}` : player.region}</span>
                </div>
              </div>
            </div>

            {/* Level & XP Bar */}
            <div className="mt-6 rounded-xl bg-slate-950/60 p-3.5 border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Experience Points (XP)</span>
                <span className="text-[#14F195] font-bold">{player.xp} XP</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-[#14F195] transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Tier: {player.level >= 5 ? "Diamond Hands" : player.level >= 3 ? "Kelly Scalper" : "Novice Cadet"}</span>
                <span>{500 - xpCurrentLevelProgress} XP to Level {player.level + 1}</span>
              </div>
            </div>

            {/* Wallet Address & Balance */}
            <div className="mt-4 rounded-xl bg-slate-950/60 p-3.5 border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[11px]">Devnet Wallet</span>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono transition"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-slate-200 break-all bg-black/40 p-2 rounded-lg border border-white/5">
                {walletState.address}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">In-Game $JOLSEL</div>
                  <div className="font-bold text-amber-300">{player.jolselBalance.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Devnet SOL</div>
                  <div className="font-bold text-[#14F195]">{player.devnetSolBalance.toFixed(4)} SOL</div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAirdropModal}
            className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition"
          >
            <Gift className="h-4 w-4" />
            <span>Open Genesis Airdrop Faucet</span>
          </button>
        </div>

        {/* Right 2 Columns: Edit Form & Settings */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl space-y-5">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono">
              Identity Configuration
            </h3>

            {/* Username Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Player Handle / Trader Call-Sign
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={24}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs font-medium text-white focus:border-[#14F195] focus:outline-none transition"
              />
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Select Visual Avatar
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setPlayer((prev) => ({ ...prev, avatar: av.id }))}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs transition cursor-pointer ${
                      player.avatar === av.id
                        ? "border-[#14F195] bg-[#14F195]/15 text-white font-bold"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">{av.icon}</span>
                    <span className="truncate">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Real Location Status & GPS */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Real Location Detection (Live Earth Sync)
                </label>
                {onRefreshLocation && (
                  <button
                    type="button"
                    onClick={() => {
                      playSfx("scan");
                      onRefreshLocation();
                    }}
                    className="flex items-center gap-1 text-[11px] text-[#14F195] hover:underline transition"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Re-detect GPS/IP</span>
                  </button>
                )}
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950 p-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Detected City & Country:</span>
                  <span className="font-semibold text-cyan-300">
                    {userLocation ? `${userLocation.city}, ${userLocation.country}` : player.region}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="font-mono text-[11px] text-slate-300">
                    {userLocation ? `${userLocation.latitude.toFixed(4)}°, ${userLocation.longitude.toFixed(4)}°` : "Auto-detected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Detection Method:</span>
                  <span className="font-mono text-[11px] text-[#14F195]">
                    {userLocation?.source === "browser-gps" ? "Precise GPS" : "IP Geolocation API"}
                  </span>
                </div>
              </div>
            </div>

            {/* Jolsy AI Copilot Voice & Personality */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Jolsy AI Copilot Personality
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {JOLSY_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      playSfx("click");
                      setPlayer((prev) => ({ ...prev, jolsyPersonality: mode.id as PlayerProfile["jolsyPersonality"] }));
                    }}
                    className={`flex flex-col text-left rounded-xl border p-2.5 text-xs transition cursor-pointer ${
                      player.jolsyPersonality === mode.id
                        ? "border-cyan-400 bg-cyan-500/15 text-white"
                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="font-bold text-slate-200">{mode.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Unlocked Perks from Mystery Crates */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Active Mystery Crate Perks
              </label>
              <div className="flex flex-wrap gap-2">
                {(player.unlockedPerks && player.unlockedPerks.length > 0) ? (
                  player.unlockedPerks.map((perk, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 font-mono"
                    >
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      <span>{perk.replace(/_/g, " ")}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">
                    No perks unlocked yet. Open Mystery Crates in the top menu to discover rare trading boosts!
                  </span>
                )}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#14F195] py-2.5 text-xs font-extrabold text-slate-950 hover:bg-[#14F195]/90 transition shadow-lg shadow-[#14F195]/20 cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
