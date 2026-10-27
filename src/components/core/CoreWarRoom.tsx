/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  type DexPair,
  POPULAR_SOLANA_TOKENS,
  formatUsd,
  formatPct,
} from "../../lib/dexscreener";
import {
  computeProbabilityMatrix,
  type ProbabilityMatrixResult,
} from "../../lib/calculus";
import { type WalletState } from "../../lib/wallet";
import {
  ExternalLink,
} from "lucide-react";

interface CoreWarRoomProps {
  walletState: WalletState;
  setWalletState: React.Dispatch<React.SetStateAction<WalletState>>;
  firmLive: boolean;
  onToggleFirmLive: () => void;
  network: "devnet" | "mainnet-beta";
  setNetwork: (net: "devnet" | "mainnet-beta") => void;
  onNavigateToTerminal?: () => void;
}

interface DeskNodeDef {
  id: string;
  name: string;
  subtitle: string;
  dept: "discovery" | "planning" | "compliance" | "executive" | "audit";
  color: string;
  angleDeg: number;
  orbitRadius: number; // radius in percentage (e.g. 43 for outer, 34 for inner)
  iconType: string;
}

interface StreamMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: string;
}

export function CoreWarRoom({
  walletState,
  setWalletState,
  firmLive,
  onToggleFirmLive,
  network,
  setNetwork,
  onNavigateToTerminal,
}: CoreWarRoomProps) {
  const [cycleNumber, setCycleNumber] = useState(1);
  const [activeDeskIndex, setActiveDeskIndex] = useState(0);
  const [selectedDesk, setSelectedDesk] = useState<DeskNodeDef | null>(null);
  const [crawlerProgress, setCrawlerProgress] = useState(65);

  const [solTape] = useState([
    { symbol: "ELON2028", price: "$0.000512", change: -1.5 },
    { symbol: "TRUMP2028", price: "$0.000533", change: -40.2 },
    { symbol: "CHICO", price: "$0.00645", change: 9.1, isLead: true },
    { symbol: "REMUS", price: "$0.00141", change: 4.1 },
    { symbol: "Shitcoin", price: "$0.000135", change: 63.1 },
    { symbol: "LMAO!", price: "$0.00264", change: -6.7 },
  ]);

  const calculus: ProbabilityMatrixResult = useMemo(() => {
    return computeProbabilityMatrix({
      symbol: "CHICO",
      priceUsd: 0.00645,
      priceChange24h: 9.1,
      volume24h: 3840000,
      liquidityUsd: 820000,
      walletBalanceUsd: walletState.solBalance * 184 + walletState.usdcBalance,
    });
  }, [walletState]);

  // Exact 17 Desks arrayed on staggered dual orbits matching the reference screenshot:
  // Outer radius: ~42%, Inner radius: ~33%
  const desks: DeskNodeDef[] = useMemo(() => {
    return [
      { id: "teacher", name: "Teacher", subtitle: "Pipeline close", dept: "audit", color: "#f97316", angleDeg: 246, orbitRadius: 33, iconType: "book" },
      { id: "bscoter", name: "Bscoter", subtitle: "Scouts liquid pairs", dept: "discovery", color: "#06b6d4", angleDeg: 270, orbitRadius: 42, iconType: "radar" },
      { id: "cryptoguru", name: "Crypto Guru", subtitle: "Crowd velocity", dept: "discovery", color: "#06b6d4", angleDeg: 298, orbitRadius: 40, iconType: "waves" },
      { id: "analuszer", name: "Analuszer", subtitle: "Precision score", dept: "discovery", color: "#06b6d4", angleDeg: 330, orbitRadius: 42, iconType: "chart" },
      { id: "forecaster", name: "Forecaster", subtitle: "Worth-it paths", dept: "planning", color: "#a855f7", angleDeg: 352, orbitRadius: 34, iconType: "trending" },
      { id: "longtermplanner", name: "Long-Term Planner", subtitle: "Asset-class router", dept: "planning", color: "#a855f7", angleDeg: 14, orbitRadius: 42, iconType: "compass" },
      { id: "shorttermplanner", name: "Short-Term Planner", subtitle: "Scale-in steps", dept: "planning", color: "#a855f7", angleDeg: 38, orbitRadius: 34, iconType: "clock" },
      { id: "overthinker", name: "Overthinker", subtitle: "Tail-risk map", dept: "compliance", color: "#eab308", angleDeg: 58, orbitRadius: 42, iconType: "shield" },
      { id: "reviewer", name: "Reviewer", subtitle: "Pool structure", dept: "compliance", color: "#eab308", angleDeg: 78, orbitRadius: 33, iconType: "search" },
      { id: "mrgrumpy", name: "Mr Grumpy", subtitle: "Zero-tolerance gate", dept: "compliance", color: "#eab308", angleDeg: 100, orbitRadius: 42, iconType: "alert" },
      { id: "riskmanager", name: "Risk Manager", subtitle: "Survival floor", dept: "compliance", color: "#f97316", angleDeg: 125, orbitRadius: 39, iconType: "shieldcheck" },
      { id: "broker", name: "Broker", subtitle: "Momentum route", dept: "executive", color: "#14F195", angleDeg: 148, orbitRadius: 42, iconType: "zap" },
      { id: "judge", name: "Judge", subtitle: "Vote aggregate", dept: "executive", color: "#14F195", angleDeg: 168, orbitRadius: 34, iconType: "scales" },
      { id: "verdicter", name: "Verdicter", subtitle: "Signs mandate", dept: "executive", color: "#10b981", angleDeg: 188, orbitRadius: 42, iconType: "check" },
      { id: "trader", name: "Trader", subtitle: "Unsigned Jupiter rou...", dept: "executive", color: "#10b981", angleDeg: 206, orbitRadius: 42, iconType: "arrows" },
      { id: "recordkeeper", name: "Record Keeper", subtitle: "Cycle ledger", dept: "audit", color: "#f97316", angleDeg: 220, orbitRadius: 34, iconType: "database" },
      { id: "recordreviewer", name: "Record Reviewer", subtitle: "Cycle quality", dept: "audit", color: "#f97316", angleDeg: 232, orbitRadius: 42, iconType: "award" },
    ];
  }, []);

  const [streamMessages, setStreamMessages] = useState<StreamMessage[]>([
    {
      id: "msg-1",
      from: "teacher",
      to: "bscoter",
      text: "Pipeline #1 complete. 17 desks reported.",
      timestamp: "12:00:14",
    },
    {
      id: "msg-2",
      from: "reviewer2",
      to: "teacher",
      text: "Mandate recorded. Fill requires a wallet signature.",
      timestamp: "12:00:12",
    },
    {
      id: "msg-3",
      from: "keeper",
      to: "reviewer2",
      text: "Cycle #1 logged. Lead CHICO at $6.45e-3.",
      timestamp: "12:00:10",
    },
    {
      id: "msg-4",
      from: "trader",
      to: "keeper",
      text: "Jupiter route prepared for CHICO (9v4o...pump).",
      timestamp: "12:00:08",
    },
    {
      id: "msg-5",
      from: "verdicter",
      to: "trader",
      text: "Mandate signed for CHICO. Still unsigned - no transaction sent.",
      timestamp: "12:00:06",
    },
    {
      id: "msg-6",
      from: "judge",
      to: "verdicter",
      text: "Votes conform. Score 98 on live tape.",
      timestamp: "12:00:04",
    },
    {
      id: "msg-7",
      from: "broker",
      to: "judge",
      text: "CHICO momentum cleared. Asking the chamber.",
      timestamp: "12:00:02",
    },
    {
      id: "msg-8",
      from: "risk",
      to: "broker",
      text: "No wallet balance on this desk - size stays a quote, not a fill.",
      timestamp: "12:00:00",
    },
    {
      id: "msg-9",
      from: "mrGrumpy",
      to: "risk",
      text: "Tolerances checked. No anomalous liquidity drain.",
      timestamp: "11:59:58",
    },
  ]);

  useEffect(() => {
    if (!firmLive) return;

    const interval = setInterval(() => {
      setActiveDeskIndex((prev) => {
        const next = (prev + 1) % desks.length;
        const currentDesk = desks[next];
        const nextDesk = desks[(next + 1) % desks.length];

        if (next === 0) {
          setCycleNumber((c) => c + 1);
        }

        setCrawlerProgress(((next + 1) / desks.length) * 100);

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

        const sampleTexts = [
          `Pipeline #${cycleNumber} complete. 17 desks reported.`,
          `Mandate recorded. Fill requires a wallet signature.`,
          `Cycle #${cycleNumber} logged. Lead CHICO at $6.45e-3.`,
          `Jupiter route prepared for CHICO (9v4o...pump).`,
          `Mandate signed for CHICO. Still unsigned - no transaction sent.`,
          `Votes conform. Score 98 on live tape.`,
          `CHICO momentum cleared. Asking the chamber.`,
          `Survival floor verified. Quote ready.`,
          `Tolerances checked. No anomalous liquidity drain.`,
        ];

        const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

        setStreamMessages((prevMsgs) => [
          {
            id: `msg-${Date.now()}-${Math.random()}`,
            from: currentDesk.id,
            to: nextDesk.id,
            text,
            timestamp: timeStr,
          },
          ...prevMsgs.slice(0, 24),
        ]);

        return next;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [firmLive, desks, cycleNumber]);

  const renderDeskIcon = (desk: DeskNodeDef, isActive: boolean) => {
    return (
      <div
        className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all duration-300 ${
          isActive
            ? "scale-125 ring-2 ring-white shadow-xl"
            : "hover:scale-110 opacity-95"
        }`}
        style={{
          backgroundColor: "#060913",
          border: `1.5px solid ${desk.color}`,
          boxShadow: isActive ? `0 0 18px ${desk.color}` : `0 0 8px ${desk.color}50`,
        }}
      >
        <span
          className="text-[10px] font-mono font-bold"
          style={{ color: desk.color }}
        >
          {desk.iconType === "radar" && "⊙"}
          {desk.iconType === "book" && "⋀"}
          {desk.iconType === "waves" && "≈"}
          {desk.iconType === "chart" && "📈"}
          {desk.iconType === "trending" && "↗"}
          {desk.iconType === "compass" && "🧭"}
          {desk.iconType === "clock" && "⏱"}
          {desk.iconType === "shield" && "⬡"}
          {desk.iconType === "search" && "🔍"}
          {desk.iconType === "alert" && "⚠"}
          {desk.iconType === "shieldcheck" && "🛡"}
          {desk.iconType === "zap" && "⚡"}
          {desk.iconType === "scales" && "⚖"}
          {desk.iconType === "check" && "✓"}
          {desk.iconType === "arrows" && "⇄"}
          {desk.iconType === "database" && "⌸"}
          {desk.iconType === "award" && "★"}
        </span>
      </div>
    );
  };

  const activeDesk = desks[activeDeskIndex];

  return (
    <div className="relative min-h-[calc(100vh-56px)] w-full overflow-hidden bg-[#050811] text-slate-100 flex flex-col justify-between select-none">
      {/* Background Deep Starfield & Cosmic Noise */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/15 via-[#050811] to-[#020408]" />
      
      {/* Starfield specs */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <span className="absolute top-[15%] left-[22%] h-1 w-1 rounded-full bg-white/70" />
        <span className="absolute top-[32%] left-[82%] h-1 w-1 rounded-full bg-cyan-300/80" />
        <span className="absolute top-[68%] left-[10%] h-1 w-1 rounded-full bg-amber-200/60" />
        <span className="absolute top-[85%] left-[80%] h-1 w-1 rounded-full bg-white/60" />
        <span className="absolute top-[48%] left-[90%] h-1 w-1 rounded-full bg-cyan-400/70" />
        <span className="absolute top-[78%] left-[30%] h-1 w-1 rounded-full bg-purple-300/60" />
      </div>

      {/* Top Center Title Header */}
      <div className="relative z-10 pt-3 pb-1 text-center">
        <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-slate-500 uppercase font-medium">
          REAL-TIME DESK NETWORK · LIVE MESSAGE FLOW · UNSIGNED ROUTES
        </p>
      </div>

      {/* War Room Layout: Left HUD (3 cols), Center Core (6 cols), Right HUD (3 cols) */}
      <div className="relative z-10 mx-auto w-full max-w-[1720px] flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 sm:px-6 items-center">
        
        {/* ================= LEFT HUD COLUMN (3 cols) ================= */}
        <div className="flex flex-col gap-3 lg:col-span-3 max-w-[340px] w-full mx-auto lg:mx-0 self-center">
          
          {/* Card 1: SYSTEM STATUS */}
          <div className="rounded-xl border border-cyan-500/20 bg-[#070d1a]/90 p-3.5 backdrop-blur-md shadow-xl shadow-cyan-950/20">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                SYSTEM STATUS
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Desks</span>
                <span className="font-semibold text-white">17/17</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cycle</span>
                <span className="font-semibold text-white">#{cycleNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Last call</span>
                <span className="font-bold text-emerald-400">LONG</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Messages</span>
                <span className="font-semibold text-white">{17 + cycleNumber * 2}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fills</span>
                <span className="font-semibold text-cyan-400">0 unsigned</span>
              </div>
            </div>
          </div>

          {/* Card 2: SOLANA TAPE DEXSCREENER */}
          <div className="rounded-xl border border-cyan-500/20 bg-[#070d1a]/90 p-3.5 backdrop-blur-md shadow-xl shadow-cyan-950/20">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                SOLANA TAPE
              </span>
              <span className="font-mono text-[10px] font-bold text-cyan-400">
                DEXSCREENER
              </span>
            </div>

            <div className="space-y-1.5">
              {solTape.map((item) => (
                <div
                  key={item.symbol}
                  className={`flex items-center justify-between font-mono text-xs py-0.5 px-1 rounded transition ${
                    item.isLead ? "bg-amber-500/10 border border-amber-500/20" : ""
                  }`}
                >
                  <span className={`font-semibold ${item.isLead ? "text-amber-300" : "text-white"}`}>
                    {item.symbol}
                  </span>
                  <span className="text-slate-300 text-[11px]">{item.price}</span>
                  <span
                    className={`font-semibold text-[11px] ${
                      item.change >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {item.change >= 0 ? `+${item.change}%` : `${item.change}%`}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 border-t border-white/5 pt-2 flex items-center justify-between text-[9px] font-mono text-slate-500">
              <span>LIVE MARKET FEED</span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
          </div>

          {/* Card 3: CRAWLER PROBE */}
          <div className="rounded-xl border border-cyan-500/20 bg-[#070d1a]/90 p-3.5 backdrop-blur-md shadow-xl shadow-cyan-950/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                CRAWLER PROBE
              </span>
            </div>
            <p className="font-mono text-xs font-semibold text-white">
              Visiting {activeDesk?.name.toLowerCase()}
            </p>
            <p className="font-mono text-[11px] text-slate-400 mt-0.5">
              Pipeline #{cycleNumber} complete. 17 desks reported.
            </p>

            <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-[#14F195] transition-all duration-700 shadow-sm"
                style={{ width: `${crawlerProgress}%` }}
              />
            </div>
          </div>

        </div>

        {/* ================= CENTER ORBITAL BLACK HOLE (6 cols) ================= */}
        <div className="relative flex flex-col items-center justify-center lg:col-span-6 min-h-[500px] sm:min-h-[580px] py-2">
          
          <div className="relative h-[420px] w-[420px] sm:h-[520px] sm:w-[520px] flex items-center justify-center">
            
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none z-0"
              viewBox="0 0 520 520"
            >
              <defs>
                <radialGradient id="blackholeCenter" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#000000" stopOpacity="1" />
                  <stop offset="70%" stopColor="#03050b" stopOpacity="0.98" />
                  <stop offset="82%" stopColor="#c2410c" stopOpacity="0.85" />
                  <stop offset="90%" stopColor="#ea580c" stopOpacity="0.95" />
                  <stop offset="96%" stopColor="#f59e0b" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>

                <filter id="glowAccretion">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer Dashed Orbit Ring (radius ~215px) */}
              <circle
                cx="260"
                cy="260"
                r="215"
                fill="none"
                stroke="rgba(249, 115, 22, 0.28)"
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />

              {/* Inner Dashed Orbit Ring (radius ~172px) */}
              <circle
                cx="260"
                cy="260"
                r="172"
                fill="none"
                stroke="rgba(234, 88, 12, 0.38)"
                strokeWidth="1.2"
                strokeDasharray="5 7"
              />

              {/* Glowing Accretion Rim */}
              <circle
                cx="260"
                cy="260"
                r="120"
                fill="none"
                stroke="#ea580c"
                strokeWidth="4"
                filter="url(#glowAccretion)"
                className="opacity-95 animate-pulse"
              />

              {/* Accretion Core Body */}
              <circle
                cx="260"
                cy="260"
                r="116"
                fill="url(#blackholeCenter)"
              />

              {/* Circulating Photons */}
              <g className="animate-spin" style={{ transformOrigin: "260px 260px", animationDuration: "28s" }}>
                <circle cx="260" cy="45" r="2.5" fill="#06b6d4" />
                <path d="M 257 40 L 263 40 L 260 35 Z" fill="#06b6d4" />
              </g>

              <g className="animate-spin" style={{ transformOrigin: "260px 260px", animationDuration: "22s", animationDirection: "reverse" }}>
                <circle cx="260" cy="88" r="2.5" fill="#fbbf24" />
                <path d="M 257 83 L 263 83 L 260 78 Z" fill="#fbbf24" />
              </g>

              {/* Connecting Active Desk Line */}
              {(() => {
                const active = desks[activeDeskIndex];
                const rad = (active.angleDeg * Math.PI) / 180;
                const r = (active.orbitRadius / 50) * 260;
                const x = 260 + r * Math.cos(rad);
                const y = 260 + r * Math.sin(rad);
                return (
                  <line
                    x1="260"
                    y1="260"
                    x2={x}
                    y2={y}
                    stroke={active.color}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="opacity-70 animate-pulse"
                  />
                );
              })()}
            </svg>

            {/* Central Typography matching screenshot */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
              <span className="font-mono text-[11px] sm:text-xs font-black tracking-[0.25em] text-white">
                JOLSEL CORE
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-slate-400 mt-0.5">
                DECISION · COORDINATION
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-slate-400">
                UNSIGNED EXECUTION
              </span>
              <span className="font-mono text-[10px] sm:text-xs font-extrabold tracking-wider text-amber-400 mt-1 shadow-sm">
                CHICO · MANDATE
              </span>
            </div>

            {/* 17 Desks Arrayed Along Staggered Orbits */}
            {desks.map((desk, idx) => {
              const rad = (desk.angleDeg * Math.PI) / 180;
              const leftPct = 50 + desk.orbitRadius * Math.cos(rad);
              const topPct = 50 + desk.orbitRadius * Math.sin(rad);
              const isActive = idx === activeDeskIndex;

              return (
                <div
                  key={desk.id}
                  className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  onClick={() => {
                    setActiveDeskIndex(idx);
                    setSelectedDesk(desk);
                  }}
                >
                  {/* Circular Node Icon */}
                  {renderDeskIcon(desk, isActive)}

                  {/* Desk Name & Subtitle Labels */}
                  <div className="mt-1 flex flex-col items-center text-center whitespace-nowrap">
                    <span
                      className={`font-mono text-[9px] sm:text-[10px] font-bold tracking-tight transition ${
                        isActive ? "text-white scale-105" : "text-slate-300 group-hover:text-white"
                      }`}
                    >
                      {desk.name}
                    </span>
                    <span className="font-mono text-[8px] text-slate-500 tracking-tighter">
                      {desk.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}

          </div>

          {selectedDesk && (
            <div className="mt-1 z-30 flex items-center gap-3 rounded-xl border border-white/10 bg-[#070d1a]/95 px-4 py-2 backdrop-blur-md shadow-2xl">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: selectedDesk.color }}
              />
              <span className="font-mono text-xs font-bold text-white">
                {selectedDesk.name}: {selectedDesk.subtitle}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Dept: {selectedDesk.dept.toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDesk(null)}
                className="ml-2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

        </div>

        {/* ================= RIGHT HUD COLUMN (3 cols) ================= */}
        <div className="flex flex-col gap-3 lg:col-span-3 max-w-[340px] w-full mx-auto lg:mx-0 self-center">
          
          {/* Card 1: LIVE EVENT STREAM */}
          <div className="rounded-xl border border-cyan-500/20 bg-[#070d1a]/90 p-3.5 backdrop-blur-md shadow-xl shadow-cyan-950/20 flex flex-col h-[340px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 shrink-0">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                LIVE EVENT STREAM
              </span>
              <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono text-[11px] leading-snug scrollbar-thin scrollbar-thumb-slate-800">
              {streamMessages.map((msg) => (
                <div key={msg.id} className="space-y-0.5 border-b border-white/[0.03] pb-1.5">
                  <div className="flex items-center justify-between text-cyan-400 font-semibold">
                    <span>
                      {msg.from} → {msg.to}
                    </span>
                    <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[10px] leading-tight font-sans">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: LATEST CALLS */}
          <div className="rounded-xl border border-cyan-500/20 bg-[#070d1a]/90 p-3.5 backdrop-blur-md shadow-xl shadow-cyan-950/20">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                LATEST CALLS
              </span>
              <button
                type="button"
                onClick={onNavigateToTerminal}
                className="font-mono text-[10px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Ledger</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </button>
            </div>

            <div className="flex items-center justify-between font-mono py-1">
              <span className="font-bold text-emerald-400 text-xs tracking-wider">LONG</span>
              <span className="font-bold text-white text-xs">CHICO</span>
              <span className="font-bold text-emerald-400 text-xs">+9.1%</span>
            </div>

            <p className="mt-2 text-[10px] text-slate-400 font-sans leading-tight">
              Calls are reads of the public tape. Nothing is sent on-chain until you sign.
            </p>
          </div>

        </div>

      </div>

      {/* Bottom Tagline matching screenshot */}
      <div className="relative z-10 py-2.5 text-center border-t border-white/[0.04]">
        <p className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-slate-400 font-bold uppercase">
          DIFFERENT DESKS. ONE TAPE. YOU SIGN.
        </p>
      </div>

    </div>
  );
}
