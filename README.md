# Jolsel Firm — Multi-Agent Solana Trading Game & Autonomous Core

> **Blueprint Sync:** [Alitiora-Initiative/Jolsel-Firm-Agent](https://github.com/Alitiora-Initiative/Jolsel-Firm-Agent)  
> **Reference UI & War Room:** `jolsel-firm.vercel.app/core`  
> **Runtime Target:** Solana Devnet Gaming Economy + Mainnet-Ready Spot & Perps Pipeline

---

## 🌟 Overview

**Jolsel Firm** is an autonomous multi-agent crypto trading simulation and game engineered for Solana. Inspired by high-frequency proprietary trading firm pipelines, the system organizes **17 specialized AI agent desks** across 5 sovereign departments to analyze live market liquidity, compute continuous stochastic calculus models, deliberatively vote on mandates, and prepare unsigned transactions.

Every player on Devnet receives a **Genesis Airdrop** of **10,000 $JOLSEL tokens** and **1.0 Devnet SOL**, competing on a real-time global leaderboard across Spot, Futures/Perpetuals (up to 50x leverage), and Whale Copytrading.

---

## 🌌 The 17-Desk Orbital War Room (`/core`)

The War Room faithfully replicates the visual architecture of the reference UI:
- **Central Singularity Core:** A gravitational black hole with a radiant orange/amber accretion disc (`#ea580c` to `#fbbf24`), lens distortion glow, and central coordination mandate typography.
- **Concentric Orbital Particle Streams:** Concentric dashed orbital rings carrying circulating photon rays and desk-to-desk telemetry packets.
- **17 Sovereign Desks:**
  1. **Teacher** (`audit`) — Pipeline closure & rule reinforcement
  2. **Bscoter** (`discovery`) — Token scout & liquidity radar
  3. **Crypto Guru** (`discovery`) — Crowd velocity & viral sentiment
  4. **Analuszer** (`discovery`) — Precision technical indicators (Gate ≥ 75)
  5. **Forecaster** (`planning`) — Scenario payoff matrix
  6. **Long-Term Planner** (`planning`) — Asset-class routing
  7. **Short-Term Planner** (`planning`) — Kelly criterion scale-in steps
  8. **Overthinker** (`compliance`) — Tail risk & 95% Value-at-Risk (VaR)
  9. **Reviewer** (`compliance`) — Pool structure & mint authority audit
  10. **Mr Grumpy** (`compliance`) — Zero-tolerance gatekeeper
  11. **Risk Manager** (`compliance`) — Survival floor & maximum exposure
  12. **Broker** (`executive`) — Boardroom momentum advocacy
  13. **Judge** (`executive`) — Vote aggregation & quorum confirmation
  14. **Verdicter** (`executive`) — Trade mandate signature
  15. **Trader** (`executive`) — Unsigned atomic routing via Jupiter CLMM
  16. **Record Keeper** (`audit`) — Immutable block ledger
  17. **Record Reviewer** (`audit`) — Cycle performance grading
- **Left Telemetry HUD:** System Status (Online/Cycle counter), Solana Tape (DexScreener live feed for ELON2028, TRUMP2028, CHICO, REMUS, Shitcoin, LMAO!), and Crawler Probe progress.
- **Right Telemetry HUD:** Monospaced live event stream with colored desk-to-desk message transmission and Latest Calls ledger.
- **Bottom Tagline:** `DIFFERENT DESKS. ONE TAPE. YOU SIGN.`

---

## 📐 Mathematical Engine: Stochastic Calculus & Probability Matrix

Located in `src/lib/calculus.ts`:
- **Ornstein-Uhlenbeck Mean-Reverting Process:**
  $$dX_t = \theta (\mu - X_t) dt + \sigma dW_t$$
  Quantifies mean-reversion pull and equilibrium pricing on Solana liquidity pools.
- **Geometric Brownian Motion & GARCH Volatility:**
  Estimates drift $\mu$ and instantaneous conditional volatility $\sigma$.
- **Kelly Criterion Optimal Sizing:**
  $$f^* = \frac{p \cdot b - q}{b}$$
  Calculates the mathematically optimal fraction of total portfolio equity to risk on any single entry without risking gambler's ruin.
- **Bayesian Win Probability:**
  Dynamically integrates volume-to-liquidity ratios, order book skew, and momentum oscillators.
- **95% Parametric Value-at-Risk (VaR):**
  Defines tail-risk exposure floors enforced by Mr Grumpy and the Risk Manager desk.

---

## 🎮 Gamification & In-Game Economy

1. **Genesis Airdrop & Devnet Faucet:**
   - New players receive **10,000 $JOLSEL** in-game tokens + **1.0 Devnet SOL**.
   - Additional faucet claims can be requested anytime directly from the wallet menu or coin page.
2. **In-Game $JOLSEL Coin (`/coin`):**
   - Live SVG price curve and Bancor bonding curve model.
   - In-game staking pool earning 24.8% APR.
   - Direct voting quorum weighting in the 17-Desk executive chamber.
3. **Perpetuals & Futures Terminal (`/perps`):**
   - 1x to 50x leverage on SOL, JOLSEL, BONK, CHICO, BTC, and ETH.
   - Long & Short positions with real-time liquidation price calculations, margin collateral in SOL or JOLSEL, and live mark-to-market PnL.
4. **Real-time Global Leaderboard (`/leaderboard`):**
   - Global ranking of active players across America, Europe, and Asia.
   - Track Net PnL, Win Rate %, Win Streak, and Badge Tiers (Diamond Hands, Whale Raider, Apex Council).
5. **Player Profile & Localization (`/profile`):**
   - Customizable player callsign, emblem avatar, and regional origin (e.g. USA, UK, Tokyo, Singapore, Berlin, etc.).
   - Configurable risk appetite (Kelly Optimal, Balanced, Conservative, Full Degen).
   - Audio effects toggle for trade confirmations and liquidations.
6. **Animated Grok AI Companion Bot:**
   - Interactive floating futuristic bot in the bottom-right corner with expressive animated visor/eyes.
   - Switchable personalities: Sarcastic Genius, Hype Coach, Zero-Tolerance Grumpy, and Zen Master.
   - On-demand tape analysis, Kelly guidance, and witty roasts.

---

## 💼 Multi-Crypto Safe Deposit Vaults (`/vault`)

- Users can deposit SOL, USDC, BTC, ETH, or JOLSEL into dedicated deterministic cryptographic deposit addresses.
- Multi-token asset breakdown with active trading allocations.
- Automated profit-sharing and emergency vault withdraw safeguards.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Blockchain:** `@solana/web3.js`, Jupiter Aggregator API, DexScreener API
- **AI Deliberation:** `@google/genai` (Gemini 3.8 Flash server-side integration)
- **Backend:** Express (`server.ts`) with Vite middleware
- **Testing:** Node.js native test runner (`tsx --test`)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run test suite
npx tsx --test src/lib/agents/engine.test.ts src/lib/calculus.test.ts

# Production build
npm run build
```

---

*Different Desks. One Tape. You Sign.*
