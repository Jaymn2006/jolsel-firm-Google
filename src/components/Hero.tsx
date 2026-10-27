import React from "react";
import { Terminal, Shield, ArrowRight, ExternalLink, Cpu, CheckCircle } from "lucide-react";

interface HeroProps {
  onOpenTerminal: () => void;
  onOpenTreasury: () => void;
}

export function Hero({ onOpenTerminal, onOpenTreasury }: HeroProps) {
  return (
    <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:pt-24 lg:pb-28">
      {/* Background Glow Orbs */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#14F195]/20 via-[#9945FF]/20 to-transparent blur-3xl opacity-60" />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Top Status Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#14F195]/30 bg-[#14F195]/10 px-4 py-1.5 text-xs font-semibold text-[#14F195] shadow-sm shadow-[#14F195]/10">
          <span className="h-2 w-2 rounded-full bg-[#14F195] animate-pulse" />
          <span>17 Specialized AI Agents · Solana Native · Production Ready</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
          Jolsel Firm
        </h1>
        <p className="mt-3 text-xl font-bold text-[#14F195] sm:text-2xl md:text-3xl">
          Multi-Agent Solana Trading Firm
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg leading-relaxed">
          A unified corporate engine of specialized AI agents that discover, plan, risk-check, vote,
          execute, and audit trades on Solana — from meme coins to tokenized assets and perpetuals.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onOpenTerminal}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#14F195] to-emerald-400 px-7 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-[#14F195]/25 hover:opacity-95 hover:scale-105 transition"
          >
            <Terminal className="h-4 w-4" />
            <span>Launch Trading Terminal</span>
          </button>

          <button
            type="button"
            onClick={onOpenTreasury}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition"
          >
            <Shield className="h-4 w-4 text-[#14F195]" />
            <span>On-Chain Treasury</span>
          </button>

          <a
            href="https://github.com/Alitiora-Initiative/Jolsel-Firm-Agent"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white hover:border-white/25 transition"
          >
            <span>GitHub Blueprint</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Key Metrics Cards */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Specialized Agents", value: "17+" },
            { label: "Departments", value: "5" },
            { label: "Blockchain", value: "Solana Native" },
            { label: "Self-Custody", value: "Firm & User Key" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-xl backdrop-blur-md"
            >
              <div className="font-mono text-2xl font-extrabold text-white sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] uppercase font-bold tracking-wider text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
