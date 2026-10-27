import React, { useState } from "react";
import { type DexPair } from "../../lib/dexscreener";
import { Sparkles, Check, AlertOctagon, ThumbsUp, ShieldAlert, BookOpen, Layers, Bot, Loader2 } from "lucide-react";

interface AgentPipelinePanelProps {
  selected: DexPair | null;
  firmLive: boolean;
  onDeliberationComplete?: (direction: "LONG" | "SHORT", score: number) => void;
}

export function AgentPipelinePanel({ selected, firmLive, onDeliberationComplete }: AgentPipelinePanelProps) {
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [activeDept, setActiveDept] = useState<"all" | "discovery" | "planning" | "compliance" | "executive" | "audit">("all");

  const runAiDeliberation = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/analyze-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenSymbol: selected.baseToken.symbol,
          tokenName: selected.baseToken.name,
          priceUsd: selected.priceUsd || "0",
          priceChange24h: selected.priceChange?.h24 ?? 5,
          volume24h: selected.volume?.h24 ?? 100000,
          liquidityUsd: selected.liquidity?.usd ?? 50000,
        }),
      });
      const data = await res.json();
      setAiReport(data);
      if (onDeliberationComplete && data.direction && data.score) {
        onDeliberationComplete(data.direction, data.score);
      }
    } catch (err) {
      console.error("AI Council call failed", err);
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    {
      id: "discovery",
      name: "Discovery",
      badge: "3 Agents",
      color: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
      agents: [
        { name: "Bscoter", role: "High-velocity token scout & liquidity radar" },
        { name: "Analuszer", role: "Precision momentum indicator (Score gate ≥ 75)" },
        { name: "CryptoGuru", role: "Social sentiment & viral velocity" },
      ],
    },
    {
      id: "planning",
      name: "Planning",
      badge: "3 Agents",
      color: "border-purple-500/30 text-purple-400 bg-purple-500/10",
      agents: [
        { name: "Forecaster", role: "Risk/reward scenario simulation" },
        { name: "LongTermPlanner", role: "Asset-class routing (Meme/Stock/Perp)" },
        { name: "ShortTermPlanner", role: "Position sizing & dynamic pyramiding" },
      ],
    },
    {
      id: "compliance",
      name: "Compliance",
      badge: "4 Agents · Veto Power",
      color: "border-amber-500/30 text-amber-400 bg-amber-500/10",
      agents: [
        { name: "Overthinker", role: "Tail-risk & black-swan simulation" },
        { name: "Reviewer", role: "Contract safety & mint audit" },
        { name: "MrGrumpy", role: "Zero-tolerance floor enforcer" },
        { name: "RiskManager", role: "Survival floor & single-trade exposure (<25%)" },
      ],
    },
    {
      id: "executive",
      name: "Executive",
      badge: "4 Agents · Quorum",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
      agents: [
        { name: "Broker", role: "Momentum advocacy in boardroom" },
        { name: "Judge", role: "Vote aggregation & quorum verification" },
        { name: "Verdicter", role: "Mandate signing & direction stamp" },
        { name: "Trader", role: "Atomic Solana execution via Jupiter" },
      ],
    },
    {
      id: "audit",
      name: "Audit",
      badge: "3 Agents · Continuous",
      color: "border-rose-500/30 text-rose-400 bg-rose-500/10",
      agents: [
        { name: "RecordKeeper", role: "Ledger heartbeat & cryptographic hash" },
        { name: "RecordReviewer", role: "Performance grading & metrics" },
        { name: "Teacher", role: "Daily audit rules & risk reinforcement" },
      ],
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-xl backdrop-blur-md">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-[#14F195]" />
          <div>
            <h3 className="text-sm font-bold text-white">17-Agent Corporate Council</h3>
            <p className="text-[10px] text-slate-400">
              Autonomous pipeline for {selected?.baseToken.symbol ?? "SOL"} · 5 Department Verification
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={loading || !selected}
          onClick={runAiDeliberation}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#14F195] to-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-[#14F195]/20 hover:opacity-90 disabled:opacity-40 transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Deliberating...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Run 17-Agent AI Deliberation</span>
            </>
          )}
        </button>
      </div>

      {/* AI Deliberation Report (if generated) */}
      {aiReport && (
        <div className="my-3 rounded-xl border border-[#14F195]/30 bg-gradient-to-br from-slate-950 to-slate-900 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                  aiReport.direction === "LONG"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}
              >
                {aiReport.direction} CALL · {aiReport.score}/100 SCORE
              </span>
              <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-mono text-slate-300">
                Confidence: {aiReport.confidencePct}%
              </span>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                aiReport.verdict === "APPROVED"
                  ? "bg-[#14F195]/20 text-[#14F195]"
                  : "bg-rose-500/20 text-rose-300"
              }`}
            >
              MANDATE {aiReport.verdict}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-300 leading-relaxed">{aiReport.executiveSummary}</p>

          {aiReport.reversalProtection && (
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg border border-white/5 bg-slate-950/60 p-2 text-[11px] text-slate-400">
              <div>
                <span>Trailing Stop: </span>
                <span className="font-mono font-bold text-rose-400">
                  -{aiReport.reversalProtection.stopLossPct}%
                </span>
              </div>
              <div>
                <span>Take-Profit Target: </span>
                <span className="font-mono font-bold text-emerald-400">
                  +{aiReport.reversalProtection.takeProfitPct}%
                </span>
              </div>
              <div>
                <span>Exit Protocol: </span>
                <span className="text-slate-300 truncate block">
                  {aiReport.reversalProtection.exitTrigger}
                </span>
              </div>
            </div>
          )}

          {/* Department highlights */}
          {aiReport.departmentReports && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2 text-[11px]">
              <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-2">
                <div className="font-bold text-cyan-400">Discovery Analysis</div>
                <div className="mt-1 text-slate-300">{aiReport.departmentReports.discovery?.analuszer}</div>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2">
                <div className="font-bold text-emerald-400">Executive Verdict</div>
                <div className="mt-1 text-slate-300">
                  {aiReport.departmentReports.executive?.judgeVotes} · {aiReport.departmentReports.executive?.verdicter}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Department Filter Tabs */}
      <div className="my-3 flex flex-wrap gap-1.5 text-xs">
        <button
          type="button"
          onClick={() => setActiveDept("all")}
          className={`rounded-lg px-2.5 py-1 font-medium transition ${
            activeDept === "all" ? "bg-white/20 text-white" : "text-slate-400 hover:bg-white/5"
          }`}
        >
          All Departments
        </button>
        {departments.map((dept) => (
          <button
            key={dept.id}
            type="button"
            onClick={() => setActiveDept(dept.id as any)}
            className={`rounded-lg px-2.5 py-1 font-medium capitalize transition ${
              activeDept === dept.id ? "bg-white/20 text-white" : "text-slate-400 hover:bg-white/5"
            }`}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Department Cards Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {departments
          .filter((dept) => activeDept === "all" || activeDept === dept.id)
          .map((dept) => (
            <div
              key={dept.id}
              className="rounded-xl border border-white/10 bg-slate-950/60 p-3 hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${dept.color}`}>
                  {dept.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{dept.badge}</span>
              </div>

              <div className="space-y-2">
                {dept.agents.map((agent) => (
                  <div key={agent.name} className="border-t border-white/5 pt-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-slate-200">{agent.name}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#14F195]" />
                    </div>
                    <p className="text-[10px] text-slate-400">{agent.role}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
