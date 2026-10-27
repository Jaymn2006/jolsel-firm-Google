import React from "react";
import { Compass, LineChart, ShieldCheck, Award, FileSpreadsheet } from "lucide-react";

export function Departments() {
  const departments = [
    {
      id: "discovery",
      name: "Discovery Department",
      icon: Compass,
      color: "from-cyan-500 to-blue-500",
      border: "border-cyan-500/30",
      desc: "Scouts high-velocity candidate mints, audits orderbook momentum, and calculates crowd viral velocity.",
      agents: [
        { name: "Bscoter", role: "High-velocity token scout & liquidity radar" },
        { name: "Analuszer", role: "Precision momentum indicator (≥75 hard floor)" },
        { name: "CryptoGuru", role: "Crowd velocity & social engagement clusters" },
      ],
    },
    {
      id: "planning",
      name: "Planning Department",
      icon: LineChart,
      color: "from-violet-500 to-purple-500",
      border: "border-purple-500/30",
      desc: "Simulates multiple market scenarios, routes capital across asset classes, and sets dynamic stop-loss triggers.",
      agents: [
        { name: "Forecaster", role: "Scenario matrix simulation & risk/reward ratio" },
        { name: "LongTermPlanner", role: "Asset-class routing (Meme / Stock / Perp)" },
        { name: "ShortTermPlanner", role: "Pyramiding rules & micro-high triggers" },
      ],
    },
    {
      id: "compliance",
      name: "Compliance Department",
      icon: ShieldCheck,
      color: "from-amber-500 to-orange-500",
      border: "border-amber-500/30",
      desc: "Possesses absolute veto authority. Evaluates tail risks, audit contracts, and enforces survival floors.",
      agents: [
        { name: "Overthinker", role: "Tail-risk & black-swan simulation" },
        { name: "Reviewer", role: "Contract safety & mint freeze authority audit" },
        { name: "MrGrumpy", role: "Zero-tolerance policy & indicator floor enforcer" },
        { name: "RiskManager", role: "Survival floor: Maximum 25% single trade size" },
      ],
    },
    {
      id: "executive",
      name: "Executive Department",
      icon: Award,
      color: "from-emerald-500 to-green-500",
      border: "border-emerald-500/30",
      desc: "Deliberates in the boardroom, aggregates agent votes for quorum, signs trade mandates, and dispatches orders.",
      agents: [
        { name: "Broker", role: "Momentum advocacy & entry timing" },
        { name: "Judge", role: "Vote aggregation & quorum verification (≥60%)" },
        { name: "Verdicter", role: "Mandate signing (LONG / SHORT sanction)" },
        { name: "Trader", role: "Atomic Solana execution (Jupiter Aggregator)" },
      ],
    },
    {
      id: "audit",
      name: "Audit Department",
      icon: FileSpreadsheet,
      color: "from-rose-500 to-pink-500",
      border: "border-rose-500/30",
      desc: "Cryptographically logs every trade heartbeat, grades firm performance, and enforces daily learning reinforcement.",
      agents: [
        { name: "RecordKeeper", role: "Heartbeat ledger & cryptographic signature" },
        { name: "RecordReviewer", role: "Performance grading & win-rate metrics" },
        { name: "Teacher", role: "Daily audit rules & risk reinforcement" },
      ],
    },
  ];

  return (
    <section id="departments" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#14F195]">
            Corporate Structure
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Five Departments · 17 Specialized Agents
          </h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Each agent has a singular, clear mandate. Together they form an autonomous Solana
            trading institution that never sleeps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.id}
                className="group rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md transition hover:border-white/20 hover:bg-slate-900/80"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${dept.color} text-slate-950`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-white text-base">{dept.name}</h3>
                </div>

                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{dept.desc}</p>

                <div className="space-y-2.5 border-t border-white/5 pt-3">
                  {dept.agents.map((agent) => (
                    <div key={agent.name} className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-slate-200">
                        {agent.name}
                      </span>
                      <span className="text-[11px] text-slate-400">{agent.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
