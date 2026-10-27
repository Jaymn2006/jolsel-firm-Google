/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header, type NavView } from "./components/Header";
import { CoreWarRoom } from "./components/core/CoreWarRoom";
import { Terminal } from "./components/dashboard/Terminal";
import { VaultPool } from "./components/vault/VaultPool";
import { CopyTradeRadar } from "./components/copytrade/CopyTradeRadar";
import { Treasury } from "./components/treasury/Treasury";
import { Leaderboard } from "./components/game/Leaderboard";
import { Profile } from "./components/game/Profile";
import { CoinPage } from "./components/game/CoinPage";
import { PerpsTerminal } from "./components/game/PerpsTerminal";
import { MysteryCrates } from "./components/game/MysteryCrates";
import { LiveGlobe } from "./components/globe/LiveGlobe";
import { JolsyBotCompanion } from "./components/game/JolsyBotCompanion";
import { AirdropModal } from "./components/game/AirdropModal";
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
import {
  type PlayerProfile,
  loadPlayerProfile,
  savePlayerProfile,
  claimStarterAirdrop,
  registerOrUpdateRealTrader,
} from "./lib/gameEconomy";
import {
  detectRealUserLocation,
  getCachedUserLocation,
  type UserGeoLocation,
} from "./lib/location";
import { type WhaleProfile } from "./lib/copytrade";

export default function App() {
  const [activeView, setActiveView] = useState<NavView>("core");
  const [walletState, setWalletState] = useState<WalletState>(loadWalletState);
  const [player, setPlayer] = useState<PlayerProfile>(loadPlayerProfile);
  const [userLocation, setUserLocation] = useState<UserGeoLocation | null>(getCachedUserLocation);
  const [isAirdropModalOpen, setIsAirdropModalOpen] = useState(false);
  const [firmLive, setFirmLive] = useState(true);
  const [network, setNetwork] = useState<"devnet" | "mainnet-beta">("devnet");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4500);
  };

  // Real-life Location Detection & Registration on Mount
  useEffect(() => {
    let isMounted = true;
    async function initLocation() {
      try {
        const detected = await detectRealUserLocation();
        if (isMounted) {
          setUserLocation(detected);
          // Register player to real active traders registry
          registerOrUpdateRealTrader(player, walletState.address, detected);
          // Update player region label
          setPlayer((prev) => ({
            ...prev,
            region: `${detected.city}, ${detected.country}`,
            latitude: detected.latitude,
            longitude: detected.longitude,
          }));
        }
      } catch (err) {
        console.warn("Location detection issue:", err);
      }
    }
    initLocation();
    return () => {
      isMounted = false;
    };
  }, [walletState.address]);

  // Read URL query parameters for view routing
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view") || params.get("tab") || params.get("page");
    if (viewParam === "vault") setActiveView("vault");
    else if (viewParam === "terminal" || viewParam === "trade") setActiveView("terminal");
    else if (viewParam === "perps" || viewParam === "futures") setActiveView("perps");
    else if (viewParam === "globe" || viewParam === "earth") setActiveView("globe");
    else if (viewParam === "crates" || viewParam === "rewards") setActiveView("crates");
    else if (viewParam === "coin" || viewParam === "token") setActiveView("coin");
    else if (viewParam === "leaderboard" || viewParam === "ranks") setActiveView("leaderboard");
    else if (viewParam === "profile") setActiveView("profile");
    else if (viewParam === "copytrade" || viewParam === "whales") setActiveView("copytrade");
    else if (viewParam === "treasury") setActiveView("treasury");
    else if (viewParam === "overview" || viewParam === "home") setActiveView("overview");
    else if (viewParam === "core" || params.get("autostart") === "1") setActiveView("core");
  }, []);

  // Sync state to local storage
  useEffect(() => {
    saveWalletState(walletState);
  }, [walletState]);

  useEffect(() => {
    savePlayerProfile(player);
    if (userLocation) {
      registerOrUpdateRealTrader(player, walletState.address, userLocation);
    }
  }, [player, userLocation, walletState.address]);

  // Toggle Wallet Mode (Paper Vault Demo vs Real Browser Wallet)
  const toggleWalletMode = async () => {
    if (walletState.isPaperWallet) {
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
          showToast("Connected to browser Solana wallet: " + pubkey.slice(0, 4) + "..." + pubkey.slice(-4));
          if (userLocation) {
            registerOrUpdateRealTrader(player, pubkey, userLocation);
          }
          return;
        } catch (e) {
          console.warn("Wallet connection rejected, continuing in Vault mode", e);
        }
      }
      showToast("No Solana browser wallet extension found. Operating safely in Jolsel Firm Vault mode.");
    } else {
      const newState: WalletState = {
        connected: true,
        address: "JolsEL7vNkM8eX5p9yA3RtG4mW2qC1zD6bV8uF4m9P2k",
        isPaperWallet: true,
        solBalance: 12.5,
        usdcBalance: 2500.0,
      };
      setWalletState(newState);
      showToast("Switched to Jolsel Vault Demo Wallet.");
      if (userLocation) {
        registerOrUpdateRealTrader(player, newState.address, userLocation);
      }
    }
  };

  // Reset Faucet
  const handleResetFaucet = () => {
    const newProfile = {
      ...player,
      devnetSolBalance: player.devnetSolBalance + 1.0,
      jolselBalance: player.jolselBalance + 2500,
    };
    setPlayer(newProfile);
    savePlayerProfile(newProfile);
    showToast("Devnet Faucet: +1.0 SOL & +2,500 $JOLSEL credited to your wallet!");
  };

  // Trigger mirror trade when a whale is copied
  const handleMirrorTrade = (whale: WhaleProfile) => {
    showToast(`Mirrored trade: ${whale.label} executed ${whale.lastTrade.side} on ${whale.lastTrade.symbol}`);
  };

  // Handle Starter Airdrop Claim
  const handleClaimAirdrop = () => {
    const updated = claimStarterAirdrop(player);
    setPlayer(updated);
  };

  const handleRefreshLocation = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("jolsel_real_user_location_v2");
      }
      const loc = await detectRealUserLocation();
      setUserLocation(loc);
      registerOrUpdateRealTrader(player, walletState.address, loc);
      showToast(`Detected location: ${loc.city}, ${loc.country} (${loc.source})`);
    } catch {
      showToast("Location refreshed with existing coordinates.");
    }
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col selection:bg-[#14F195] selection:text-slate-950 font-sans">
      {/* Sticky Top Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        walletState={walletState}
        onToggleWalletMode={toggleWalletMode}
        firmLive={firmLive}
        onToggleFirmLive={() => setFirmLive((prev) => !prev)}
        onResetFaucet={handleResetFaucet}
        network={network}
        setNetwork={setNetwork}
        player={player}
        onOpenAirdropModal={() => setIsAirdropModalOpen(true)}
      />

      {/* Main Multi-Page View Container */}
      <main className="flex-1">
        {activeView === "core" && (
          <CoreWarRoom
            walletState={walletState}
            setWalletState={setWalletState}
            firmLive={firmLive}
            onToggleFirmLive={() => setFirmLive((prev) => !prev)}
            network={network}
            setNetwork={setNetwork}
            onNavigateToTerminal={() => setActiveView("terminal")}
          />
        )}

        {activeView === "terminal" && (
          <Terminal
            walletState={walletState}
            setWalletState={setWalletState}
            firmLive={firmLive}
          />
        )}

        {activeView === "perps" && (
          <PerpsTerminal
            player={player}
            setPlayer={setPlayer}
          />
        )}

        {activeView === "globe" && (
          <LiveGlobe
            player={player}
            userLocation={userLocation}
            walletAddress={walletState.address}
          />
        )}

        {activeView === "crates" && (
          <MysteryCrates
            player={player}
            setPlayer={setPlayer}
          />
        )}

        {activeView === "coin" && (
          <CoinPage
            player={player}
            setPlayer={setPlayer}
            onNavigateToPerps={() => setActiveView("perps")}
            onNavigateToCore={() => setActiveView("core")}
          />
        )}

        {activeView === "leaderboard" && (
          <Leaderboard
            player={player}
            walletAddress={walletState.address}
          />
        )}

        {activeView === "profile" && (
          <Profile
            player={player}
            setPlayer={setPlayer}
            walletState={walletState}
            userLocation={userLocation}
            onRefreshLocation={handleRefreshLocation}
            onOpenAirdropModal={() => setIsAirdropModalOpen(true)}
          />
        )}

        {activeView === "vault" && (
          <VaultPool
            onNavigateToCore={() => setActiveView("core")}
          />
        )}

        {activeView === "copytrade" && (
          <CopyTradeRadar
            onMirrorTrade={handleMirrorTrade}
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

      {/* Animated Jolsy AI Companion Bot */}
      <JolsyBotCompanion
        player={player}
        setPlayer={setPlayer}
      />

      {/* Genesis Airdrop Modal */}
      <AirdropModal
        isOpen={isAirdropModalOpen}
        onClose={() => setIsAirdropModalOpen(false)}
        player={player}
        onClaim={handleClaimAirdrop}
      />

      {/* Compact Global Footer */}
      {activeView !== "overview" && activeView !== "core" && activeView !== "globe" && (
        <footer className="border-t border-white/5 bg-[#03060e] px-4 py-3 text-center text-xs text-slate-500">
          <div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-2">
            <span>
              Jolsel Firm Agent · Autonomous Multi-Agent Solana Spot & Futures Game ·{" "}
              <span className="font-mono text-cyan-400 uppercase font-semibold">{network}</span>
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveView("overview")}
                className="text-[#14F195] hover:underline"
              >
                Architecture & Desks Guide
              </button>
              <a
                href="https://github.com/Alitiora-Initiative/Jolsel-Firm-Agent"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                GitHub Blueprint
              </a>
            </div>
          </div>
        </footer>
      )}

      {/* In-app Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-lg border border-cyan-500/30 bg-[#0a1120]/95 px-4 py-3 text-sm text-slate-200 shadow-2xl backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-[#14F195] animate-pulse" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
