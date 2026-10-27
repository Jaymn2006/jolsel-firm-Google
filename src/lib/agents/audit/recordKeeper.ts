import type { CorporateContext } from "../context";

export interface HeartbeatLog {
  timestamp: number;
  isoTime: string;
  selectedToken: string;
  direction: "LONG" | "SHORT";
  score: number;
  approved: boolean;
  vetoTriggered: boolean;
  reason?: string;
  votesCount: number;
}

export class RecordKeeper {
  private static logs: HeartbeatLog[] = [];

  static logHeartbeat(ctx: CorporateContext): HeartbeatLog {
    const log: HeartbeatLog = {
      timestamp: ctx.timestamp,
      isoTime: new Date(ctx.timestamp).toISOString(),
      selectedToken: ctx.selectedToken?.symbol ?? "SOL",
      direction: ctx.tradeDirection,
      score: ctx.customIndicatorsScore,
      approved: ctx.executionApproved,
      vetoTriggered: ctx.riskVetoTriggered,
      reason: ctx.vetoReason || undefined,
      votesCount: Object.keys(ctx.boardroomVotes).length,
    };
    RecordKeeper.logs.unshift(log);
    if (RecordKeeper.logs.length > 100) {
      RecordKeeper.logs.pop();
    }
    return log;
  }

  static getLogs(): HeartbeatLog[] {
    return [...RecordKeeper.logs];
  }
}
