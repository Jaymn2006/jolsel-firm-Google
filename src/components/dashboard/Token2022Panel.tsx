import React, { useMemo } from "react";
import { inspectToken2022Mock, type Token2022Info } from "../../lib/token2022";
import { ShieldCheck, AlertTriangle, Lock, Key, Percent } from "lucide-react";

interface Token2022PanelProps {
  mint: string | undefined;
  symbol: string;
}

export function Token2022Panel({ mint, symbol }: Token2022PanelProps) {
  const info: Token2022Info | null = useMemo(() => {
    if (!mint) return null;
    return inspectToken2022Mock(mint);
  }, [mint]);

  if (!mint || !info) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-xs">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <ShieldCheck className="h-4 w-4 text-[#14F195]" />
          <span>Security & Token-2022 Audit</span>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            info.program === "token-2022"
              ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}
        >
          {info.program === "token-2022" ? "Token-2022 Standard" : "Classic SPL Token"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
        <div>
          <span>Decimals: </span>
          <span className="font-mono font-semibold text-white">{info.decimals}</span>
        </div>
        <div>
          <span>Total Supply: </span>
          <span className="font-mono text-slate-200">{info.supply}</span>
        </div>
        <div className="flex items-center gap-1">
          <Key className="h-3 w-3 text-amber-400" />
          <span>Mint Authority: </span>
          <span className="font-mono text-slate-200">
            {info.mintAuthority ? "Active" : "Revoked (Safe)"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Lock className="h-3 w-3 text-amber-400" />
          <span>Freeze Authority: </span>
          <span className={`font-mono font-semibold ${info.freezeAuthority ? "text-rose-400" : "text-emerald-400"}`}>
            {info.freezeAuthority ? "Active (Risk)" : "Revoked (Safe)"}
          </span>
        </div>
      </div>

      {info.transferFee && (
        <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-[11px] text-amber-200">
          <Percent className="h-4 w-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Transfer Fee Extension: </span>
            <span>{info.transferFee.transferFeeBasisPoints / 100}% on every swap.</span>
          </div>
        </div>
      )}

      {info.warnings.length > 0 && (
        <div className="mt-2 space-y-1">
          {info.warnings.map((w, idx) => (
            <div
              key={idx}
              className="flex items-start gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-[10px] text-rose-300"
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-400 mt-0.5" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
