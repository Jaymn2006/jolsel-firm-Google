import React from "react";

export function Stack() {
  const stack = [
    {
      layer: "Frontend & UI",
      items: ["Vite + React 19", "Tailwind CSS v4", "Lucide Icons", "JetBrains Mono"],
    },
    {
      layer: "Agent Runtime",
      items: ["TypeScript 5.6", "Shared CorporateContext", "5-Second Heartbeat Engine", "Gemini 3.8 Council"],
    },
    {
      layer: "Solana Execution",
      items: ["Jupiter Aggregator v6", "@solana/web3.js", "SPL Token & Token-2022", "Custom RPC Router"],
    },
    {
      layer: "On-Chain Programs",
      items: ["Anchor (Rust)", "Vault Risk Gates", "Transfer Fee Extensions", "Confidential Transfers"],
    },
    {
      layer: "Infrastructure",
      items: ["Node.js Express", "DexScreener API", "Birdeye Live TV Feeds", "Vercel / Cloud Run"],
    },
    {
      layer: "Cross-Chain / Future",
      items: ["Solana Token Extensions", "Solidity EVM Bridges", "Multi-Sig Firm Vaults", "Autonomous Hot Wallets"],
    },
  ];

  return (
    <section id="stack" className="px-4 py-20 sm:px-6 bg-slate-950/60">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#14F195]">
            Engineering Foundations
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Production Technology Stack
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Engineered for high-frequency Solana operations with clear paths for Anchor smart contracts
            and cross-chain vault expansion.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((s) => (
            <div
              key={s.layer}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg backdrop-blur-md"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#14F195]">
                {s.layer}
              </h3>
              <ul className="mt-3 space-y-2">
                {s.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9945FF]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
