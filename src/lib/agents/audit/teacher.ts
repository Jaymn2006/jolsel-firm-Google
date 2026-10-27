export interface AuditLesson {
  topic: string;
  rule: string;
  reinforcement: string;
}

export class Teacher {
  private static lessons: AuditLesson[] = [
    {
      topic: "Capital Preservation",
      rule: "Never exceed 25% single-asset exposure on high-volatility Solana tokens.",
      reinforcement: "Survival floor always takes precedence over projected upside.",
    },
    {
      topic: "Zero-Tolerance Hard Gate",
      rule: "Custom indicator score must maintain ≥75 threshold before execution.",
      reinforcement: "Low-conviction trades degrade long-term equity compound rate.",
    },
    {
      topic: "Contract Security & Mint Auditing",
      rule: "Active freeze authority or hidden transfer tax is an immediate veto trigger.",
      reinforcement: "Unchecked SPL authorities lead to irreversible liquidity lockup.",
    },
    {
      topic: "Reversal & Stop-Loss Discipline",
      rule: "Always initialize dynamic trailing stops before executing swap transactions.",
      reinforcement: "Protecting unrealized gains turns momentum into realized treasury growth.",
    },
  ];

  static getRandomLesson(): AuditLesson {
    const idx = Math.floor(Math.random() * Teacher.lessons.length);
    return Teacher.lessons[idx];
  }

  static getAllLessons(): AuditLesson[] {
    return [...Teacher.lessons];
  }
}
