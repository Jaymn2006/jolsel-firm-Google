import type { CorporateContext } from "../context";

export class Judge {
  static aggregateVotes(ctx: CorporateContext): { yesCount: number; totalVotes: number; quorumReached: boolean } {
    const votes = Object.values(ctx.boardroomVotes);
    const yesCount = votes.filter((v) => /APPROVE|YES/i.test(v)).length;
    const totalVotes = votes.length;
    const quorumReached = totalVotes >= 3 && yesCount / totalVotes >= 0.6;
    ctx.boardroomVotes["Judge"] = quorumReached
      ? `APPROVED: Quorum achieved with ${yesCount}/${totalVotes} affirmative votes`
      : `REJECTED: Quorum failed (${yesCount}/${totalVotes} affirmative votes)`;
    return { yesCount, totalVotes, quorumReached };
  }
}
