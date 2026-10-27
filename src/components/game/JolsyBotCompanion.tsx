/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  X,
  RefreshCw,
  Flame,
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  Coins,
} from "lucide-react";
import type { PlayerProfile } from "../../lib/gameEconomy";
import { playSfx } from "../../lib/sound";

interface JolsyBotCompanionProps {
  player: PlayerProfile;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerProfile>>;
  onAskAdvice?: () => void;
}

const JOLSY_QUIPS: Record<
  PlayerProfile["jolsyPersonality"],
  { idle: string[]; win: string[]; loss: string[]; advice: string[]; meme: string[]; stocks: string[] }
> = {
  sarcastic_genius: {
    idle: [
      "Jolsy here. Sol devnet tape is moving. Don't market buy at the local top like last time.",
      "Calculating Sharpe ratios... your current trajectory suggests a 73% probability of dopamine rush.",
      "17 desks are computing stochastic calculus while you stare at the 1-second candles.",
      "Memecoins without LP lock are just voluntary wealth redistribution. Check the bonding curve first.",
    ],
    win: [
      "You actually hit green? The math gods have blessed your reckless bravery.",
      "Profit secured. Now please don't 50x perp it into a meme coin five minutes later.",
      "Clean win. Your Kelly fraction is temporarily forgiving your sins.",
    ],
    loss: [
      "Stop loss was hit. Pain is just information entering the neural network.",
      "That liquidation was statistically foreseeable. Next time use isolated margin with a buffer.",
      "Re-running probability matrix. Good news: devnet SOL is free. Bad news: your ego isn't.",
    ],
    advice: [
      "Focus on positive expected value (EV = p*W - q*L). If EV < 0, don't execute.",
      "Always verify bonding curve progress on memecoins. Above 85% means DEX migration is imminent.",
      "When trading tokenized stocks like AAPL or NVDA on Solana, remember synthetic liquidity depends on the Pyth oracle peg.",
    ],
    meme: [
      "Memecoins 101: A bonding curve is a mathematical contract where price P = k * S^2. Early buyers get tokens cheap; late buyers fund the curve. Watch out for dev wallet dumps!",
      "Rule #1 in the trenches: Never touch a token where mint authority isn't disabled or freeze authority is active.",
    ],
    stocks: [
      "Tokenized stocks (RWAs) trade 24/7 on Solana devnet! Synthetic liquidity mirrors Wall St via high-frequency Pyth and Chainlink price feeds.",
    ],
  },
  hype_coach: {
    idle: [
      "LET'S COOK! Jolsy is in your corner! The Solana devnet is ours today!",
      "Alpha spotted! 17 agents locked in! Let's hit the top of the real trader leaderboard!",
      "Unbox those mystery crates and let's level up your trading calculus!",
    ],
    win: [
      "MASSIVE FILL! THAT'S WHAT I'M TALKING ABOUT! CHAD EXECUTION!",
      "DIAMOND HANDS UNLOCKED! Print that devnet bag!",
      "NEW STREAK RECORD IN SIGHT! Let's keep the momentum rolling!",
    ],
    loss: [
      "SHAKE IT OFF CHAMP! Every great trader eats drawdown for breakfast!",
      "Devnet is where legends sharpen their edge! Reset and execute the plan!",
    ],
    advice: [
      "Risk management wins championships! Keep position sizes under 15% of your vault!",
      "Scale in with 3 staggered limit orders instead of FOMO market buying!",
    ],
    meme: [
      "TRENCH WARFARE! Memecoins pump on narrative velocity and community momentum! Ride the wave but take profit along the bonding curve!",
    ],
    stocks: [
      "Tokenized NVDA & TSLA on-chain! Wall Street speed combined with Solana sub-second finality!",
    ],
  },
  grumpy_risk: {
    idle: [
      "Risk Officer Jolsy speaking. Don't touch that 50x leverage slider without my permission.",
      "I'm watching your margin ratio. One sudden 3% wick and you're getting liquidated.",
      "Did you check the slippage tolerance? High slippage is basically tipping front-running bots.",
    ],
    win: [
      "You made money, but your risk-adjusted metrics were atrocious. Take profits immediately.",
      "Acceptable trade. Don't get cocky. The market loves humbling overconfident degenerates.",
    ],
    loss: [
      "Told you. Over-leveraged, zero hedge, pure impulse. Now read the risk docs.",
      "Drawdown detected. Reduce your position sizes by 50% until your win rate normalizes.",
    ],
    advice: [
      "The Kelly Criterion is sacred. Size your bets strictly proportional to your edge divided by odds.",
      "Check the perp funding rate! If funding is +0.08% every hour, longs are bleeding money to shorts.",
    ],
    meme: [
      "Warning: 94% of memecoins go to zero within 48 hours. If liquidity is not burned or locked, assume worst-case rug pull.",
    ],
    stocks: [
      "Tokenized equities require strict oracle staleness checks. If Pyth oracle latency > 2000ms, halt synthetic fills.",
    ],
  },
  zen_master: {
    idle: [
      "Breathe in market clarity, breathe out emotional FOMO. Jolsy is centered.",
      "The order book flows like water. Do not resist the trend; align with the probability gradient.",
      "Wealth in trading is patience quantified.",
    ],
    win: [
      "A peaceful execution. The trade was aligned with market equilibrium.",
      "Observe the gain without attachment. Remain disciplined for the next cycle.",
    ],
    loss: [
      "Loss is the tuition fee paid to the temple of market wisdom. Reflect and proceed.",
      "The market is a mirror of one's discipline. Cleanse the bias and return calmly.",
    ],
    advice: [
      "He who trades every candle catches every knife. Wait for confirmation at key support levels.",
      "True alpha is having the patience to sit in cash until an asymmetrical risk-reward setup appears.",
    ],
    meme: [
      "Memecoins are temporary illusions of collective belief. Enjoy the dance, but do not mistake the mask for the soul.",
    ],
    stocks: [
      "Bridging traditional equities to decentralized ledgers creates harmonious 24/7 liquidity. Trade with poise.",
    ],
  },
};

export function JolsyBotCompanion({
  player,
  setPlayer,
  onAskAdvice,
}: JolsyBotCompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentThought, setCurrentThought] = useState<string>(
    "Jolsy AI Copilot online! 17 desks analyzing Solana devnet. Ready to trade memecoins, perps, and tokenized stocks."
  );
  const [isThinking, setIsThinking] = useState(false);
  const [expression, setExpression] = useState<"happy" | "neutral" | "warning">("neutral");

  // Personality safety fallback
  const personality = player.jolsyPersonality || "sarcastic_genius";
  const quipSet = JOLSY_QUIPS[personality] || JOLSY_QUIPS.sarcastic_genius;

  // Speak message if sound enabled
  const speakVoice = (text: string) => {
    if (!player.soundEffects || typeof window === "undefined" || !("speechSynthesis" in window)) {
      playSfx("click");
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = personality === "grumpy_risk" ? 0.8 : personality === "hype_coach" ? 1.2 : 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      playSfx("click");
    }
  };

  // Periodic ambient thoughts
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isThinking) {
        const pool = quipSet.idle;
        const randomQuote = pool[Math.floor(Math.random() * pool.length)];
        setCurrentThought(randomQuote);
        setExpression("neutral");
      }
    }, 28000);
    return () => clearInterval(timer);
  }, [personality, isThinking, quipSet]);

  const handleAskAdvice = () => {
    playSfx("scan");
    setIsThinking(true);
    setExpression("neutral");
    setTimeout(() => {
      setIsThinking(false);
      const pool = quipSet.advice;
      const thought = pool[Math.floor(Math.random() * pool.length)];
      setCurrentThought(thought);
      setExpression("happy");
      speakVoice(thought);
      if (onAskAdvice) onAskAdvice();
    }, 500);
  };

  const handleRoast = () => {
    playSfx("alert");
    setIsThinking(true);
    setExpression("warning");
    setTimeout(() => {
      setIsThinking(false);
      const roasts = [
        `Looking at your ${player.totalTrades} trades... my neural weights hurt. But hey, ${player.winStreak} streak isn't terrible!`,
        `You've got ${player.jolselBalance.toLocaleString()} $JOLSEL and you're still hesitating on the devnet perps? Execute with calculus!`,
        `I simulated 10,000 parallel dimensions for your wallet. In 9,200 of them, you asked me for another faucet reset.`,
      ];
      const roast = roasts[Math.floor(Math.random() * roasts.length)];
      setCurrentThought(roast);
      speakVoice(roast);
    }, 600);
  };

  const handleExplainMemecoins = () => {
    playSfx("click");
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      const pool = quipSet.meme;
      const quote = pool[Math.floor(Math.random() * pool.length)];
      setCurrentThought(quote);
      setExpression("happy");
      speakVoice(quote);
    }, 400);
  };

  const handleExplainStocks = () => {
    playSfx("click");
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      const pool = quipSet.stocks;
      const quote = pool[Math.floor(Math.random() * pool.length)];
      setCurrentThought(quote);
      setExpression("happy");
      speakVoice(quote);
    }, 400);
  };

  const togglePersonality = () => {
    playSfx("click");
    const list: PlayerProfile["jolsyPersonality"][] = [
      "sarcastic_genius",
      "hype_coach",
      "grumpy_risk",
      "zen_master",
    ];
    const nextIdx = (list.indexOf(personality) + 1) % list.length;
    const nextPers = list[nextIdx];
    setPlayer((prev) => ({ ...prev, jolsyPersonality: nextPers }));
    setCurrentThought(`Jolsy personality switched to: ${nextPers.replace("_", " ").toUpperCase()}`);
    speakVoice(`Switched mode to ${nextPers.replace("_", " ")}`);
  };

  return (
    <aside aria-label="Jolsy AI Companion" className="fixed bottom-4 right-4 z-50">
      {/* Minimized Floating Bot Trigger Button */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => {
            playSfx("open");
            setIsOpen(true);
          }}
          className="group relative flex items-center gap-2.5 rounded-full border border-cyan-400/40 bg-slate-900/90 px-4 py-2.5 shadow-xl shadow-cyan-500/20 backdrop-blur-md hover:scale-105 hover:border-cyan-300 transition"
          title="Open Jolsy AI Trading Copilot"
        >
          {/* Animated Glow Rings */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-[#14F195] opacity-30 blur group-hover:opacity-60 transition" />

          {/* Jolsy Mini Face */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-950 border border-cyan-400/60">
            <Bot className="h-4 w-4 text-cyan-300 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#14F195] animate-ping" />
          </div>
          <div className="relative flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs font-bold text-white tracking-wide">JOLSY BOT</span>
              <Sparkles className="h-3 w-3 text-amber-300" />
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">AI Trading Wingman</span>
          </div>
        </button>
      ) : (
        /* Expanded Jolsy Bot Interactive Window */
        <div className="w-80 sm:w-96 rounded-2xl border border-cyan-500/40 bg-slate-950/95 p-4 shadow-2xl shadow-cyan-500/25 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              {/* Bot Avatar Icon */}
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-900/60 to-emerald-950 border border-cyan-400/40">
                <Bot className="h-5 w-5 text-cyan-300" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#14F195] ring-2 ring-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-wide">JOLSY COPILOT</span>
                  <span className="rounded bg-cyan-500/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-cyan-300 border border-cyan-500/30">
                    DEVNET AI
                  </span>
                </div>
                <button
                  type="button"
                  onClick={togglePersonality}
                  className="text-[10px] text-slate-400 hover:text-cyan-300 transition flex items-center gap-1"
                  title="Click to toggle Jolsy personality mode"
                >
                  <span>Mode: {personality.replace("_", " ")}</span>
                  <RefreshCw className="h-2.5 w-2.5 text-cyan-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const updated = !player.soundEffects;
                  setPlayer((p) => ({ ...p, soundEffects: updated }));
                  playSfx("click");
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white"
                title={player.soundEffects ? "Voice audio enabled" : "Voice muted"}
              >
                {player.soundEffects ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  playSfx("close");
                  setIsOpen(false);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white"
                title="Minimize Jolsy"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Bot Animated Visual Display */}
          <div className="relative mb-3 flex items-center gap-3 rounded-xl border border-white/5 bg-slate-900/80 p-3">
            {/* Animated Face Visor */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 border border-cyan-500/30 shadow-inner">
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2.5 w-2 rounded-full transition-all duration-300 ${
                    expression === "happy"
                      ? "bg-[#14F195] shadow-sm shadow-[#14F195]"
                      : expression === "warning"
                      ? "bg-amber-400 shadow-sm shadow-amber-400"
                      : isThinking
                      ? "bg-cyan-300 animate-bounce"
                      : "bg-cyan-400 shadow-sm shadow-cyan-400"
                  }`}
                />
                <span
                  className={`h-2.5 w-2 rounded-full transition-all duration-300 ${
                    expression === "happy"
                      ? "bg-[#14F195] shadow-sm shadow-[#14F195]"
                      : expression === "warning"
                      ? "bg-amber-400 shadow-sm shadow-amber-400"
                      : isThinking
                      ? "bg-cyan-300 animate-bounce delay-150"
                      : "bg-cyan-400 shadow-sm shadow-cyan-400"
                  }`}
                />
              </div>
            </div>

            {/* Speech Bubble */}
            <div className="min-w-0 flex-1 text-xs leading-relaxed text-slate-200">
              <p className="font-sans italic">{currentThought}</p>
            </div>
          </div>

          {/* Quick Player Stats Bar */}
          <div className="mb-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-900/60 p-2 text-center text-[10px]">
            <div>
              <span className="text-slate-400">JOLSEL Token</span>
              <p className="font-mono font-bold text-amber-300">
                {player.jolselBalance.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Devnet SOL</span>
              <p className="font-mono font-bold text-[#14F195]">
                {player.devnetSolBalance.toFixed(2)} SOL
              </p>
            </div>
            <div>
              <span className="text-slate-400">Streak</span>
              <p className="font-mono font-bold text-cyan-300">
                🔥 {player.winStreak}W
              </p>
            </div>
          </div>

          {/* Action Hub */}
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            <button
              type="button"
              onClick={handleAskAdvice}
              className="flex items-center justify-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1.5 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-500/20 transition"
            >
              <Zap className="h-3 w-3" />
              <span>Alpha Call</span>
            </button>
            <button
              type="button"
              onClick={handleRoast}
              className="flex items-center justify-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20 transition"
            >
              <Flame className="h-3 w-3" />
              <span>Roast Me</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={handleExplainMemecoins}
              className="flex items-center justify-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 py-1.5 text-[11px] font-semibold text-purple-300 hover:bg-purple-500/20 transition"
              title="Learn how bonding curves and memecoin liquidity pools work"
            >
              <Coins className="h-3 w-3" />
              <span>Meme 101</span>
            </button>
            <button
              type="button"
              onClick={handleExplainStocks}
              className="flex items-center justify-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1.5 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
              title="Learn how tokenized stocks & synthetic equities work on Solana"
            >
              <TrendingUp className="h-3 w-3" />
              <span>Stock RWAs</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
