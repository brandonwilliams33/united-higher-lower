import type { Mode } from "@/types/game";
export const modeDetails: Record<
  Mode,
  { label: string; unit: string; description: string }
> = {
  appearances: {
    label: "Appearances",
    unit: "United appearances",
    description: "First-team competitive matches, all competitions.",
  },
  goals: {
    label: "Goals",
    unit: "United goals",
    description: "First-team competitive goals, all competitions.",
  },
  transfer_fee: {
    label: "Transfer fee",
    unit: "reported transfer fee",
    description: "Reported arrival fee in GBP. No inflation adjustment.",
  },
  united_years: {
    label: "United years",
    unit: "approx. United years",
    description:
      "Sum of end year − start year for each senior spell. Not seasons.",
  },
};
export function formatValue(value: number, mode: Mode): string {
  if (mode === "transfer_fee") return `£${Number(value.toFixed(2))}m`;
  if (mode === "united_years")
    return `${value} ${value === 1 ? "year" : "years"}`;
  return value.toLocaleString("en-GB");
}
export function accuracy(correct: number, total: number): string {
  return total ? `${Math.round((correct / total) * 1000) / 10}%` : "—";
}
export function shareText(
  streak: number,
  mode: Mode,
  difficulty: string,
): string {
  const marks = [...Array(Math.min(streak, 100)).fill("🟩"), "🟥"];
  const grid = marks
    .reduce<string[]>((lines, mark, i) => {
      const row = Math.floor(i / 5);
      lines[row] = (lines[row] || "") + mark;
      return lines;
    }, [])
    .join("\n");
  return `UNITED — HIGHER / LOWER\n\n🔥 ${streak} STREAK\n⚽ ${modeDetails[mode].label.toUpperCase()} MODE · ${difficulty.toUpperCase()}\n\n${grid}${streak > 100 ? "\n(Grid shows the last 100 correct answers.)" : ""}\n\nCan you beat me?`;
}
