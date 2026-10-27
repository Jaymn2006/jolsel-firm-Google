import React from "react";
import { Terminal, Shield, Code2, AlertTriangle, CheckCircle } from "lucide-react";

export function Architecture() {
  return (
    <section id="architecture" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#14F195]">
            State Management
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Corporate Context Engine
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            A shared, immutable-record state that all 17 agents synchronously evaluate. The firm thinks
            and reacts as a single organism.
          </p>
        </div>

        {/* Code Snippet Box */}
        <div className="rounded-2xl border border-white/10 bg-slate-950 p-5 sm:p-8 font-mono text-xs sm:text-sm shadow-2xl overflow-x-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs text-slate-400">src/lib/agents/context.ts</span>
            </div>
            <span className="text-[10px] text-[#14F195] font-semibold">TypeScript Interface</span>
          </div>

          <pre className="text-slate-300 leading-relaxed">{`interface CorporateContext {
  timestamp: number;
  walletBalanceUSDT: number;
  activeAssetClass: 'MEME_COIN' | 'TOKENIZED_STOCK' | 'PERPETUAL';
  scoutedTokens: TokenCandidate[];
  selectedToken: TokenCandidate | null;
  customIndicatorsScore: number;    // Hard floor gate ≥ 75
  socialSentimentScore: number;
  isWorthIt: boolean;
  tradeDirection: 'LONG' | 'SHORT';
  reversalProtectionPlan: {
    trailingStopLossPercent: number;
    partialExitTrigger: string;
    takeProfitPercent: number;
  } | null;
  riskVetoTriggered: boolean;       // Compliance veto flag
  vetoReason: string;
  targetPositionSizeUSDT: number;   // Survival floor: max 25%
  slippageMax: number;              // Max slippage bps
  boardroomVotes: Record<string, string>; // Quorum verification
  executionApproved: boolean;       // Signed mandate
}`}</pre>
        </div>

        {/* 3 Pillar Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg backdrop-blur-md">
            <div className="font-bold text-[#14F195] text-sm flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              <span>Hard Gate Enforcement</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Analuszer indicator score must clear ≥75 before the Planning or Compliance departments
              are permitted to spend compute.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg backdrop-blur-md">
            <div className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>Unconditional Veto</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Any Compliance agent (Overthinker, Reviewer, MrGrumpy, RiskManager) can flag
              riskVetoTriggered and halt the trade immediately.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg backdrop-blur-md">
            <div className="font-bold text-violet-400 text-sm flex items-center gap-1.5">
              <Code2 className="h-4 w-4" />
              <span>Boardroom Quorum</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Executive agents cast verifiable votes; Verdicter signs the execution mandate only if
              at least 60% affirmative quorum is achieved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
