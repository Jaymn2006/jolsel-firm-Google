/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Perpetual Futures Engine for Jolsel Firm Devnet Game

export interface PerpMarket {
  symbol: string;
  name: string;
  indexPrice: number;
  markPrice: number;
  fundingRate8h: number; // e.g. 0.0105%
  maxLeverage: number; // e.g. 50
  openInterestUsd: number;
  volume24hUsd: number;
  change24h: number;
}

export interface PerpPosition {
  id: string;
  marketSymbol: string;
  direction: "LONG" | "SHORT";
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  sizeTokens: number;
  collateralUsd: number;
  collateralType: "JOLSEL" | "SOL";
  liquidationPrice: number;
  unrealizedPnlUsd: number;
  unrealizedPnlPct: number;
  takeProfitPrice?: number;
  stopLossPrice?: number;
  timestamp: string;
}

export const PERP_MARKETS: PerpMarket[] = [
  {
    symbol: "SOL-PERP",
    name: "Solana Perpetual",
    indexPrice: 184.5,
    markPrice: 184.62,
    fundingRate8h: 0.0125,
    maxLeverage: 50,
    openInterestUsd: 18420000,
    volume24hUsd: 42100000,
    change24h: 4.8,
  },
  {
    symbol: "JOLSEL-PERP",
    name: "Jolsel Firm In-Game Perp",
    indexPrice: 0.0425,
    markPrice: 0.0426,
    fundingRate8h: 0.025,
    maxLeverage: 30,
    openInterestUsd: 3200000,
    volume24hUsd: 8400000,
    change24h: 18.4,
  },
  {
    symbol: "BONK-PERP",
    name: "Bonk Meme Perpetual",
    indexPrice: 0.0000214,
    markPrice: 0.00002142,
    fundingRate8h: 0.018,
    maxLeverage: 25,
    openInterestUsd: 5800000,
    volume24hUsd: 14200000,
    change24h: 12.3,
  },
  {
    symbol: "CHICO-PERP",
    name: "Chico Moonshot Perp",
    indexPrice: 0.00645,
    markPrice: 0.00646,
    fundingRate8h: 0.035,
    maxLeverage: 20,
    openInterestUsd: 1420000,
    volume24hUsd: 3900000,
    change24h: 9.1,
  },
  {
    symbol: "BTC-PERP",
    name: "Bitcoin Perpetual",
    indexPrice: 89450.0,
    markPrice: 89462.0,
    fundingRate8h: 0.008,
    maxLeverage: 50,
    openInterestUsd: 94500000,
    volume24hUsd: 182000000,
    change24h: 2.1,
  },
  {
    symbol: "ETH-PERP",
    name: "Ethereum Perpetual",
    indexPrice: 3240.0,
    markPrice: 3241.5,
    fundingRate8h: 0.009,
    maxLeverage: 50,
    openInterestUsd: 48900000,
    volume24hUsd: 89000000,
    change24h: 3.4,
  },
];

/**
 * Calculate Liquidation Price for Long or Short
 */
export function calculateLiquidationPrice(
  entryPrice: number,
  leverage: number,
  direction: "LONG" | "SHORT",
  maintenanceMarginPct: number = 0.02
): number {
  if (leverage <= 1) {
    return direction === "LONG" ? 0 : entryPrice * 2;
  }
  const initialMarginPct = 1 / leverage;
  const bankruptcyBuffer = initialMarginPct - maintenanceMarginPct;

  if (direction === "LONG") {
    return Math.max(0, entryPrice * (1 - bankruptcyBuffer));
  } else {
    return entryPrice * (1 + bankruptcyBuffer);
  }
}

/**
 * Calculate Realized/Unrealized PnL
 */
export function computePositionPnl(
  pos: PerpPosition,
  currentPrice: number
): { pnlUsd: number; pnlPct: number } {
  const priceDiff = currentPrice - pos.entryPrice;
  const rawPnl =
    pos.direction === "LONG"
      ? (priceDiff / pos.entryPrice) * pos.collateralUsd * pos.leverage
      : (-priceDiff / pos.entryPrice) * pos.collateralUsd * pos.leverage;

  const pnlPct = (rawPnl / pos.collateralUsd) * 100;
  return {
    pnlUsd: Number(rawPnl.toFixed(2)),
    pnlPct: Number(pnlPct.toFixed(2)),
  };
}
