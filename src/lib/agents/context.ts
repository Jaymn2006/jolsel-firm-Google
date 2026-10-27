export type AssetClass = "MEME_COIN" | "TOKENIZED_STOCK" | "PERPETUAL";
export type TradeDirection = "LONG" | "SHORT";

export interface ReversalProtectionPlan {
  trailingStopLossPercent: number;
  partialExitTrigger: string;
  takeProfitPercent: number;
}

export interface CorporateContext {
  timestamp: number;
  walletBalanceUSDT: number;
  activeAssetClass: AssetClass;
  scoutedTokens: any[];
  selectedToken: any | null;
  customIndicatorsScore: number;
  socialSentimentScore: number;
  isWorthIt: boolean;
  tradeDirection: TradeDirection;
  reversalProtectionPlan: ReversalProtectionPlan | null;
  riskVetoTriggered: boolean;
  vetoReason: string;
  targetPositionSizeUSDT: number;
  slippageMax: number;
  boardroomVotes: Record<string, string>;
  executionApproved: boolean;
}

export function createInitialContext(initialBalanceUSDT = 500): CorporateContext {
  return {
    timestamp: Date.now(),
    walletBalanceUSDT: initialBalanceUSDT,
    activeAssetClass: "MEME_COIN",
    scoutedTokens: [],
    selectedToken: null,
    customIndicatorsScore: 0,
    socialSentimentScore: 0,
    isWorthIt: false,
    tradeDirection: "LONG",
    reversalProtectionPlan: null,
    riskVetoTriggered: false,
    vetoReason: "",
    targetPositionSizeUSDT: 0,
    slippageMax: 1.5,
    boardroomVotes: {},
    executionApproved: false,
  };
}
