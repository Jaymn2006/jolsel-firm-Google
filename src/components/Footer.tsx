import React from "react";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#14F195] to-[#9945FF] text-xs font-bold text-slate-950">
              JF
            </div>
            <div>
              <div className="text-sm font-bold text-white">Jolsel Firm Agent</div>
              <div className="text-[10px] text-slate-500">
                Created by{" "}
                <a
                  href="https://github.com/Alitiora-Initiative"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-[#14F195] underline transition"
                >
                  Alitiora Initiative
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <a href="#departments" className="hover:text-white transition">
              Agents
            </a>
            <a href="#pipeline" className="hover:text-white transition">
              Pipeline
            </a>
            <a href="#architecture" className="hover:text-white transition">
              Corporate Context
            </a>
            <a href="#stack" className="hover:text-white transition">
              Tech Stack
            </a>
            <a
              href="https://github.com/Alitiora-Initiative/Jolsel-Firm-Agent"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#14F195] hover:underline"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-[11px] text-slate-500 leading-relaxed">
          <p>
            ⚠️ <span className="font-semibold text-slate-400">Disclaimer:</span> Not financial advice.
            Solana memecoins and on-chain assets carry high volatility. Jolsel Firm acts as an autonomous
            scoring and execution assistant under a self-custodial framework. You maintain custody and
            responsibility over every signed order.
          </p>
          <p className="mt-2 text-slate-600">
            © {new Date().getFullYear()} Jolsel Firm · Alitiora Initiative. Open source under MIT/Apache.
          </p>
        </div>
      </div>
    </footer>
  );
}
