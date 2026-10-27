import test from "node:test";
import assert from "node:assert/strict";
import { TradingFirmEngine } from "./engine";
import { createInitialContext } from "./context";
import { MrGrumpy } from "./compliance/mrGrumpy";
import { RiskManager } from "./compliance/riskManager";
import { Judge } from "./executive/judge";
import { Verdicter } from "./executive/verdicter";
import { formatUsd, formatPct, unrealizedPnl, type Position } from "../positions";

test("CorporateContext initializes with valid default parameters", () => {
  const ctx = createInitialContext(1000);
  assert.equal(ctx.walletBalanceUSDT, 1000);
  assert.equal(ctx.riskVetoTriggered, false);
  assert.equal(ctx.executionApproved, false);
  assert.equal(ctx.tradeDirection, "LONG");
});

test("MrGrumpy triggers compliance veto when score is under floor", () => {
  const ctx = createInitialContext(500);
  ctx.customIndicatorsScore = 60; // below 75
  MrGrumpy.enforceZeroTolerance(ctx);
  assert.equal(ctx.riskVetoTriggered, true);
  assert.match(ctx.vetoReason, /Zero-Tolerance/);
});

test("RiskManager vetoes when single position size exceeds 25% of wallet balance", () => {
  const ctx = createInitialContext(400); // 25% is $100
  ctx.targetPositionSizeUSDT = 150; // exceeds $100
  RiskManager.verifySurvivalFloor(ctx);
  assert.equal(ctx.riskVetoTriggered, true);
  assert.match(ctx.vetoReason, /Survival Floor/);
});

test("Judge requires quorum of affirmative votes", () => {
  const ctx = createInitialContext(500);
  ctx.boardroomVotes = {
    Forecaster: "APPROVE",
    Broker: "YES — momentum",
    Reviewer: "APPROVE",
    MrGrumpy: "APPROVE",
  };
  const { yesCount, quorumReached } = Judge.aggregateVotes(ctx);
  assert.equal(yesCount, 4);
  assert.equal(quorumReached, true);
});

test("Verdicter denies mandate if risk veto is active", () => {
  const ctx = createInitialContext(500);
  ctx.isWorthIt = true;
  ctx.riskVetoTriggered = true;
  ctx.vetoReason = "Liquidity floor breach";
  const approved = Verdicter.signMandate(ctx);
  assert.equal(approved, false);
  assert.equal(ctx.executionApproved, false);
});

test("TradingFirmEngine approves high-momentum healthy candidate", () => {
  const engine = new TradingFirmEngine(1000);
  const result = engine.runPipeline({
    symbol: "BONK",
    priceChange: { h24: 15 },
    volume: { h24: 5000000 },
    liquidity: { usd: 250000 },
  });
  assert.equal(result.verdict, "APPROVED");
  assert.equal(result.context.executionApproved, true);
  assert.equal(result.context.tradeDirection, "LONG");
  assert.ok(result.order);
  assert.equal(result.order?.symbol, "BONK");
});

test("Positions PnL calculation computes accurate unrealized gain and loss", () => {
  const pos: Position = {
    id: "tx-test-1",
    mint: "TokenMint123",
    symbol: "WIF",
    name: "Dogwifhat",
    entryPriceUsd: 2.0,
    amountTokens: 100,
    costUsd: 200,
    openedAt: Date.now(),
    side: "long",
    status: "open",
  };

  // Mark price up 25% -> $2.50
  const gain = unrealizedPnl(pos, 2.5);
  assert.equal(gain.value, 250);
  assert.equal(gain.pnl, 50);
  assert.equal(gain.pct, 25);

  // Mark price down 10% -> $1.80
  const loss = unrealizedPnl(pos, 1.8);
  assert.equal(loss.value, 180);
  assert.equal(loss.pnl, -20);
  assert.equal(loss.pct, -10);
});

test("Format helpers return human-readable financial representations", () => {
  assert.equal(formatUsd(1500000), "$1.50M");
  assert.equal(formatUsd(1250), "$1.3K");
  assert.equal(formatUsd(12.34), "$12.34");
  assert.equal(formatPct(15.2), "+15.20%");
  assert.equal(formatPct(-8.45), "-8.45%");
});
