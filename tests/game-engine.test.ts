import { test } from "node:test";
import assert from "node:assert/strict";
import {
  advanceSession,
  answerSession,
  compare,
  createSession,
  eligiblePlayers,
  nextPlayer,
  pairKey,
  valueFor,
} from "../src/lib/game-engine";
import { players } from "../src/data/players";
import { MODES, type Difficulty } from "../src/types/game";
import type { Player } from "../src/types/player";
const fixture = (id: string, appearances?: number): Player => ({
  id,
  name: id,
  nationality: "England",
  position: "MID",
  unitedStartYear: 2000,
  unitedEndYear: 2010,
  eras: [],
  sourceIds: [],
  appearances,
});
function random(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
test("higher, lower and equal comparisons", () => {
  assert.equal(compare(10, 20), "higher");
  assert.equal(compare(20, 10), "lower");
  assert.equal(compare(10, 10), "equal");
});
test("invalid/missing stats never enter the pool; zero remains a valid appearance count", () => {
  const pool = [
    fixture("missing"),
    fixture("nan", NaN),
    fixture("negative", -1),
    fixture("inf", Infinity),
    fixture("valid", 0),
  ];
  assert.deepEqual(
    eligiblePlayers("appearances", pool).map((p) => p.id),
    ["valid"],
  );
  assert.equal(valueFor(pool[0], "appearances"), undefined);
  assert.throws(() =>
    createSession("appearances", "normal", Math.random, pool),
  );
});
test("identity and equality remain excluded even when recency has exhausted every alternative", () => {
  const pool = [fixture("a", 10), fixture("b", 10), fixture("c", 11)];
  assert.equal(
    nextPlayer(
      pool[0],
      "appearances",
      "hard",
      ["a", "b", "c"],
      ["a:c"],
      () => 0.5,
      pool,
    ).id,
    "c",
  );
  assert.throws(() =>
    nextPlayer(
      pool[0],
      "appearances",
      "normal",
      [],
      [],
      Math.random,
      pool.slice(0, 2),
    ),
  );
});
test("goals exclude keepers and low-scoring players, transfer pool excludes zero and missing fees", () => {
  assert.ok(
    eligiblePlayers("goals").every(
      (p) => p.position !== "GK" && p.goals! >= 20,
    ),
  );
  assert.ok(
    eligiblePlayers("transfer_fee").every((p) => p.transferFeeMillionGBP! > 0),
  );
});
test("curated dataset has unique ids, traceable references and enough distinct values in every mode", () => {
  assert.ok(players.length >= 60);
  assert.equal(new Set(players.map((p) => p.id)).size, players.length);
  for (const p of players) assert.ok(p.sourceIds.length > 0);
  for (const mode of MODES)
    assert.ok(
      new Set(eligiblePlayers(mode).map((p) => valueFor(p, mode))).size >= 8,
    );
});
test("returning careers use explicit spell sums; no runtime span across absences", () => {
  assert.equal(
    valueFor(
      players.find((p) => p.id === "ronaldo")!,
      "united_years",
    ),
    7,
  );
  assert.equal(
    valueFor(
      players.find((p) => p.id === "pogba")!,
      "united_years",
    ),
    7,
  );
  assert.equal(
    valueFor(
      players.find((p) => p.id === "scholes")!,
      "united_years",
    ),
    18,
  );
});
test("recent first-team additions have dated, traceable official career totals", () => {
  const expected: Record<string, [number, number]> = {
    rashford: [432, 138],
    "bruno-fernandes": [334, 111],
    "luke-shaw": [329, 5],
    maguire: [276, 17],
    casemiro: [160, 26],
    "lisandro-martinez": [115, 4],
    "diogo-dalot": [252, 10],
    "amad-diallo": [97, 16],
    "kobbie-mainoo": [109, 8],
    "mason-mount": [75, 8],
  };
  for (const [id, [appearances, goals]] of Object.entries(expected)) {
    const player = players.find((entry) => entry.id === id);
    assert.ok(player, `${id} is in the player pool`);
    assert.equal(player.appearances, appearances);
    assert.equal(player.goals, goals);
    assert.ok(player.sourceIds.some((sourceId) => sourceId.startsWith("club-")));
  }
});
test("all modes and difficulties sustain long chains without same players, ties or recent pairs", () => {
  for (const mode of MODES)
    for (const difficulty of ["casual", "normal", "hard"] as Difficulty[]) {
      const rng = random(42);
      let s = createSession(mode, difficulty, rng);
      for (let i = 0; i < 250; i++) {
        const lv = valueFor(s.left, mode)!,
          rv = valueFor(s.right, mode)!;
        assert.notEqual(s.left.id, s.right.id);
        assert.notEqual(lv, rv);
        const answered = answerSession(s, rv > lv ? "higher" : "lower");
        assert.equal(answered.streak, i + 1);
        assert.equal(answered.phase, "correct");
        assert.strictEqual(answerSession(answered, "higher"), answered);
        const next = advanceSession(answered, rng);
        assert.equal(next.left.id, s.right.id);
        assert.ok(!s.recentPairs.includes(pairKey(next.left, next.right)));
        assert.ok(!s.recentPlayers.includes(next.right.id));
        s = next;
      }
    }
});
test("wrong answer ends the run without increasing the streak or replacing the failed pair", () => {
  const s = createSession();
  const lv = valueFor(s.left, s.mode)!,
    rv = valueFor(s.right, s.mode)!;
  const lost = answerSession(s, rv > lv ? "lower" : "higher");
  assert.equal(lost.phase, "wrong");
  assert.equal(lost.streak, 0);
  const over = advanceSession(lost);
  assert.equal(over.phase, "over");
  assert.equal(over.right.id, s.right.id);
});
test("hard selects closer values than casual over a deterministic distribution", () => {
  const left = fixture("base", 100),
    pool = [
      left,
      ...Array.from({ length: 30 }, (_, i) => fixture(`p${i}`, 110 + i * 30)),
    ];
  let hard = 0,
    casual = 0;
  const r1 = random(7),
    r2 = random(7);
  for (let i = 0; i < 500; i++) {
    hard +=
      nextPlayer(left, "appearances", "hard", [], [], r1, pool).appearances! -
      100;
    casual +=
      nextPlayer(left, "appearances", "casual", [], [], r2, pool).appearances! -
      100;
  }
  assert.ok(hard < casual * 0.5);
});
