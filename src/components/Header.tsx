import React, { useState } from "react";
import { Terminal, Shield, Cpu, ExternalLink, Wallet, CheckCircle, RefreshCw } from "lucide-react";
import type { WalletState } from "../lib/wallet";

interface HeaderProps {
  activeView: "terminal" | "treasury" | "overview";
  setActiveView: (view: "terminal" | "treasury" | "overview") => void;
  walletState: WalletState;
  onToggleWalletMode: () => void;
  firmLive: boolean;
  onToggleFirmLive: () => void;
  onResetFaucet: () => void;
}

export function Header({
  activeView,
  setActiveView,
  walletState,
  onToggleWalletMode,
  firmLive,
  onToggleFirmLive,
  onResetFaucet,
}: HeaderProps) {
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-2 px-3 py-2.5 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveView("overview")}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#14F195] to-[#9945FF] text-xs font-extrabold text-slate-950 shadow-md shadow-[#14F195]/20 hover:scale-105 transition"
            title="Jolsel Firm Home"
          >
            JF
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight text-white sm:text-base">
                Jolsel Firm
              </span>
              <span className="hidden rounded-full border border-[#14F195]/30 bg-[#14F195]/10 px-2 py-0.5 text-[10px] font-semibold text-[#14F195] lg:inline-block">
                17 Agents Active
              </span>
            </div>
            <div className="hidden text-[9px] uppercase tracking-wider text-slate-500 sm:block">
              Solana Autonomous Core · Alitiora
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveView("terminal")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              activeView === "terminal"
                ? "bg-[#14F195] text-slate-950 shadow-sm"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Terminal className="h-3 w-3" />
            <span>Terminal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("treasury")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              activeView === "treasury"
                ? "bg-[#14F195] text-slate-950 shadow-sm"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Shield className="h-3 w-3" />
            <span>Treasury</span>
          </button>

          <button
            type="button"
            aria-label="View Architecture"
            onClick={() => setActiveView("overview")}
            className={`hidden md:flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              activeView === "overview"
                ? "bg-white/15 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Cpu className="h-3 w-3" />
            <span>Architecture</span>
          </button>
        </nav>

        {/* Right Actions: Firm LIVE toggle & Wallet Card */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Firm LIVE Toggle */}
          <button
            type="button"
            onClick={onToggleFirmLive}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
              firmLive
                ? "border border-[#14F195]/40 bg-[#14F195]/15 text-[#14F195]"
                : "border border-white/15 bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
            title="Toggle autonomous 17-agent scoring loop"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${firmLive ? "bg-[#14F195] animate-ping" : "bg-slate-500"}`} />
            <span className="hidden sm:inline">{firmLive ? "Firm LIVE" : "Firm PAUSED"}</span>
            <span className="sm:hidden">{firmLive ? "LIVE" : "OFF"}</span>
          </button>

          {/* Wallet Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setWalletMenuOpen(!walletMenuOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:border-[#14F195]/40 transition"
            >
              <Wallet className="h-3.5 w-3.5 text-[#14F195]" />
              <span className="font-mono text-white text-[11px] font-bold">
                {walletState.solBalance.toFixed(1)} SOL
              </span>
            </button>

            {walletMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-white/10 bg-slate-900 p-3 shadow-2xl backdrop-blur-xl z-50">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                  <div className="text-xs font-semibold text-white">Wallet Connection</div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                    <CheckCircle className="h-3 w-3" /> Ready
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Address:</span>
                    <span className="font-mono text-[11px] text-slate-200">
                      {walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SOL Balance:</span>
                    <span className="font-mono font-bold text-[#14F195]">
                      {walletState.solBalance.toFixed(4)} SOL
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">USDC Balance:</span>
                    <span className="font-mono text-slate-200">
                      ${walletState.usdcBalance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Execution Mode:</span>
                    <span className="font-semibold text-violet-400">
                      {walletState.isPaperWallet ? "Paper Trading Vault" : "Real Mainnet"}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onResetFaucet();
                      setWalletMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/5 py-1.5 text-xs text-slate-300 hover:bg-white/10"
                  >
                    <RefreshCw className="h-3 w-3" /> Faucet Reset (+10 SOL)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onToggleWalletMode();
                      setWalletMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#14F195]/30 bg-[#14F195]/10 py-1.5 text-xs font-semibold text-[#14F195] hover:bg-[#14F195]/20"
                  >
                    {walletState.isPaperWallet ? "Connect Real Phantom / Solflare" : "Switch to Paper Vault"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <a
            href="https://github.com/Alitiora-Initiative/Jolsel-Firm-Agent"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            title="View GitHub Repository"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
