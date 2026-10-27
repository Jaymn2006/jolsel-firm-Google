/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Gift,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldAlert,
  Coins,
  Award,
  ChevronRight,
  BookOpen,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Flame,
  Volume2,
} from "lucide-react";
import type { PlayerProfile } from "../../lib/gameEconomy";
import { playSfx } from "../../lib/sound";

interface MysteryCratesProps {
  player: PlayerProfile;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerProfile>>;
}

interface CrateTier {
  id: string;
  name: string;
  subtitle: string;
  category: "memecoins" | "perpetuals" | "stocks" | "calculus";
  costJolsel: number;
  gradient: string;
  borderColor: string;
  textColor: string;
  icon: string;
  rewardsSummary: string;
  lessonTitle: string;
  lessonSummary: string;
  lessonDetails: {
    heading: string;
    explanation: string;
    ruleOfThumb: string;
    formula?: string;
  };
  possibleDrops: {
    jolselMin: number;
    jolselMax: number;
    perk: string;
    perkDesc: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    bonusJolsel: number;
  };
}

const CRATES: CrateTier[] = [
  {
    id: "crate_meme",
    name: "Solana Trench Crate",
    subtitle: "Memecoin Bonding Curves & Rug Defense",
    category: "memecoins",
    costJolsel: 0,
    gradient: "from-pink-500/20 via-purple-900/30 to-slate-950",
    borderColor: "border-pink-500/40",
    textColor: "text-pink-400",
    icon: "🔥",
    rewardsSummary: "150 - 600 $JOLSEL + Slippage Armor Perk",
    lessonTitle: "How Memecoin Bonding Curves Work",
    lessonSummary: "Learn how tokens launch deterministically before migrating to Raydium/Meteora pools.",
    lessonDetails: {
      heading: "Bonding Curves vs Automatic Market Makers",
      explanation:
        "Memecoin launchpads use a mathematical bonding curve (P = k · S²). Every token purchased moves the price higher along a predictable curve. Once the curve fills (~85 SOL), the collected SOL and tokens are automatically migrated to a decentralized liquidity pool (Raydium or Meteora) and LP tokens are permanently burned.",
      ruleOfThumb:
        "Always verify two critical contract properties: 1) Mint Authority Revoked (dev cannot print more tokens), and 2) Freeze Authority Revoked (dev cannot freeze your wallet).",
      formula: "Price(S) = k × Supply² · Migration Target = 85 SOL",
    },
    possibleDrops: {
      jolselMin: 150,
      jolselMax: 600,
      perk: "SLIPPAGE_ARMOR",
      perkDesc: "Reduces maximum front-running slippage on volatile memecoins to 0.1%.",
    },
    quiz: {
      question: "What happens when a memecoin bonding curve reaches 100% completion?",
      options: [
        "The developer keeps all funds in their personal wallet",
        "Liquidity is deployed to Raydium/Meteora DEX and LP tokens are burned",
        "The token price permanently resets to zero",
        "Trading stops permanently",
      ],
      correctIndex: 1,
      bonusJolsel: 100,
    },
  },
  {
    id: "crate_perps",
    name: "Leverage Accelerator Crate",
    subtitle: "Crypto Perps, Funding Rates & Liquidation Math",
    category: "perpetuals",
    costJolsel: 350,
    gradient: "from-cyan-500/20 via-blue-950/40 to-slate-950",
    borderColor: "border-cyan-500/40",
    textColor: "text-cyan-400",
    icon: "⚡",
    rewardsSummary: "400 - 1,500 $JOLSEL + Anti-Liquidation Buffer",
    lessonTitle: "The Calculus of Liquidation & Funding",
    lessonSummary: "Master maintenance margins and funding rate arbitrage to avoid losing your principal.",
    lessonDetails: {
      heading: "Perpetual Contracts & Funding Velocity",
      explanation:
        "Unlike spot trading, perpetual contracts have no expiry date. To tether the perpetual price to the spot index price, exchanges use a Funding Rate. When longs dominate, longs pay shorts every hour. If funding is deeply positive (+0.08%), holding long positions bleeds money regardless of price action.",
      ruleOfThumb:
        "At 50x leverage, a mere 2.0% adverse price move wipes out your entire position. Always maintain an extra 15% collateral buffer.",
      formula: "P_liq = Entry × (1 - (1 / Leverage) + Maintenance_Margin)",
    },
    possibleDrops: {
      jolselMin: 400,
      jolselMax: 1500,
      perk: "ANTI_LIQUIDATION_BUFFER",
      perkDesc: "Expands your perpetual liquidation distance by +5% margin tolerance.",
    },
    quiz: {
      question: "If a perpetual market has high positive funding (+0.08%), who pays whom?",
      options: [
        "The exchange pays all traders equally",
        "Long position holders pay short position holders",
        "Short position holders pay long position holders",
        "Nobody pays anything",
      ],
      correctIndex: 1,
      bonusJolsel: 150,
    },
  },
  {
    id: "crate_stocks",
    name: "Synthetic Wall St Crate",
    subtitle: "Tokenized Stocks & Real World Assets (RWAs)",
    category: "stocks",
    costJolsel: 600,
    gradient: "from-amber-500/20 via-yellow-950/30 to-slate-950",
    borderColor: "border-amber-500/40",
    textColor: "text-amber-400",
    icon: "🏛️",
    rewardsSummary: "800 - 3,000 $JOLSEL + Synthetic Dividend Multiplier",
    lessonTitle: "Tokenized Equities & Oracle Pegging",
    lessonSummary: "Discover how real-world stocks like NVDA, AAPL, and TSLA trade 24/7 on Solana.",
    lessonDetails: {
      heading: "24/7 Synthetic Equities via High-Speed Oracles",
      explanation:
        "Tokenized stocks wrap real equity exposure into Solana SPL tokens or synthetic perpetual contracts. High-frequency oracles (like Pyth Network and Chainlink) publish stock prices on-chain every 400 milliseconds with confidence intervals. This allows global crypto users to trade US equities around the clock without traditional stock broker restrictions.",
      ruleOfThumb:
        "During closed US market hours (weekends/nights), synthetic equities trade on decentralized order books. Always verify oracle staleness timestamps before executing large orders.",
      formula: "Confidence_Interval: σ_oracle < 0.15% · Latency < 1000ms",
    },
    possibleDrops: {
      jolselMin: 800,
      jolselMax: 3000,
      perk: "SYNTHETIC_DIVIDEND_BOOST",
      perkDesc: "Earns a +3.5% APY bonus yield when staking in tokenized equity vault pools.",
    },
    quiz: {
      question: "How do decentralized networks know the real-time price of tokenized stocks?",
      options: [
        "A single developer manually types the price into a web dashboard",
        "High-frequency decentralized oracles like Pyth publish price feeds on-chain",
        "They guess based on Bitcoins price",
        "Prices are fixed and never change",
      ],
      correctIndex: 1,
      bonusJolsel: 200,
    },
  },
  {
    id: "crate_quantum",
    name: "Quantum Firm Master Crate",
    subtitle: "Autonomous Multi-Agent Kelly Calculus",
    category: "calculus",
    costJolsel: 1200,
    gradient: "from-emerald-500/20 via-teal-950/40 to-slate-950",
    borderColor: "border-emerald-500/40",
    textColor: "text-emerald-400",
    icon: "💎",
    rewardsSummary: "2,000 - 8,000 $JOLSEL + Grandmaster Quant Badge",
    lessonTitle: "Kelly Criterion & Asymmetric Edge",
    lessonSummary: "The exact mathematical formulation used by the 17 Jolsel Firm desks.",
    lessonDetails: {
      heading: "The Kelly Fraction for Wealth Compounding",
      explanation:
        "John Kellys formula solves for the optimal bet size that maximizes the expected logarithm of wealth. In trading, bet sizing matters more than directional prediction. If you have an edge (e.g. 60% win rate with 1.5 payoff ratio), betting too much leads to ruin; betting too little leads to sub-optimal growth.",
      ruleOfThumb:
        "Professional quantitative firms rarely use Full Kelly because real-world variance is fat-tailed. The Jolsel Firm desks operate on Half-Kelly (f* / 2) to prevent drawdowns.",
      formula: "f* = (p × b - q) / b · Optimal Bet Ratio",
    },
    possibleDrops: {
      jolselMin: 2000,
      jolselMax: 8000,
      perk: "KELLY_QUANT_SHIELD",
      perkDesc: "Unlocks automated half-Kelly position sizing assistant on all perpetual trades.",
    },
    quiz: {
      question: "Why do quantitative desks use Half-Kelly instead of Full Kelly sizing?",
      options: [
        "Because they ran out of math formulas",
        "To drastically reduce portfolio drawdowns while retaining ~75% of compound growth",
        "Because the exchange does not allow big numbers",
        "Half-Kelly is just a random guess",
      ],
      correctIndex: 1,
      bonusJolsel: 300,
    },
  },
];

export function MysteryCrates({ player, setPlayer }: MysteryCratesProps) {
  const [openingCrateId, setOpeningCrateId] = useState<string | null>(null);
  const [activeLessonCrate, setActiveLessonCrate] = useState<CrateTier | null>(null);
  const [unboxedReward, setUnboxedReward] = useState<{
    crate: CrateTier;
    jolselAwarded: number;
    perk: string;
    perkDesc: string;
  } | null>(null);

  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);

  const handleOpenCrate = (crate: CrateTier) => {
    if (player.jolselBalance < crate.costJolsel) {
      playSfx("alert");
      alert("Insufficient $JOLSEL balance for this crate.");
      return;
    }

    playSfx("open");
    setOpeningCrateId(crate.id);

    const dropRange = crate.possibleDrops.jolselMax - crate.possibleDrops.jolselMin;
    const awardedJolsel = Math.round(crate.possibleDrops.jolselMin + Math.random() * dropRange);

    setTimeout(() => {
      playSfx("win");
      setOpeningCrateId(null);

      const currentPerks = player.unlockedPerks || [];
      const updatedPerks = Array.from(new Set([...currentPerks, crate.possibleDrops.perk]));
      const cratesCount = (player.cratesOpened || 0) + 1;

      const updatedPlayer: PlayerProfile = {
        ...player,
        jolselBalance: player.jolselBalance - crate.costJolsel + awardedJolsel,
        xp: player.xp + 250,
        unlockedPerks: updatedPerks,
        cratesOpened: cratesCount,
      };

      setPlayer(updatedPlayer);
      setUnboxedReward({
        crate,
        jolselAwarded: awardedJolsel,
        perk: crate.possibleDrops.perk,
        perkDesc: crate.possibleDrops.perkDesc,
      });

      setSelectedQuizOption(null);
      setQuizSubmitted(false);
      setQuizSuccess(false);
    }, 1200);
  };

  const handleQuizSubmit = () => {
    if (!unboxedReward || selectedQuizOption === null) return;
    const isCorrect = selectedQuizOption === unboxedReward.crate.quiz.correctIndex;
    setQuizSubmitted(true);
    setQuizSuccess(isCorrect);

    if (isCorrect) {
      playSfx("win");
      const bonus = unboxedReward.crate.quiz.bonusJolsel;
      setPlayer((prev) => ({
        ...prev,
        jolselBalance: prev.jolselBalance + bonus,
        xp: prev.xp + 150,
      }));
    } else {
      playSfx("alert");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              MYSTERY CRATES & TRADING ACADEMY
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300">
              <Gift className="h-3 w-3 text-amber-400" />
              HIDDEN REWARDS
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Unbox crates to discover hidden $JOLSEL bounties, unlock rare trading perks, and master the mechanics of memecoins, crypto perps, and tokenized stocks.
          </p>
        </div>

        {/* Player Token Pill */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-slate-900 px-3.5 py-1.5 text-right font-mono text-xs">
            <div className="text-[10px] uppercase text-slate-400">Your In-Game Balance</div>
            <div className="font-bold text-amber-300">{player.jolselBalance.toLocaleString()} $JOLSEL</div>
          </div>
        </div>
      </div>

      {/* Crates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CRATES.map((crate) => {
          const isOpening = openingCrateId === crate.id;
          const canAfford = player.jolselBalance >= crate.costJolsel;

          return (
            <div
              key={crate.id}
              className={`relative flex flex-col justify-between rounded-2xl border ${crate.borderColor} bg-gradient-to-b ${crate.gradient} p-5 backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-[1.02]`}
            >
              {/* Top Meta */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{crate.icon}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                      crate.costJolsel === 0
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-white/10 text-white border border-white/15"
                    }`}
                  >
                    {crate.costJolsel === 0 ? "FREE / STARTER" : `${crate.costJolsel.toLocaleString()} $JOLSEL`}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-white tracking-wide">
                  {crate.name}
                </h3>
                <p className="mt-0.5 text-xs text-slate-300 font-sans leading-snug">
                  {crate.subtitle}
                </p>

                {/* Highlights */}
                <div className="mt-4 rounded-xl bg-slate-950/60 border border-white/5 p-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
                    <span className="text-[11px] font-mono">{crate.rewardsSummary}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <BookOpen className="h-3 w-3 text-cyan-400 shrink-0" />
                    <span className="text-[11px]">{crate.lessonTitle}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  disabled={isOpening || !canAfford}
                  onClick={() => handleOpenCrate(crate)}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition shadow-lg ${
                    isOpening
                      ? "bg-amber-400 text-slate-950 animate-pulse"
                      : canAfford
                      ? "bg-[#14F195] text-slate-950 hover:bg-[#14F195]/90 hover:shadow-[#14F195]/30 cursor-pointer"
                      : "bg-white/10 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <Gift className="h-3.5 w-3.5" />
                  <span>{isOpening ? "Opening Crate..." : "Unbox Crate"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLessonCrate(crate)}
                  className="flex w-full items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-white/10 transition"
                >
                  <BookOpen className="h-3 w-3 text-cyan-300" />
                  <span>Preview Lesson</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unboxed Reward Modal with Interactive Micro-Lesson */}
      {unboxedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl rounded-3xl border border-[#14F195]/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{unboxedReward.crate.icon}</span>
                <div>
                  <div className="text-xs font-mono text-[#14F195] font-bold">
                    CRATE UNBOXED SUCCESSFULLY!
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    {unboxedReward.crate.name}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUnboxedReward(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold font-mono">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>JOLSEL TOKEN DROP</span>
                </div>
                <p className="mt-1 text-2xl font-black font-mono text-white">
                  +{unboxedReward.jolselAwarded.toLocaleString()} $JOLSEL
                </p>
                <p className="text-[11px] text-amber-200/70 mt-1">
                  Deposited directly to your wallet balance.
                </p>
              </div>

              <div className="rounded-2xl border border-[#14F195]/30 bg-[#14F195]/10 p-4">
                <div className="flex items-center gap-1.5 text-xs text-[#14F195] font-bold font-mono">
                  <Award className="h-4 w-4" />
                  <span>UNLOCKED PERK</span>
                </div>
                <p className="mt-1 text-base font-bold font-mono text-white">
                  {unboxedReward.perk.replace(/_/g, " ")}
                </p>
                <p className="text-[11px] text-slate-300 mt-1">
                  {unboxedReward.perkDesc}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <BookOpen className="h-4 w-4" />
                <span>Trading Academy: {unboxedReward.crate.lessonTitle}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {unboxedReward.crate.lessonDetails.explanation}
              </p>

              {unboxedReward.crate.lessonDetails.formula && (
                <div className="rounded-xl bg-slate-950 p-2.5 font-mono text-xs text-amber-300 border border-amber-500/20">
                  {unboxedReward.crate.lessonDetails.formula}
                </div>
              )}

              <div className="rounded-xl bg-white/5 p-2.5 text-xs text-slate-300 border border-white/5">
                <strong className="text-white">Pro Tip: </strong>
                {unboxedReward.crate.lessonDetails.ruleOfThumb}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-purple-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" />
                  Knowledge Checkpoint (Bonus +{unboxedReward.crate.quiz.bonusJolsel} $JOLSEL)
                </span>
              </div>
              <p className="text-xs text-white font-medium mb-3">
                {unboxedReward.crate.quiz.question}
              </p>

              <div className="space-y-2">
                {unboxedReward.crate.quiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={quizSubmitted}
                    onClick={() => setSelectedQuizOption(idx)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-left text-xs transition border ${
                      selectedQuizOption === idx
                        ? "border-[#14F195] bg-[#14F195]/15 text-white font-semibold"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <span>{opt}</span>
                    {selectedQuizOption === idx && <CheckCircle className="h-3.5 w-3.5 text-[#14F195]" />}
                  </button>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  type="button"
                  disabled={selectedQuizOption === null}
                  onClick={handleQuizSubmit}
                  className="mt-3 w-full rounded-xl bg-purple-500/30 border border-purple-500/50 py-2 text-xs font-bold text-purple-200 hover:bg-purple-500/40 disabled:opacity-40 transition"
                >
                  Submit Answer for Bonus
                </button>
              ) : (
                <div
                  className={`mt-3 rounded-xl p-2.5 text-center text-xs font-bold font-mono ${
                    quizSuccess
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-red-500/20 text-red-300 border border-red-500/40"
                  }`}
                >
                  {quizSuccess
                    ? `✓ Correct! +${unboxedReward.crate.quiz.bonusJolsel} $JOLSEL added to your vault!`
                    : "✕ Incorrect choice, but knowledge is retained for the next trade!"}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setUnboxedReward(null)}
              className="mt-5 w-full rounded-xl bg-[#14F195] py-2.5 text-xs font-extrabold text-slate-950 hover:bg-[#14F195]/90 transition"
            >
              Collect Rewards & Continue Trading
            </button>
          </div>
        </div>
      )}

      {/* Lesson Preview Modal */}
      {activeLessonCrate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeLessonCrate.icon}</span>
                <h3 className="font-bold text-white text-base">
                  {activeLessonCrate.lessonTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveLessonCrate(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>{activeLessonCrate.lessonDetails.explanation}</p>
              {activeLessonCrate.lessonDetails.formula && (
                <div className="rounded-xl bg-slate-900 border border-amber-500/30 p-2.5 font-mono text-amber-300">
                  {activeLessonCrate.lessonDetails.formula}
                </div>
              )}
              <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                <strong className="text-white">Key Takeaway: </strong>
                {activeLessonCrate.lessonDetails.ruleOfThumb}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveLessonCrate(null)}
              className="mt-5 w-full rounded-xl bg-white/10 py-2 text-xs font-bold text-white hover:bg-white/15 transition"
            >
              Close Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
