import type { Player } from "./player";
export const MODES = [
  "appearances",
  "goals",
  "transfer_fee",
  "united_years",
] as const;
export type Mode = (typeof MODES)[number];
export type Difficulty = "casual" | "normal" | "hard";
export type Guess = "higher" | "lower";
export type Phase = "playing" | "correct" | "wrong" | "over";
export interface Session {
  mode: Mode;
  difficulty: Difficulty;
  left: Player;
  right: Player;
  recentPlayers: string[];
  recentPairs: string[];
  streak: number;
  answers: boolean[];
  phase: Phase;
}
export interface Records {
  version: 1;
  best: Record<Mode, number>;
  totalGames: number;
  correctAnswers: number;
  totalAnswers: number;
  preferredMode: Mode;
  sound: boolean;
}
