export type TokenProgramKind = "spl-token" | "token-2022" | "unknown";

export type TransferFeeInfo = {
  transferFeeBasisPoints: number;
  maximumFee: string;
};

export type Token2022Info = {
  mint: string;
  program: TokenProgramKind;
  decimals: number;
  supply: string;
  mintAuthority: string | null;
  freezeAuthority: string | null;
  extensionLabels: string[];
  transferFee: TransferFeeInfo | null;
  permanentDelegate: string | null;
  nonTransferable: boolean;
  transferHookProgramId: string | null;
  interestBearing: { rate: number } | null;
  warnings: string[];
};

export function inspectToken2022Mock(mint: string): Token2022Info {
  // Deterministic inspection based on mint signature
  const is2022 = mint.includes("2022") || mint.startsWith("7") || mint.includes("pump");
  const hasFee = mint.includes("fee") || (mint.charCodeAt(0) % 5 === 0);
  const hasFreeze = mint.charCodeAt(1) % 4 === 0;

  const warnings: string[] = [];
  const extensionLabels: string[] = [];

  if (is2022) {
    extensionLabels.push("Token-2022 Standard");
  }

  if (hasFee) {
    extensionLabels.push("Transfer Fee (1.0%)");
    warnings.push("1.00% Transfer fee enabled on all transactions");
  }

  if (hasFreeze) {
    warnings.push("Active freeze authority: Issuer can freeze token balances");
  }

  return {
    mint,
    program: is2022 ? "token-2022" : "spl-token",
    decimals: 6,
    supply: "1,000,000,000",
    mintAuthority: hasFreeze ? "Auth...8x92" : null,
    freezeAuthority: hasFreeze ? "Auth...8x92" : null,
    extensionLabels,
    transferFee: hasFee ? { transferFeeBasisPoints: 100, maximumFee: "500000" } : null,
    permanentDelegate: null,
    nonTransferable: false,
    transferHookProgramId: null,
    interestBearing: null,
    warnings,
  };
}
