/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Gift, ShieldCheck, Zap, X, ArrowRight, Trophy } from "lucide-react";
import type { PlayerProfile } from "../../lib/gameEconomy";

interface AirdropModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onClaim: () => void;
}

export function AirdropModal({
  isOpen,
  onClose,
  player,
  onClaim,
}: AirdropModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900 to-[#070d1a] p-6 sm:p-8 shadow-2xl shadow-amber-500/20 text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Celebratory Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-[#14F195] text-slate-950 shadow-xl shadow-amber-500/25">
          <Gift className="h-8 w-8 animate-bounce" />
        </div>

        {/* Title */}
        <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 font-mono text-[11px] font-bold text-amber-300">
          SOLANA DEVNET GENESIS AIRDROP
        </span>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Welcome to Jolsel Firm Game!
        </h2>
        <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
          Every new cadet begins with an in-game war chest to trade Spot, 50x Perpetuals, and climb the Global Leaderboard.
        </p>

        {/* Airdrop Contents Box */}
        <div className="my-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
            <span className="text-[10px] uppercase font-mono font-bold text-amber-400">In-Game Tokens</span>
            <p className="mt-1 font-mono text-2xl font-black text-amber-300">+10,000</p>
            <span className="font-mono text-xs text-slate-300 font-bold">$JOLSEL COIN</span>
          </div>

          <div className="rounded-2xl border border-[#14F195]/30 bg-[#14F195]/10 p-4 text-center">
            <span className="text-[10px] uppercase font-mono font-bold text-[#14F195]">Devnet Gas & Margin</span>
            <p className="mt-1 font-mono text-2xl font-black text-[#14F195]">+1.00</p>
            <span className="font-mono text-xs text-slate-300 font-bold">DEVNET SOL</span>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2 text-left text-xs text-slate-300 mb-6 bg-slate-950/60 p-3.5 rounded-2xl border border-white/5 font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>17-Desk Orbital War Room with live Bayesian scoring</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-[#14F195] shrink-0" />
            <span>Futures & Perpetuals up to 50x leverage</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>Global rankings with weekly 500k $JOLSEL prize pool</span>
          </div>
        </div>

        {/* Claim Button */}
        <button
          type="button"
          onClick={() => {
            onClaim();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-[#14F195] py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:opacity-90 shadow-xl shadow-[#14F195]/20 transition"
        >
          <span>Claim 10,000 $JOLSEL & 1 SOL · Enter Game</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
