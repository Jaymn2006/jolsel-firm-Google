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
  MessageSquare,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Flame,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import type { PlayerProfile } from "../../lib/gameEconomy";

interface GrokBotCompanionProps {
  player: PlayerProfile;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerProfile>>;
  activeTokenSymbol?: string;
  winProbPct?: number;
  kellyFraction?: number;
}

const GROK_QUOTES: Record<string, string[]> = {
  sarcastic_genius: [
    "I've calculated 4.2 billion scenarios. In 4.19 billion of them, market makers appreciate your donation. Let's aim for the other one.",
    "The 17 desks are debating whether to buy the dip. Meanwhile, Mr. Grumpy is already calculating your funeral expenses.",
    "Kelly Criterion says 8.4%. You're probably going to 50x leverage it anyway, aren't you?",
    "Nice trade. Even a stopped clock has positive stochastic drift twice a day.",
    "Your 10,000 $JOLSEL tokens are looking cozy. Don't blow them all on low-liquidity cat coins.",
  ],
  hype_coach: [
    "🚀 LFG! The 17 desks have aligned their vectors. Quorum is 15/17 YES on the live tape!",
    "You were born to trade Solana devnet! Let's ride this wave straight to the top of the leaderboard!",
    "Probability matrix is flashing green! Lock in that Kelly sizing and let the math do the heavy lifting!",
    "Diamond hands detected! That win streak is climbing faster than an unconstrained exponential!",
  ],
  grumpy_risk: [
    "Survival floor breach imminent if you keep trading without a stop-loss. Have you learned nothing?",
    "95% Value-at-Risk indicates a fat-tail blowup. I am vetoing your emotional urges.",
    "Overthinker desk was right: that meme coin pool has 0.4% depth. One whale sneeze and you're liquidated.",
    "Capital preservation first. Vanity metrics second. Stop staring at the 50x button.",
  ],
  zen_master: [
    "The tape flows like water. Do not fight the order book; become the liquidity.",
    "In the calculus of trading, equilibrium is found not in excitement, but in mathematical discipline.",
    "Win or loss, both are merely state transitions in Markov chain probability.",
  ],
};

export function GrokBotCompanion({
  player,
  setPlayer,
  activeTokenSymbol = "CHICO",
  winProbPct = 78.4,
  kellyFraction = 0.082,
}: GrokBotCompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentThought, setCurrentThought] = useState(
    "Grok AI Bot initialized. 17 desks online. Ready to dominate the Devnet leaderboard."
  );
  const [isThinking, setIsThinking] = useState(false);
  const [expression, setExpression] = useState<"neutral" | "happy" | "thinking" | "warning">("neutral");

  // Cycle thoughts periodically
  useEffect(() => {
    const quotes = GROK_QUOTES[player.grokPersonality] || GROK_QUOTES.sarcastic_genius;
    const interval = setInterval(() => {
      if (!isOpen) return;
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentThought(randomQuote);
    }, 12000);
    return () => clearInterval(interval);
  }, [player.grokPersonality, isOpen]);

  const handleAskAdvice = () => {
    setIsThinking(true);
    setExpression("thinking");
    setTimeout(() => {
      setIsThinking(false);
      setExpression(winProbPct >= 70 ? "happy" : "warning");
      if (winProbPct >= 70) {
        setCurrentThought(
          `Analysis on ${activeTokenSymbol}: Bayesian win probability is ${winProbPct.toFixed(1)}%. Kelly sizing recommends ${(kellyFraction * 100).toFixed(1)}% of your stack. The executive chamber is leaning LONG!`
        );
      } else {
        setCurrentThought(
          `Caution on ${activeTokenSymbol}: Win probability is only ${winProbPct.toFixed(1)}%. Mr. Grumpy desk is waving the red flag. Keep sizing strictly below 3% to survive the chop.`
        );
      }
    }, 800);
  };

  const handleRoast = () => {
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setExpression("neutral");
      const roasts = [
        `You have ${player.winStreak} wins in a row and think you're Jim Simons? Don't forget who gave you that 10,000 $JOLSEL airdrop!`,
        `Your risk profile says '${player.riskTolerance}'. That's a polite way of saying you treat standard deviation as a challenge.`,
        `I simulated your trading strategy on 10,000 Monte Carlo paths. In 9,200 of them, you asked me for another faucet reset.`,
      ];
      setCurrentThought(roasts[Math.floor(Math.random() * roasts.length)]);
    }, 600);
  };

  const togglePersonality = () => {
    const list: PlayerProfile["grokPersonality"][] = [
      "sarcastic_genius",
      "hype_coach",
      "grumpy_risk",
      "zen_master",
    ];
    const nextIdx = (list.indexOf(player.grokPersonality) + 1) % list.length;
    const nextPers = list[nextIdx];
    setPlayer((prev) => ({ ...prev, grokPersonality: nextPers }));
    setCurrentThought(`Personality switched to: ${nextPers.replace("_", " ").toUpperCase()}`);
  };

  return (
    <aside aria-label="Grok AI Companion" className="fixed bottom-4 right-4 z-50">
      {/* Minimized Floating Bot Trigger Button */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full border border-cyan-400/40 bg-slate-900/90 px-4 py-2.5 shadow-xl shadow-cyan-500/20 backdrop-blur-md hover:scale-105 hover:border-cyan-300 transition"
          title="Open Grok AI Bot Assistant"
        >
          {/* Animated Glow Rings */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-30 blur group-hover:opacity-60 transition" />
          
          {/* Grok Mini Face */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-950 border border-cyan-400/60">
            <Bot className="h-4 w-4 text-cyan-300 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="relative flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs font-bold text-white tracking-wide">GROK BOT</span>
              <Sparkles className="h-3 w-3 text-amber-300" />
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">Devnet AI Companion</span>
          </div>
        </button>
      ) : (
        /* Expanded Grok Bot Interactive Window */
        <div className="w-80 sm:w-96 rounded-2xl border border-cyan-500/40 bg-slate-950/95 p-4 shadow-2xl shadow-cyan-500/25 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              {/* Bot Avatar Icon */}
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-900/60 to-indigo-950 border border-cyan-400/40">
                <Bot className="h-5 w-5 text-cyan-300" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-wide">GROK AI BOT</span>
                  <span className="rounded bg-cyan-500/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-cyan-300 border border-cyan-500/30">
                    DEVNET AI
                  </span>
                </div>
                <button
                  type="button"
                  onClick={togglePersonality}
                  className="text-[10px] text-slate-400 hover:text-cyan-300 transition flex items-center gap-1"
                  title="Click to toggle Grok personality mode"
                >
                  <span>Mode: {player.grokPersonality.replace("_", " ")}</span>
                  <RefreshCw className="h-2.5 w-2.5 text-cyan-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPlayer((p) => ({ ...p, soundEffects: !p.soundEffects }))}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white"
                title={player.soundEffects ? "Sound effects enabled" : "Sound effects muted"}
              >
                {player.soundEffects ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white"
                title="Minimize Grok Bot"
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
                      ? "bg-emerald-400 shadow-sm shadow-emerald-400"
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
                      ? "bg-emerald-400 shadow-sm shadow-emerald-400"
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

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={handleAskAdvice}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition"
            >
              <Zap className="h-3 w-3" />
              <span>Analyze Tape</span>
            </button>
            <button
              type="button"
              onClick={handleRoast}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition"
            >
              <Flame className="h-3 w-3" />
              <span>Roast Me</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
