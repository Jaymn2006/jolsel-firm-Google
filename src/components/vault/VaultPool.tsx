import React, { useState, useMemo } from "react";
import {
  type VaultAsset,
  type BotTradingSettings,
  type BotExecutedTrade,
  loadVaultAssets,
  saveVaultAssets,
  loadBotSettings,
  saveBotSettings,
} from "../../lib/safeDeposit";
import { formatUsd } from "../../lib/dexscreener";
import {
  Shield,
  QrCode,
  Copy,
  Check,
  Bot,
  Sliders,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  RefreshCw,
  Wallet,
  Zap,
  Lock,
} from "lucide-react";

interface VaultPoolProps {
  onNavigateToCore: () => void;
}

export function VaultPool({ onNavigateToCore }: VaultPoolProps) {
  const [assets, setAssets] = useState<VaultAsset[]>(loadVaultAssets);
  const [settings, setSettings] = useState<BotTradingSettings>(loadBotSettings);
  const [selectedAsset, setSelectedAsset] = useState<VaultAsset>(assets[0]);
  const [copied, setCopied] = useState(false);
  const [depositAmount, setDepositAmount] = useState("1.0");
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);

  const [executedTrades, setExecutedTrades] = useState<BotExecutedTrade[]>([
    {
      id: "bot-tx-1",
      timestamp: Date.now() - 1000 * 60 * 12,
      asset: "BONK",
      type: "BUY",
      amount: 4500000,
      costUsd: 96.3,
      reason: "Calculus Kelly Signal f* = 14.2% · Bayesian p = 82%",
      txSig: "4rB9k1a...98mQ",
    },
    {
      id: "bot-tx-2",
      timestamp: Date.now() - 1000 * 60 * 48,
      asset: "POPCAT",
      type: "SELL",
      amount: 85,
      costUsd: 113.9,
      pnlUsd: 28.4,
      reason: "Take-Profit Target Hit (+25% momentum stall)",
      txSig: "5xL2m9c...44kP",
    },
    {
      id: "bot-tx-3",
      timestamp: Date.now() - 1000 * 60 * 110,
      asset: "WIF",
      type: "BUY",
      amount: 42.0,
      costUsd: 104.16,
      reason: "Ornstein-Uhlenbeck Mean-Reversion Dip Buy",
      txSig: "3zP8w2q...12xV",
    },
  ]);

  // Total vault valuation
  const totalVaultValueUsd = useMemo(() => {
    return assets.reduce((sum, a) => sum + a.balance * a.priceUsd, 0);
  }, [assets]);

  // Copy deposit address
  const copyAddress = () => {
    navigator.clipboard.writeText(selectedAsset.depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Perform deposit
  const handleDeposit = () => {
    const val = parseFloat(depositAmount);
    if (isNaN(val) || val <= 0) return;

    const updated = assets.map((a) =>
      a.symbol === selectedAsset.symbol
        ? { ...a, balance: a.balance + val }
        : a
    );
    setAssets(updated);
    saveVaultAssets(updated);
    setSelectedAsset((prev) => ({ ...prev, balance: prev.balance + val }));
    setDepositSuccessMsg(`Successfully deposited ${val} ${selectedAsset.symbol} into Safe Vault Pool!`);
    setDepositModalOpen(false);

    setTimeout(() => setDepositSuccessMsg(null), 4000);
  };

  // Update bot settings
  const updateSettings = (partial: Partial<BotTradingSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    saveBotSettings(next);
  };

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-[#14F195]" />
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Safe Deposit Vault Pool
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Deposit SOL, USDC, USDT, BTC, or ETH. Dedicated Safe Deposit Addresses with Autonomous Trading Bot Execution.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToCore}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#14F195] to-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-[#14F195]/20 hover:opacity-90 transition"
        >
          <Bot className="h-4 w-4" />
          <span>View Agents in War Room →</span>
        </button>
      </div>

      {depositSuccessMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-300">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{depositSuccessMsg}</span>
        </div>
      )}

      {/* Top Total Pool Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Total Vault Pool Valuation
          </div>
          <div className="mt-2 font-mono text-3xl font-extrabold text-white">
            {formatUsd(totalVaultValueUsd)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>5 Crypto Assets Supported</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Bot Trading Status
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${
                settings.autoTradingEnabled ? "bg-[#14F195] animate-ping" : "bg-slate-500"
              }`}
            />
            <span className="font-mono text-2xl font-bold text-white">
              {settings.autoTradingEnabled ? "Active & Trading" : "Paused"}
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Allocated: {settings.allocatedCapitalPct}% of vault ($
            {((totalVaultValueUsd * settings.allocatedCapitalPct) / 100).toFixed(2)})
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Safe Deposit Security
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#14F195] flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <span>Program Custody</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Withdrawal requires depositor signature. Zero admin drain.
          </div>
        </div>
      </div>

      {/* Main Grid: Safe Deposit Card (Left 5 cols) + Holdings & Bot Config (Right 7 cols) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Safe Deposit Address Generator (5 cols) */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Safe Deposit Address
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Verified Solana Safe
            </span>
          </div>

          {/* Asset Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400">
              Select Deposit Crypto:
            </label>
            <div className="mt-2 grid grid-cols-5 gap-1.5">
              {assets.map((a) => (
                <button
                  key={a.symbol}
                  type="button"
                  onClick={() => setSelectedAsset(a)}
                  className={`flex flex-col items-center rounded-xl border p-2 text-center transition ${
                    selectedAsset.symbol === a.symbol
                      ? "border-[#14F195] bg-[#14F195]/10 text-white shadow-sm"
                      : "border-white/10 bg-slate-950/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="font-mono text-xs font-extrabold">{a.symbol}</span>
                  <span className="text-[9px] text-slate-500">{formatUsd(a.priceUsd)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* QR Code Graphic & Deposit Box */}
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-5 text-center flex flex-col items-center">
            {/* SVG Visual QR Code */}
            <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-white p-2 shadow-inner">
              <svg className="h-full w-full" viewBox="0 0 100 100" fill="black">
                {/* QR Code pattern markers */}
                <rect x="5" y="5" width="25" height="25" fill="#000" rx="3" />
                <rect x="8" y="8" width="19" height="19" fill="#fff" rx="2" />
                <rect x="12" y="12" width="11" height="11" fill="#000" />

                <rect x="70" y="5" width="25" height="25" fill="#000" rx="3" />
                <rect x="73" y="8" width="19" height="19" fill="#fff" rx="2" />
                <rect x="77" y="12" width="11" height="11" fill="#000" />

                <rect x="5" y="70" width="25" height="25" fill="#000" rx="3" />
                <rect x="8" y="73" width="19" height="19" fill="#fff" rx="2" />
                <rect x="12" y="77" width="11" height="11" fill="#000" />

                {/* Random QR data blocks */}
                <rect x="36" y="8" width="8" height="8" fill="#000" />
                <rect x="48" y="12" width="6" height="10" fill="#000" />
                <rect x="36" y="22" width="10" height="6" fill="#000" />
                <rect x="10" y="36" width="12" height="6" fill="#000" />
                <rect x="26" y="36" width="6" height="12" fill="#000" />
                <rect x="36" y="36" width="28" height="28" fill="#000" rx="2" />
                <rect x="42" y="42" width="16" height="16" fill="#fff" rx="1" />
                <rect x="46" y="46" width="8" height="8" fill="#14F195" />
                <rect x="70" y="36" width="12" height="8" fill="#000" />
                <rect x="86" y="40" width="8" height="16" fill="#000" />
                <rect x="36" y="70" width="10" height="8" fill="#000" />
                <rect x="52" y="72" width="8" height="14" fill="#000" />
                <rect x="66" y="70" width="14" height="6" fill="#000" />
                <rect x="72" y="82" width="18" height="8" fill="#000" />
              </svg>
            </div>

            <span className="mt-3 text-xs font-semibold text-slate-300">
              Your {selectedAsset.name} Deposit Address
            </span>

            {/* Address Field with Copy */}
            <div className="mt-2 flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-900 px-3 py-2">
              <span className="font-mono text-xs text-slate-200 truncate">
                {selectedAsset.depositAddress}
              </span>
              <button
                type="button"
                onClick={copyAddress}
                className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] font-semibold text-white hover:bg-white/15 transition shrink-0"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              Only send {selectedAsset.symbol} on the Solana network to this address. Funds credit
              instantly into your vault trading slot.
            </p>

            {/* Deposit Action Trigger */}
            <button
              type="button"
              onClick={() => setDepositModalOpen(true)}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#14F195] to-emerald-400 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-[#14F195]/20 hover:opacity-90 transition"
            >
              Deposit / Credit {selectedAsset.symbol} to Vault
            </button>
          </div>
        </div>

        {/* Right Column: Holdings Breakdown & Bot Trading Strategy (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Holdings Breakdown */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Your Vault Holdings ({assets.length} Assets)
              </span>
              <span className="font-mono text-xs font-bold text-[#14F195]">
                {formatUsd(totalVaultValueUsd)} Total
              </span>
            </div>

            <div className="space-y-2.5">
              {assets.map((asset) => {
                const valUsd = asset.balance * asset.priceUsd;
                const pct = totalVaultValueUsd > 0 ? (valUsd / totalVaultValueUsd) * 100 : 0;

                return (
                  <div
                    key={asset.symbol}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/60 p-3 hover:border-white/10 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${asset.iconColor} text-slate-950 font-extrabold text-xs shadow-sm`}>
                        {asset.symbol}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{asset.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {asset.balance} {asset.symbol} @ {formatUsd(asset.priceUsd)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-white">
                        {formatUsd(valUsd)}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500">
                        {pct.toFixed(1)}% of pool
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Autonomous Bot Trading Strategy Settings */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-violet-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Autonomous Bot Trading Parameters
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ autoTradingEnabled: !settings.autoTradingEnabled })}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                  settings.autoTradingEnabled
                    ? "bg-[#14F195] text-slate-950 shadow-sm"
                    : "border border-white/15 bg-white/5 text-slate-400"
                }`}
              >
                {settings.autoTradingEnabled ? "Auto-Trading ACTIVE" : "Auto-Trading PAUSED"}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <label className="text-slate-400 text-[11px]">Strategy Profile:</label>
                <select
                  value={settings.strategy}
                  onChange={(e) => updateSettings({ strategy: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-[#14F195]/50"
                >
                  <option value="BALANCED_HYBRID">Balanced Hybrid (Meme + Copytrade)</option>
                  <option value="SPOT_MEMECOINS">Spot Solana Memecoins High-Beta</option>
                  <option value="BLUECHIP_STABLES">Bluechip & Stables Yield</option>
                  <option value="COPYTRADE_WHALES">FOMO Whale Tracker Mirror</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-[11px]">Allocated Capital (% of Vault):</label>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={settings.allocatedCapitalPct}
                  onChange={(e) => updateSettings({ allocatedCapitalPct: Number(e.target.value) })}
                  className="mt-2 w-full accent-[#14F195]"
                />
                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                  <span>Conservative (10%)</span>
                  <span className="font-bold text-[#14F195]">{settings.allocatedCapitalPct}%</span>
                  <span>Aggressive (90%)</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-[11px]">Take-Profit Target:</label>
                <input
                  type="number"
                  value={settings.takeProfitPct}
                  onChange={(e) => updateSettings({ takeProfitPct: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 font-mono text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[11px]">Trailing Stop-Loss Floor:</label>
                <input
                  type="number"
                  value={settings.stopLossPct}
                  onChange={(e) => updateSettings({ stopLossPct: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 font-mono text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bot Executed Trades Ledger */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Recent Bot Fills for Your Vault
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Real-time ledger</span>
            </div>

            <div className="space-y-2">
              {executedTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/60 p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-lg px-2 py-1 font-mono text-[10px] font-extrabold ${
                        trade.type === "BUY"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {trade.type}
                    </span>
                    <div>
                      <div className="font-bold text-white">{trade.asset}</div>
                      <div className="text-[10px] text-slate-400">{trade.reason}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-white">
                      {trade.pnlUsd ? `+$${trade.pnlUsd.toFixed(2)} PnL` : `$${trade.costUsd.toFixed(2)}`}
                    </div>
                    <div className="font-mono text-[9px] text-[#14F195]">
                      {trade.txSig}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Credit {selectedAsset.name} into Vault
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Simulate or execute an on-chain deposit into the Jolsel Firm vault program account.
            </p>

            <div className="mt-4">
              <label className="text-[11px] text-slate-400">
                Amount ({selectedAsset.symbol}):
              </label>
              <input
                type="number"
                step="any"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#14F195]/50"
              />
              <div className="mt-2 flex gap-1.5 text-xs">
                {["0.5", "1.0", "5.0", "10.0"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDepositAmount(preset)}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1 text-slate-300 hover:bg-white/10 font-mono text-[11px]"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setDepositModalOpen(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeposit}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#14F195] to-emerald-400 py-2 text-xs font-bold text-slate-950 hover:opacity-90"
              >
                Confirm Deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
