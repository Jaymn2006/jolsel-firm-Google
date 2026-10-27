/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Activity,
  Layers,
  LineChart,
  Shield,
  Coins,
  Trophy,
  User,
  Users,
  Wallet,
  ExternalLink,
  ChevronDown,
  Gift,
  RefreshCw,
  CheckCircle,
  TrendingUp,
  Globe,
  Sparkles,
  Package,
} from "lucide-react";
import type { WalletState } from "../lib/wallet";
import type { PlayerProfile } from "../lib/gameEconomy";

export type NavView =
  | "core"
  | "terminal"
  | "perps"
  | "vault"
  | "coin"
  | "globe"
  | "crates"
  | "leaderboard"
  | "profile"
  | "copytrade"
  | "treasury"
  | "overview";

interface HeaderProps {
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  walletState: WalletState;
  player: PlayerProfile;
  firmLive: boolean;
  onToggleFirmLive: () => void;
  onOpenAirdropModal: () => void;
  network: "devnet" | "mainnet-beta";
  setNetwork: (net: "devnet" | "mainnet-beta") => void;
  onToggleWalletMode: () => void;
  onResetFaucet: () => void;
}

export function Header({
  activeView,
  setActiveView,
  walletState,
  player,
  firmLive,
  onToggleFirmLive,
  onOpenAirdropModal,
  network,
  setNetwork,
  onToggleWalletMode,
  onResetFaucet,
}: HeaderProps) {
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);

  const navItems: { id: NavView; label: string; icon: React.ElementType }[] = [
    { id: "core", label: "Agents Core", icon: Layers },
    { id: "terminal", label: "Spot", icon: LineChart },
    { id: "perps", label: "Perps", icon: TrendingUp },
    { id: "globe", label: "Live Earth", icon: Globe },
    { id: "crates", label: "Mystery Crates", icon: Package },
    { id: "vault", label: "Vault", icon: Shield },
    { id: "coin", label: "Coin", icon: Coins },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "profile", label: "Profile", icon: User },
    { id: "copytrade", label: "CopyTrade", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#040711]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1780px] items-center justify-between gap-2 px-3 py-2.5 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveView("core")}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-[#14F195] text-xs font-black text-slate-950 shadow-md shadow-cyan-500/20 hover:scale-105 transition cursor-pointer"
            title="Jolsel Firm Core"
          >
            JF
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold tracking-tight text-white sm:text-sm">
                JOLSEL FIRM
              </span>
              <button
                type="button"
                onClick={() => setNetwork(network === "devnet" ? "mainnet-beta" : "devnet")}
                className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold transition cursor-pointer ${
                  network === "devnet"
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                    : "bg-[#14F195]/20 text-[#14F195] border border-[#14F195]/30"
                }`}
                title="Click to toggle Devnet / Mainnet"
              >
                {network === "devnet" ? "Devnet Game" : "Mainnet"}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-[#14F195] text-slate-950 shadow-sm shadow-[#14F195]/30 font-bold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Mystery Crates / Airdrop + Firm LIVE + Wallet */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Starter Airdrop / Faucet Claim Pill */}
          <button
            type="button"
            onClick={onOpenAirdropModal}
            className="hidden md:flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 font-mono text-[11px] font-bold text-amber-300 hover:bg-amber-500/25 transition cursor-pointer"
            title="Claim 10,000 $JOLSEL + 1 SOL Genesis Airdrop"
          >
            <Gift className="h-3.5 w-3.5 text-amber-400" />
            <span>{player.jolselBalance.toLocaleString()} $JOLSEL</span>
          </button>

          {/* Firm LIVE Toggle */}
          <button
            type="button"
            onClick={onToggleFirmLive}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
              firmLive
                ? "border border-[#14F195]/40 bg-[#14F195]/15 text-[#14F195]"
                : "border border-white/15 bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
            title="Toggle autonomous 17-agent scoring loop"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${firmLive ? "bg-[#14F195] animate-ping" : "bg-slate-500"}`} />
            <span className="hidden sm:inline">{firmLive ? "Firm LIVE" : "PAUSED"}</span>
            <span className="sm:hidden">{firmLive ? "LIVE" : "OFF"}</span>
          </button>

          {/* Wallet Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setWalletMenuOpen(!walletMenuOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:border-[#14F195]/40 transition cursor-pointer"
            >
              <Wallet className="h-3.5 w-3.5 text-[#14F195]" />
              <span className="font-mono text-white text-[11px] font-bold">
                {player.devnetSolBalance.toFixed(2)} SOL
              </span>
              <ChevronDown className="h-3 w-3 text-slate-500" />
            </button>

            {walletMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-slate-900 p-3.5 shadow-2xl backdrop-blur-xl z-50">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                  <div className="text-xs font-bold text-white">Player Wallet</div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                    <CheckCircle className="h-3 w-3" /> Devnet Connected
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Player:</span>
                    <span className="font-bold text-white">{player.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Region:</span>
                    <span className="text-slate-200">{player.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Address:</span>
                    <span className="font-mono text-[11px] text-slate-200">
                      {walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Devnet SOL:</span>
                    <span className="font-mono font-bold text-[#14F195]">
                      {player.devnetSolBalance.toFixed(4)} SOL
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">In-Game $JOLSEL:</span>
                    <span className="font-mono font-bold text-amber-300">
                      {player.jolselBalance.toLocaleString()} $JOLSEL
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-2 border-t border-white/10 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleWalletMode();
                      setWalletMenuOpen(false);
                    }}
                    className="w-full rounded-xl bg-white/5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition cursor-pointer"
                  >
                    {walletState.isPaperWallet ? "Connect Phantom / Solflare" : "Switch to Game In-Browser Mode"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetFaucet();
                      setWalletMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-1 rounded-xl bg-[#14F195]/10 py-1.5 text-xs font-semibold text-[#14F195] hover:bg-[#14F195]/20 transition cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Devnet Faucet (+1.0 SOL)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
