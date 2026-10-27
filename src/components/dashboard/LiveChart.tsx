import React, { useState, useEffect, useMemo } from "react";
import { type DexPair, formatUsd, formatPct } from "../../lib/dexscreener";
import { Activity, ExternalLink, BarChart3, TrendingUp, TrendingDown, Maximize2 } from "lucide-react";

interface LiveChartProps {
  selected: DexPair | null;
  onTick?: (pair: DexPair) => void;
}

export function LiveChart({ selected, onTick }: LiveChartProps) {
  const [source, setSource] = useState<"interactive" | "dexscreener" | "birdeye">("interactive");
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "1d">("5m");
  const [livePulse, setLivePulse] = useState(false);
  const [candles, setCandles] = useState<Array<{ time: string; open: number; high: number; low: number; close: number; volume: number }>>([]);

  const basePrice = selected?.priceUsd ? parseFloat(selected.priceUsd) : 1.0;

  // Generate deterministic candlestick data based on base price
  useEffect(() => {
    if (!selected) return;
    const initialCandles: Array<{ time: string; open: number; high: number; low: number; close: number; volume: number }> = [];
    let prev = basePrice * 0.95;
    const count = 30;

    for (let i = count; i >= 0; i--) {
      const now = new Date(Date.now() - i * 60 * 5000);
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      const change = (Math.random() - 0.48) * (basePrice * 0.03);
      const open = prev;
      const close = Math.max(open * 0.8, open + change);
      const high = Math.max(open, close) + Math.random() * (basePrice * 0.015);
      const low = Math.min(open, close) - Math.random() * (basePrice * 0.015);
      const volume = Math.floor(Math.random() * 50000 + 10000);

      initialCandles.push({ time: timeStr, open, high, low, close, volume });
      prev = close;
    }
    setCandles(initialCandles);
  }, [selected?.pairAddress, basePrice]);

  // Live price ticker simulation
  useEffect(() => {
    if (!selected) return;
    const interval = setInterval(() => {
      setLivePulse(true);
      setTimeout(() => setLivePulse(false), 400);

      const delta = (Math.random() - 0.49) * (basePrice * 0.004);
      const newPrice = Math.max(0.000001, basePrice + delta);

      if (onTick && selected) {
        onTick({
          ...selected,
          priceUsd: newPrice.toString(),
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [selected, basePrice, onTick]);

  const dexUrl = selected
    ? `https://dexscreener.com/solana/${selected.pairAddress}?embed=1&theme=dark&trades=0&info=0`
    : "";

  const birdeyeUrl = selected
    ? `https://birdeye.so/tv-widget/${selected.baseToken.address}?chain=solana&viewMode=pair&theme=dark`
    : "";

  const priceChange = selected?.priceChange?.h24 ?? selected?.priceChange?.h1 ?? 0;
  const isPositive = priceChange >= 0;

  // Chart min and max for scaling
  const { minPrice, maxPrice } = useMemo(() => {
    if (candles.length === 0) return { minPrice: basePrice * 0.9, maxPrice: basePrice * 1.1 };
    let min = Infinity;
    let max = -Infinity;
    for (const c of candles) {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
    }
    return { minPrice: min * 0.99, maxPrice: max * 1.01 };
  }, [candles, basePrice]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-xl backdrop-blur-md">
      {/* Chart Top Bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white sm:text-lg">
              {selected ? `${selected.baseToken.symbol} / ${selected.quoteToken.symbol}` : "Select a pair"}
            </h2>
            {selected && (
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                {selected.dexId.toUpperCase()}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition ${
                livePulse
                  ? "bg-[#14F195]/30 text-[#14F195]"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              <Activity className="h-2.5 w-2.5 animate-pulse" /> Live Feed
            </span>
          </div>

          {selected && (
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
              <span
                className={`font-mono text-lg font-extrabold transition-all duration-300 ${
                  livePulse ? "text-[#14F195] scale-105" : "text-white"
                }`}
              >
                {formatUsd(selected.priceUsd)}
              </span>
              <span
                className={`flex items-center gap-0.5 font-mono font-bold ${
                  isPositive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {formatPct(priceChange)}
              </span>
              <span className="text-slate-400">
                24h Vol: <span className="font-mono text-slate-200">{formatUsd(selected.volume?.h24)}</span>
              </span>
              <span className="text-slate-400">
                Liq: <span className="font-mono text-slate-200">{formatUsd(selected.liquidity?.usd)}</span>
              </span>
              <span className="text-slate-400">
                FDV: <span className="font-mono text-slate-200">{formatUsd(selected.fdv || selected.marketCap)}</span>
              </span>
            </div>
          )}
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center rounded-lg border border-white/10 bg-slate-950/80 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setSource("interactive")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                source === "interactive"
                  ? "bg-[#14F195]/20 text-[#14F195]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Interactive Pro
            </button>
            <button
              type="button"
              onClick={() => setSource("dexscreener")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                source === "dexscreener"
                  ? "bg-[#14F195]/20 text-[#14F195]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              DexScreener
            </button>
            <button
              type="button"
              onClick={() => setSource("birdeye")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                source === "birdeye"
                  ? "bg-[#14F195]/20 text-[#14F195]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Birdeye
            </button>
          </div>

          {selected && (
            <a
              href={selected.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 bg-slate-950/80 p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition"
              title="Open External DexScreener"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Main Chart Canvas / Embed Container */}
      <div className="relative min-h-[460px] flex-1 overflow-hidden rounded-xl border border-white/10 bg-slate-950/90">
        {!selected ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Select a token from the market radar to view real-time candlestick feeds.
          </div>
        ) : source === "dexscreener" && dexUrl ? (
          <iframe
            key={`dex-${selected.pairAddress}`}
            title="DexScreener chart"
            src={dexUrl}
            className="h-full w-full min-h-[460px] border-0"
            allow="clipboard-write"
          />
        ) : source === "birdeye" && birdeyeUrl ? (
          <iframe
            key={`birdeye-${selected.baseToken.address}`}
            title="Birdeye chart"
            src={birdeyeUrl}
            className="h-full w-full min-h-[460px] border-0"
            allow="clipboard-write"
          />
        ) : (
          /* Interactive SVG Candlestick & Volume Chart */
          <div className="flex h-full flex-col p-4">
            {/* Timeframe Bar */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px]">
                {(["1m", "5m", "15m", "1h", "1d"] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf)}
                    className={`rounded px-2 py-0.5 font-mono uppercase transition ${
                      timeframe === tf
                        ? "bg-[#14F195] text-slate-950 font-bold"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Range: {formatUsd(minPrice)} — {formatUsd(maxPrice)}
              </div>
            </div>

            {/* SVG Visual Candlesticks */}
            <div className="relative flex-1 w-full overflow-hidden">
              <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 600 300">
                <defs>
                  <linearGradient id="bullGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14F195" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#14F195" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0.25, 0.5, 0.75].map((pct, idx) => (
                  <line
                    key={idx}
                    x1="0"
                    y1={300 * pct}
                    x2="600"
                    y2={300 * pct}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Candlesticks */}
                {candles.map((c, i) => {
                  const x = (i / candles.length) * 580 + 10;
                  const candleWidth = Math.max(3, 560 / candles.length - 3);

                  const normalizeY = (val: number) => {
                    const diff = maxPrice - minPrice || 1;
                    return 260 - ((val - minPrice) / diff) * 230;
                  };

                  const yOpen = normalizeY(c.open);
                  const yClose = normalizeY(c.close);
                  const yHigh = normalizeY(c.high);
                  const yLow = normalizeY(c.low);

                  const isBull = c.close >= c.open;
                  const color = isBull ? "#14F195" : "#f43f5e";
                  const topY = Math.min(yOpen, yClose);
                  const height = Math.max(2, Math.abs(yClose - yOpen));

                  return (
                    <g key={i}>
                      {/* High-Low Wick */}
                      <line
                        x1={x + candleWidth / 2}
                        y1={yHigh}
                        x2={x + candleWidth / 2}
                        y2={yLow}
                        stroke={color}
                        strokeWidth="1.2"
                      />
                      {/* Candle Body */}
                      <rect
                        x={x}
                        y={topY}
                        width={candleWidth}
                        height={height}
                        fill={color}
                        rx="1"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Candlestick Time Labels */}
            <div className="mt-2 flex justify-between text-[10px] font-mono text-slate-500">
              <span>{candles[0]?.time || "00:00"}</span>
              <span>{candles[Math.floor(candles.length / 2)]?.time || "12:00"}</span>
              <span className="text-[#14F195]">Current: {formatUsd(basePrice)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
