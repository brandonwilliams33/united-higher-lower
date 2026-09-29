import { MODES, type Mode, type Records, type Session } from "@/types/game";
export const STORAGE_KEY = "united-higher-lower:v1";
export const emptyRecords = (): Records => ({
  version: 1,
  best: { appearances: 0, goals: 0, transfer_fee: 0, united_years: 0 },
  totalGames: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  preferredMode: "appearances",
  sound: false,
});
const count = (v: unknown) =>
  typeof v === "number" && Number.isSafeInteger(v) && v >= 0 ? v : 0;
export function parseRecords(raw: string | null): Records {
  const base = emptyRecords();
  try {
    const data = JSON.parse(raw || "null");
    if (!data || data.version !== 1) return base;
    base.totalGames = count(data.totalGames);
    base.totalAnswers = count(data.totalAnswers);
    base.correctAnswers = Math.min(
      count(data.correctAnswers),
      base.totalAnswers,
    );
    for (const mode of MODES) base.best[mode] = count(data.best?.[mode]);
    if (MODES.includes(data.preferredMode))
      base.preferredMode = data.preferredMode as Mode;
    base.sound = data.sound === true;
    return base;
  } catch {
    return base;
  }
}
export function readRecords(): Records {
  try {
    return parseRecords(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return emptyRecords();
  }
}
export function saveRecords(records: Records): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch {
    return false;
  }
}
/** A game is counted on its first answer, including games later abandoned. */
export function recordAnswer(records: Records, answered: Session): Records {
  const correct = answered.answers.at(-1) === true;
  return {
    ...records,
    totalGames: records.totalGames + Number(answered.answers.length === 1),
    totalAnswers: records.totalAnswers + 1,
    correctAnswers: records.correctAnswers + Number(correct),
    best: {
      ...records.best,
      [answered.mode]: Math.max(records.best[answered.mode], answered.streak),
    },
  };
}
