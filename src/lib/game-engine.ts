import { players } from "@/data/players";
import type { Player } from "@/types/player";
import type { Difficulty, Guess, Mode, Session } from "@/types/game";
type Rng = () => number;
export function valueFor(player: Player, mode: Mode): number | undefined {
  const value =
    mode === "transfer_fee"
      ? player.transferFeeMillionGBP
      : mode === "united_years"
        ? player.unitedYears
        : player[mode];
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : undefined;
}
export function eligiblePlayers(
  mode: Mode,
  pool: Player[] = players,
): Player[] {
  return pool.filter((p) => {
    const v = valueFor(p, mode);
    return (
      v !== undefined &&
      (mode !== "goals" || (p.position !== "GK" && v >= 20)) &&
      (mode !== "transfer_fee" || v > 0)
    );
  });
}
export function compare(left: number, right: number): Guess | "equal" {
  return right === left ? "equal" : right > left ? "higher" : "lower";
}
export const pairKey = (a: Player, b: Player) => [a.id, b.id].sort().join(":");
const pick = <T>(items: T[], rng: Rng): T =>
  items[
    Math.min(items.length - 1, Math.max(0, Math.floor(rng() * items.length)))
  ];
export function nextPlayer(
  left: Player,
  mode: Mode,
  difficulty: Difficulty,
  recentPlayers: string[] = [],
  recentPairs: string[] = [],
  rng: Rng = Math.random,
  pool: Player[] = players,
): Player {
  const lv = valueFor(left, mode);
  if (lv === undefined) throw new Error("Left player has no valid statistic.");
  const valid = eligiblePlayers(mode, pool).filter(
    (p) => p.id !== left.id && valueFor(p, mode) !== lv,
  );
  if (!valid.length)
    throw new Error("This mode needs two players with different values.");
  // Relax player recency first, then pair recency; never relax identity or equality.
  const unpaired = valid.filter((p) => !recentPairs.includes(pairKey(left, p)));
  const fresh = unpaired.filter((p) => !recentPlayers.includes(p.id));
  let candidates = fresh.length ? fresh : unpaired.length ? unpaired : valid;
  const ratio = (p: Player) =>
    Math.abs(valueFor(p, mode)! - lv) / Math.max(valueFor(p, mode)!, lv, 1);
  candidates = [...candidates].sort((a, b) => ratio(a) - ratio(b));
  if (difficulty === "hard")
    candidates = candidates.slice(
      0,
      Math.max(2, Math.ceil(candidates.length * 0.25)),
    );
  if (difficulty === "normal")
    candidates = candidates.slice(
      0,
      Math.max(3, Math.ceil(candidates.length * 0.7)),
    );
  return pick(candidates, rng);
}
export function createSession(
  mode: Mode = "appearances",
  difficulty: Difficulty = "normal",
  rng: Rng = Math.random,
  pool: Player[] = players,
): Session {
  const eligible = eligiblePlayers(mode, pool);
  if (new Set(eligible.map((p) => valueFor(p, mode))).size < 2)
    throw new Error("Not enough distinct statistics for this mode.");
  const left = pick(eligible, rng);
  const right = nextPlayer(left, mode, difficulty, [left.id], [], rng, pool);
  return {
    mode,
    difficulty,
    left,
    right,
    recentPlayers: [left.id, right.id],
    recentPairs: [pairKey(left, right)],
    streak: 0,
    answers: [],
    phase: "playing",
  };
}
export function answerSession(session: Session, guess: Guess): Session {
  if (session.phase !== "playing") return session;
  const lv = valueFor(session.left, session.mode),
    rv = valueFor(session.right, session.mode);
  if (lv === undefined || rv === undefined || lv === rv)
    throw new Error("Invalid question.");
  const correct = compare(lv, rv) === guess;
  return {
    ...session,
    streak: session.streak + Number(correct),
    answers: [...session.answers, correct],
    phase: correct ? "correct" : "wrong",
  };
}
export function advanceSession(
  session: Session,
  rng: Rng = Math.random,
): Session {
  if (session.phase === "wrong") return { ...session, phase: "over" };
  if (session.phase !== "correct") return session;
  const left = session.right;
  const right = nextPlayer(
    left,
    session.mode,
    session.difficulty,
    session.recentPlayers,
    session.recentPairs,
    rng,
  );
  return {
    ...session,
    left,
    right,
    phase: "playing",
    recentPlayers: [...session.recentPlayers, right.id].slice(-7),
    recentPairs: [...session.recentPairs, pairKey(left, right)].slice(-20),
  };
}
