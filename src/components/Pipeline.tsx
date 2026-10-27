import React from "react";
import { ArrowDown, CheckCircle2 } from "lucide-react";

export function Pipeline() {
  const steps = [
    {
      n: "01",
      title: "Discovery Phase",
      desc: "Bscoter scouts live Solana pools, CryptoGuru audits social sentiment, and Analuszer scores indicators. Requires ≥75 score hard gate to proceed.",
      agents: "Bscoter · Analuszer · CryptoGuru",
    },
    {
      n: "02",
      title: "Planning Phase",
      desc: "Forecaster constructs scenario matrices, LongTermPlanner routes asset class based on vault equity, and ShortTermPlanner calculates dynamic pyramiding.",
      agents: "Forecaster · LongTermPlanner · ShortTermPlanner",
    },
    {
      n: "03",
      title: "Compliance Phase",
      desc: "Overthinker models tail risks, Reviewer audits freeze and mint authority on SPL/Token-2022, MrGrumpy enforces zero-tolerance floor, and RiskManager sets single-trade risk limits.",
      agents: "Overthinker · Reviewer · MrGrumpy · RiskManager",
    },
    {
      n: "04",
      title: "Executive Phase",
      desc: "Broker advocates momentum, Judge gathers boardroom quorum votes, Verdicter signs the LONG/SHORT mandate, and Trader executes atomically via Jupiter.",
      agents: "Broker · Judge · Verdicter · Trader",
    },
    {
      n: "05",
      title: "Audit Phase",
      desc: "RecordKeeper signs the immutable ledger heartbeat, RecordReviewer grades performance, and Teacher reinforces capital preservation lessons.",
      agents: "RecordKeeper · RecordReviewer · Teacher",
    },
  ];

  return (
    <section id="pipeline" className="px-4 py-20 sm:px-6 bg-slate-950/60">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#14F195]">
            Execution Architecture
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Continuous 5-Department Pipeline
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            A 5-second asynchronous heartbeat loop with compliance veto gates and adaptive back-off.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.n}
              className="flex items-start gap-4 sm:gap-6 rounded-2xl border border-white/10 bg-slate-900/50 p-5 sm:p-6 shadow-lg backdrop-blur-md"
            >
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[#14F195] bg-slate-950 font-mono text-base sm:text-lg font-bold text-[#14F195] shadow-md shadow-[#14F195]/20">
                {step.n}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">{step.title}</h3>
                  <span className="font-mono text-xs text-[#14F195] font-semibold">{step.agents}</span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
