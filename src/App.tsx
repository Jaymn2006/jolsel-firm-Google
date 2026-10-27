import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Terminal } from "./components/dashboard/Terminal";
import { Treasury } from "./components/treasury/Treasury";
import { Hero } from "./components/Hero";
import { Departments } from "./components/Departments";
import { Pipeline } from "./components/Pipeline";
import { Architecture } from "./components/Architecture";
import { Stack } from "./components/Stack";
import { Footer } from "./components/Footer";
import {
  type WalletState,
  loadWalletState,
  saveWalletState,
  detectBrowserWallet,
} from "./lib/wallet";

export default function App() {
  const [activeView, setActiveView] = useState<"terminal" | "treasury" | "overview">("terminal");
  const [walletState, setWalletState] = useState<WalletState>(loadWalletState);
  const [firmLive, setFirmLive] = useState(true);

  // Parse URL query parameter (supports ?autostart=1, ?tab=dashboard, ?tab=treasury)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view") || params.get("tab");
    if (viewParam === "treasury") {
      setActiveView("treasury");
    } else if (viewParam === "overview" || viewParam === "home") {
      setActiveView("overview");
    } else if (params.get("autostart") === "1" || viewParam === "dashboard" || viewParam === "terminal") {
      setActiveView("terminal");
    }
  }, []);

  // Sync state to local storage
  useEffect(() => {
    saveWalletState(walletState);
  }, [walletState]);

  // Toggle Wallet Mode (Paper Vault Demo vs Real Browser Wallet)
  const toggleWalletMode = async () => {
    if (walletState.isPaperWallet) {
      // Attempt to connect real browser wallet (Phantom/Solflare)
      const detected = await detectBrowserWallet();
      if (detected) {
        try {
          const resp = await detected.provider.connect();
          const pubkey = resp?.publicKey?.toString() || detected.provider.publicKey?.toString() || "SolanaMainnetUser";
          const newState: WalletState = {
            connected: true,
            address: pubkey,
            isPaperWallet: false,
            solBalance: 2.45,
            usdcBalance: 420.0,
          };
          setWalletState(newState);
          return;
        } catch (e) {
          console.warn("Wallet connection cancelled, keeping Paper Vault", e);
        }
      }
      alert("No Solana browser wallet (Phantom / Solflare) detected. Continuing in Paper Vault mode.");
    } else {
      // Switch back to Paper Vault
      const newState: WalletState = {
        connected: true,
        address: "JolsEL7vNkM8eX5p9yA3RtG4mW2qC1zD6bV8uF4m9P2k",
        isPaperWallet: true,
        solBalance: 12.5,
        usdcBalance: 2500.0,
      };
      setWalletState(newState);
    }
  };

  // Reset Faucet
  const handleResetFaucet = () => {
    const newState: WalletState = {
      ...walletState,
      solBalance: walletState.solBalance + 10.0,
      usdcBalance: walletState.usdcBalance + 1000.0,
    };
    setWalletState(newState);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-[#14F195] selection:text-slate-950">
      {/* Sticky Header with Navigation and Wallet Controls */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        walletState={walletState}
        onToggleWalletMode={toggleWalletMode}
        firmLive={firmLive}
        onToggleFirmLive={() => setFirmLive((prev) => !prev)}
        onResetFaucet={handleResetFaucet}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === "terminal" && (
          <Terminal
            walletState={walletState}
            setWalletState={setWalletState}
            firmLive={firmLive}
          />
        )}

        {activeView === "treasury" && (
          <Treasury
            walletState={walletState}
            onNavigateToTerminal={() => setActiveView("terminal")}
          />
        )}

        {activeView === "overview" && (
          <div className="relative">
            <Hero
              onOpenTerminal={() => setActiveView("terminal")}
              onOpenTreasury={() => setActiveView("treasury")}
            />
            <Departments />
            <Pipeline />
            <Architecture />
            <Stack />
            <Footer />
          </div>
        )}
      </main>

      {/* Global Compact Footer for Terminal/Treasury */}
      {activeView !== "overview" && (
        <footer className="border-t border-white/5 bg-slate-950/80 px-4 py-3 text-center text-xs text-slate-500">
          <div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-2">
            <span>
              Jolsel Firm Agent · Production-Grade Multi-Agent Solana Trading System ·{" "}
              <span className="text-slate-400">Self-Custodial Architecture</span>
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveView("overview")}
                className="text-[#14F195] hover:underline"
              >
                Architecture & Agents Guide
              </button>
              <a
                href="https://github.com/Alitiora-Initiative/Jolsel-Firm-Agent"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
