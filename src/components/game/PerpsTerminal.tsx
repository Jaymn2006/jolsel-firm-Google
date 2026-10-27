/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  Activity,
  AlertTriangle,
  ArrowRight,
  Sliders,
  DollarSign,
  CheckCircle,
  X,
  Sparkles,
} from "lucide-react";
import {
  PERP_MARKETS,
  type PerpMarket,
  type PerpPosition,
  calculateLiquidationPrice,
  computePositionPnl,
} from "../../lib/perpetuals";
import {
  type PlayerProfile,
  savePlayerProfile,
} from "../../lib/gameEconomy";

interface PerpsTerminalProps {
  player: PlayerProfile;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerProfile>>;
}

export function PerpsTerminal({ player, setPlayer }: PerpsTerminalProps) {
  const [selectedMarket, setSelectedMarket] = useState<PerpMarket>(PERP_MARKETS[0]);
  const [direction, setDirection] = useState<"LONG" | "SHORT">("LONG");
  const [leverage, setLeverage] = useState<number>(10);
  const [collateralType, setCollateralType] = useState<"SOL" | "JOLSEL">("SOL");
  const [collateralAmount, setCollateralAmount] = useState<string>("0.2");
  const [takeProfitPct, setTakeProfitPct] = useState<string>("25");
  const [stopLossPct, setStopLossPct] = useState<string>("10");

  const [positions, setPositions] = useState<PerpPosition[]>([
    {
      id: "pos-1",
      marketSymbol: "SOL-PERP",
      direction: "LONG",
      leverage: 10,
      entryPrice: 182.1,
      currentPrice: 184.62,
      sizeTokens: 5.49,
      collateralUsd: 100.0,
      collateralType: "SOL",
      liquidationPrice: 165.7,
      unrealizedPnlUsd: 13.84,
      unrealizedPnlPct: 13.84,
      timestamp: "10m ago",
    },
    {
      id: "pos-2",
      marketSymbol: "CHICO-PERP",
      direction: "LONG",
      leverage: 15,
      entryPrice: 0.00591,
      currentPrice: 0.00646,
      sizeTokens: 126903.5,
      collateralUsd: 50.0,
      collateralType: "JOLSEL",
      liquidationPrice: 0.00555,
      unrealizedPnlUsd: 6.98,
      unrealizedPnlPct: 13.96,
      timestamp: "22m ago",
    },
  ]);

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Compute collateral in USD
  const collateralUsd = useMemo(() => {
    const amt = parseFloat(collateralAmount) || 0;
    if (collateralType === "SOL") {
      return amt * 184.62;
    } else {
      return amt * 0.0425;
    }
  }, [collateralAmount, collateralType]);

  // Position size in USD
  const positionSizeUsd = collateralUsd * leverage;

  // Liquidation Price calculation
  const liquidationPrice = useMemo(() => {
    return calculateLiquidationPrice(selectedMarket.markPrice, leverage, direction);
  }, [selectedMarket.markPrice, leverage, direction]);

  // Open a new perpetual trade
  const handleOpenPosition = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(collateralAmount);
    if (isNaN(amt) || amt <= 0) {
      setFeedbackMsg("Please enter a valid collateral amount.");
      return;
    }

    if (collateralType === "SOL" && amt > player.devnetSolBalance) {
      setFeedbackMsg("Insufficient Devnet SOL balance.");
      return;
    }
    if (collateralType === "JOLSEL" && amt > player.jolselBalance) {
      setFeedbackMsg("Insufficient $JOLSEL token balance.");
      return;
    }

    // Deduct collateral from player profile
    const updatedProfile: PlayerProfile = {
      ...player,
      devnetSolBalance:
        collateralType === "SOL"
          ? Math.max(0, player.devnetSolBalance - amt)
          : player.devnetSolBalance,
      jolselBalance:
        collateralType === "JOLSEL"
          ? Math.max(0, player.jolselBalance - amt)
          : player.jolselBalance,
      totalTrades: player.totalTrades + 1,
      xp: player.xp + 150,
    };
    setPlayer(updatedProfile);
    savePlayerProfile(updatedProfile);

    // Create position
    const newPos: PerpPosition = {
      id: `pos-${Date.now()}`,
      marketSymbol: selectedMarket.symbol,
      direction,
      leverage,
      entryPrice: selectedMarket.markPrice,
      currentPrice: selectedMarket.markPrice,
      sizeTokens: Number((positionSizeUsd / selectedMarket.markPrice).toFixed(2)),
      collateralUsd: Number(collateralUsd.toFixed(2)),
      collateralType,
      liquidationPrice: Number(liquidationPrice.toFixed(selectedMarket.markPrice < 0.1 ? 6 : 2)),
      unrealizedPnlUsd: 0,
      unrealizedPnlPct: 0,
      timestamp: "Just now",
    };

    setPositions([newPos, ...positions]);
    setFeedbackMsg(`⚡ Opened ${leverage}x ${direction} on ${selectedMarket.symbol}!`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Close position and settle PnL
  const handleClosePosition = (posId: string) => {
    const pos = positions.find((p) => p.id === posId);
    if (!pos) return;

    const { pnlUsd } = computePositionPnl(pos, pos.currentPrice);
    const returnCollateral = Math.max(0, pos.collateralUsd + pnlUsd);

    const isWin = pnlUsd >= 0;
    const updatedProfile: PlayerProfile = {
      ...player,
      devnetSolBalance:
        pos.collateralType === "SOL"
          ? player.devnetSolBalance + returnCollateral / 184.62
          : player.devnetSolBalance,
      jolselBalance:
        pos.collateralType === "JOLSEL"
          ? player.jolselBalance + returnCollateral / 0.0425
          : player.jolselBalance,
      totalPnlUsd: player.totalPnlUsd + pnlUsd,
      winCount: isWin ? player.winCount + 1 : player.winCount,
      lossCount: isWin ? player.lossCount : player.lossCount + 1,
      winStreak: isWin ? player.winStreak + 1 : 0,
      bestStreak: Math.max(player.bestStreak, isWin ? player.winStreak + 1 : player.bestStreak),
      xp: player.xp + (isWin ? 200 : 50),
    };

    setPlayer(updatedProfile);
    savePlayerProfile(updatedProfile);
    setPositions(positions.filter((p) => p.id !== posId));
    setFeedbackMsg(
      `Position closed. Net PnL: ${pnlUsd >= 0 ? "+" : ""}$${pnlUsd.toFixed(2)} USD settled.`
    );
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl flex items-center gap-2">
              <Zap className="h-7 w-7 text-[#14F195]" />
              <span>Devnet Perpetuals & Futures</span>
            </h1>
            <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 font-mono text-xs font-bold text-cyan-300">
              Up to 50x Leverage
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Trade on-chain simulated futures with Devnet SOL or in-game $JOLSEL tokens. No real capital at risk.
          </p>
        </div>

        {/* User In-Game Collateral Balances */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2 backdrop-blur-md">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400">JOLSEL Token</span>
            <p className="font-mono text-xs font-bold text-amber-300">
              {player.jolselBalance.toLocaleString()} $JOLSEL
            </p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-left">
            <span className="text-[10px] uppercase font-mono text-slate-400">Devnet SOL</span>
            <p className="font-mono text-xs font-bold text-[#14F195]">
              {player.devnetSolBalance.toFixed(3)} SOL
            </p>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="rounded-xl bg-cyan-500/20 border border-cyan-500/40 p-3 text-xs font-bold text-cyan-200 text-center animate-pulse">
          {feedbackMsg}
        </div>
      )}

      {/* Market Tickers Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {PERP_MARKETS.map((market) => (
          <button
            key={market.symbol}
            type="button"
            onClick={() => setSelectedMarket(market)}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 border transition ${
              selectedMarket.symbol === market.symbol
                ? "border-[#14F195] bg-[#14F195]/10 text-white shadow-md shadow-[#14F195]/15"
                : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20"
            }`}
          >
            <div>
              <p className="font-mono text-xs font-bold text-white">{market.symbol}</p>
              <p className="font-mono text-[11px] text-slate-400">
                ${market.markPrice < 0.1 ? market.markPrice.toFixed(6) : market.markPrice.toFixed(2)}
              </p>
            </div>
            <span
              className={`font-mono text-[10px] font-bold ${
                market.change24h >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {market.change24h >= 0 ? `+${market.change24h}%` : `${market.change24h}%`}
            </span>
          </button>
        ))}
      </div>

      {/* Main Trade Grid: Chart & Market Info (7 cols) + Order Ticket (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Market Overview & Live Positions (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Market Overview Card */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-extrabold text-white">
                  {selectedMarket.name}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  ({selectedMarket.symbol})
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-xl font-black text-white">
                  ${selectedMarket.markPrice < 0.1 ? selectedMarket.markPrice.toFixed(6) : selectedMarket.markPrice.toFixed(2)}
                </span>
                <span className="ml-2 text-xs font-bold text-emerald-400">
                  +{selectedMarket.change24h}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="rounded-xl bg-slate-950/70 p-3 border border-white/5">
                <span className="text-[10px] uppercase text-slate-500">8h Funding Rate</span>
                <p className="mt-1 font-bold text-amber-400">+{selectedMarket.fundingRate8h}%</p>
              </div>
              <div className="rounded-xl bg-slate-950/70 p-3 border border-white/5">
                <span className="text-[10px] uppercase text-slate-500">Open Interest</span>
                <p className="mt-1 font-bold text-white">
                  ${(selectedMarket.openInterestUsd / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="rounded-xl bg-slate-950/70 p-3 border border-white/5">
                <span className="text-[10px] uppercase text-slate-500">Max Leverage</span>
                <p className="mt-1 font-bold text-cyan-400">{selectedMarket.maxLeverage}x</p>
              </div>
            </div>

            {/* Smart Kelly Recommendation Note */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-3 text-xs">
              <div className="flex items-center gap-2 text-cyan-300">
                <Sparkles className="h-4 w-4" />
                <span>
                  <strong>Kelly Council Recommendation:</strong> Suggested leverage <strong>10x - 15x</strong> for optimal capital growth rate.
                </span>
              </div>
            </div>
          </div>

          {/* Active Positions Table */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">
                Your Open Positions ({positions.length})
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Live Mark Settlement</span>
            </div>

            {positions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 font-mono">
                No active positions. Execute a LONG or SHORT trade to begin!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-[10px] uppercase text-slate-500 border-b border-white/5">
                    <tr>
                      <th className="pb-2">Market</th>
                      <th className="pb-2">Direction</th>
                      <th className="pb-2">Entry</th>
                      <th className="pb-2">Liq. Price</th>
                      <th className="pb-2 text-right">PnL (USD)</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {positions.map((pos) => {
                      const posMarket = PERP_MARKETS.find((m) => m.symbol === pos.marketSymbol) || selectedMarket;
                      const { pnlUsd, pnlPct } = computePositionPnl(pos, posMarket.markPrice);
                      const isProfit = pnlUsd >= 0;
                      return (
                        <tr key={pos.id} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 font-bold text-white">
                            {pos.marketSymbol}{" "}
                            <span className="text-cyan-400 text-[10px]">({pos.leverage}x)</span>
                          </td>
                          <td className="py-2.5">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                pos.direction === "LONG"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              }`}
                            >
                              {pos.direction}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-300">
                            ${pos.entryPrice < 0.1 ? pos.entryPrice.toFixed(6) : pos.entryPrice.toFixed(2)}
                          </td>
                          <td className="py-2.5 text-amber-400">
                            ${pos.liquidationPrice < 0.1 ? pos.liquidationPrice.toFixed(6) : pos.liquidationPrice.toFixed(2)}
                          </td>
                          <td
                            className={`py-2.5 text-right font-bold ${
                              isProfit ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {isProfit ? "+" : ""}${pnlUsd.toFixed(2)} ({isProfit ? "+" : ""}{pnlPct.toFixed(1)}%)
                          </td>
                          <td className="py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleClosePosition(pos.id)}
                              className="rounded-lg bg-rose-500/20 border border-rose-500/30 px-2.5 py-1 text-[10px] font-bold text-rose-300 hover:bg-rose-500/30 transition"
                            >
                              Close
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Placement Ticket (5 cols) */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-xl shadow-2xl lg:col-span-5">
          <form onSubmit={handleOpenPosition} className="space-y-4">
            {/* Direction Selector: LONG / SHORT */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection("LONG")}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-extrabold font-mono transition border ${
                  direction === "LONG"
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-md shadow-emerald-500/20"
                    : "border-white/10 bg-slate-950 text-slate-400 hover:border-white/20"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>LONG (BUY)</span>
              </button>

              <button
                type="button"
                onClick={() => setDirection("SHORT")}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-extrabold font-mono transition border ${
                  direction === "SHORT"
                    ? "border-rose-500 bg-rose-500/20 text-rose-400 shadow-md shadow-rose-500/20"
                    : "border-white/10 bg-slate-950 text-slate-400 hover:border-white/20"
                }`}
              >
                <TrendingDown className="h-4 w-4" />
                <span>SHORT (SELL)</span>
              </button>
            </div>

            {/* Leverage Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400 uppercase">Leverage Multiplier</span>
                <span className="font-bold text-cyan-400">{leverage}x</span>
              </div>
              <input
                type="range"
                min="1"
                max={selectedMarket.maxLeverage}
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="w-full accent-[#14F195]"
              />
              <div className="mt-1.5 flex justify-between gap-1">
                {[2, 5, 10, 20, selectedMarket.maxLeverage].map((lev) => (
                  <button
                    key={lev}
                    type="button"
                    onClick={() => setLeverage(lev)}
                    className={`flex-1 rounded-lg py-1 font-mono text-[10px] font-bold border transition ${
                      leverage === lev
                        ? "border-[#14F195] bg-[#14F195]/20 text-[#14F195]"
                        : "border-white/5 bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    {lev}x
                  </button>
                ))}
              </div>
            </div>

            {/* Collateral Asset Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Margin Collateral Asset
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCollateralType("SOL");
                    setCollateralAmount("0.2");
                  }}
                  className={`rounded-xl p-2.5 text-left border transition ${
                    collateralType === "SOL"
                      ? "border-[#14F195] bg-[#14F195]/10 text-white"
                      : "border-white/10 bg-slate-950 text-slate-400"
                  }`}
                >
                  <p className="font-mono text-xs font-bold text-[#14F195]">Devnet SOL</p>
                  <p className="font-mono text-[10px] text-slate-400">
                    Avail: {player.devnetSolBalance.toFixed(2)} SOL
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCollateralType("JOLSEL");
                    setCollateralAmount("1000");
                  }}
                  className={`rounded-xl p-2.5 text-left border transition ${
                    collateralType === "JOLSEL"
                      ? "border-amber-400 bg-amber-400/10 text-white"
                      : "border-white/10 bg-slate-950 text-slate-400"
                  }`}
                >
                  <p className="font-mono text-xs font-bold text-amber-300">$JOLSEL Token</p>
                  <p className="font-mono text-[10px] text-slate-400">
                    Avail: {player.jolselBalance.toLocaleString()}
                  </p>
                </button>
              </div>
            </div>

            {/* Collateral Amount Input */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Collateral Amount ({collateralType})
              </label>
              <input
                type="number"
                step="any"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-[#14F195] focus:outline-none font-mono"
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Trade Calculation Summary */}
            <div className="space-y-1.5 rounded-xl bg-slate-950/80 p-3.5 border border-white/5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Position Value:</span>
                <span className="font-bold text-white">${positionSizeUsd.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Est. Liquidation Price:</span>
                <span className="font-bold text-amber-400">
                  ${liquidationPrice < 0.1 ? liquidationPrice.toFixed(6) : liquidationPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Maintenance Margin:</span>
                <span className="text-slate-300">2.0%</span>
              </div>
            </div>

            {/* Execute Button */}
            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-mono text-xs font-extrabold uppercase tracking-wider transition shadow-lg ${
                direction === "LONG"
                  ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
                  : "bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20"
              }`}
            >
              Open {direction} {leverage}x on {selectedMarket.symbol}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
