import { createInitialContext, type CorporateContext } from "./context";
import { Bscoter } from "./discovery/bscoter";
import { Analuszer } from "./discovery/analuszer";
import { CryptoGuru } from "./discovery/cryptoGuru";
import { Forecaster } from "./planning/forecaster";
import { LongTermPlanner } from "./planning/longTermPlanner";
import { ShortTermPlanner } from "./planning/shortTermPlanner";
import { Overthinker } from "./compliance/overthinker";
import { Reviewer } from "./compliance/reviewer";
import { MrGrumpy } from "./compliance/mrGrumpy";
import { RiskManager } from "./compliance/riskManager";
import { Broker } from "./executive/broker";
import { Judge } from "./executive/judge";
import { Verdicter } from "./executive/verdicter";
import { Trader } from "./executive/trader";
import { RecordKeeper } from "./audit/recordKeeper";
import { RecordReviewer } from "./audit/recordReviewer";
import { Teacher } from "./audit/teacher";

export interface PipelineExecutionResult {
  context: CorporateContext;
  verdict: "APPROVED" | "VETOED" | "DENIED";
  summary: string;
  order?: ReturnType<typeof Trader.formatExecutionOrder>;
}

export class TradingFirmEngine {
  private context: CorporateContext;

  constructor(initialBalanceUSDT = 500) {
    this.context = createInitialContext(initialBalanceUSDT);
  }

  getContext(): CorporateContext {
    return { ...this.context };
  }

  setBalance(balanceUSDT: number): void {
    this.context.walletBalanceUSDT = balanceUSDT;
  }

  /**
   * Runs the full 17-agent corporate pipeline on a target token candidate.
   */
  runPipeline(candidate?: any, tokenSecurity?: { freezeAuthority?: string | null }): PipelineExecutionResult {
    this.context.timestamp = Date.now();
    this.context.riskVetoTriggered = false;
    this.context.vetoReason = "";
    this.context.executionApproved = false;
    this.context.boardroomVotes = {};

    // 1. Discovery Phase
    if (candidate) {
      Bscoter.scout(this.context, [candidate]);
    } else {
      Bscoter.scout(this.context);
    }

    const priceChange = candidate?.priceChange?.h24 ?? candidate?.priceChange?.h1 ?? 5;
    const volume = candidate?.volume?.h24 ?? 150000;
    const liquidity = candidate?.liquidity?.usd ?? 65000;

    Analuszer.calculatePrecisionMetrics(this.context, priceChange);
    CryptoGuru.analyzeCrowd(this.context, volume);

    // Hard Gate Check: Custom Indicator score
    if (this.context.customIndicatorsScore >= 75) {
      // 2. Planning Phase
      Forecaster.simulateScenarios(this.context);
      LongTermPlanner.routeAssetClass(this.context);
      ShortTermPlanner.calculatePyramiding(this.context);

      // 3. Compliance Phase
      Overthinker.simulateTailRisk(this.context, liquidity);
      Reviewer.auditContractSafety(this.context, tokenSecurity);
      MrGrumpy.enforceZeroTolerance(this.context);
      RiskManager.verifySurvivalFloor(this.context);

      // 4. Executive Phase
      if (!this.context.riskVetoTriggered) {
        Broker.advocateMomentum(this.context);
        Judge.aggregateVotes(this.context);
        Verdicter.signMandate(this.context);
      } else {
        this.context.boardroomVotes["Verdicter"] = `MANDATE DENIED: Compliance Veto [${this.context.vetoReason}]`;
      }
    } else {
      this.context.riskVetoTriggered = true;
      this.context.vetoReason = `Hard Gate Failed: Indicator score (${this.context.customIndicatorsScore}) < 75`;
      this.context.boardroomVotes["Gate"] = "HARD GATE BLOCKED: Insufficient momentum to trigger planning";
      this.context.boardroomVotes["Verdicter"] = "MANDATE DENIED: Pre-planning gate failure";
    }

    // 5. Audit Phase
    RecordKeeper.logHeartbeat(this.context);
    RecordReviewer.evaluatePerformance();

    let verdict: "APPROVED" | "VETOED" | "DENIED" = "DENIED";
    let summary = "";

    if (this.context.executionApproved) {
      verdict = "APPROVED";
      summary = `Mandate SIGNED for ${this.context.tradeDirection} on ${this.context.selectedToken?.symbol ?? "SOL"} with size $${this.context.targetPositionSizeUSDT.toFixed(2)}`;
    } else if (this.context.riskVetoTriggered) {
      verdict = "VETOED";
      summary = `Compliance Veto: ${this.context.vetoReason}`;
    } else {
      verdict = "DENIED";
      summary = `Executive Quorum not reached`;
    }

    const order = this.context.executionApproved ? Trader.formatExecutionOrder(this.context) : undefined;

    return {
      context: { ...this.context },
      verdict,
      summary,
      order,
    };
  }
}
