import { RecordKeeper } from "./recordKeeper";

export class RecordReviewer {
  static evaluatePerformance(): { totalRuns: number; approvalRate: number; vetoRate: number; healthGrade: string } {
    const logs = RecordKeeper.getLogs();
    if (logs.length === 0) {
      return { totalRuns: 0, approvalRate: 0, vetoRate: 0, healthGrade: "A+" };
    }
    const approved = logs.filter((l) => l.approved).length;
    const vetoed = logs.filter((l) => l.vetoTriggered).length;
    const approvalRate = Math.round((approved / logs.length) * 100);
    const vetoRate = Math.round((vetoed / logs.length) * 100);
    const healthGrade = vetoRate > 80 ? "B" : vetoRate > 50 ? "A-" : "A+";
    return { totalRuns: logs.length, approvalRate, vetoRate, healthGrade };
  }
}
