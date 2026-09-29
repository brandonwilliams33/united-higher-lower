import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyRecords,
  parseRecords,
  readRecords,
  recordAnswer,
  saveRecords,
} from "../src/lib/storage";
import { answerSession, createSession, valueFor } from "../src/lib/game-engine";
import { accuracy, formatValue, shareText } from "../src/lib/format";
test("corrupt, old and hostile local storage values are handled safely", () => {
  assert.deepEqual(parseRecords("{"), emptyRecords());
  assert.deepEqual(parseRecords('{"version":2}'), emptyRecords());
  const result = parseRecords(
    JSON.stringify({
      version: 1,
      totalGames: -1,
      totalAnswers: 4,
      correctAnswers: 99,
      best: { goals: "900" },
      preferredMode: "invalid",
      sound: "yes",
    }),
  );
  assert.equal(result.totalGames, 0);
  assert.equal(result.correctAnswers, 4);
  assert.equal(result.best.goals, 0);
  assert.equal(result.preferredMode, "appearances");
  assert.equal(result.sound, false);
});
test("storage unavailability cannot crash gameplay", () => {
  assert.deepEqual(readRecords(), emptyRecords());
  assert.equal(saveRecords(emptyRecords()), false);
});
test("roundtrip preserves all preferences and per-mode records", () => {
  const r = {
    ...emptyRecords(),
    sound: true,
    preferredMode: "goals" as const,
    best: { appearances: 1, goals: 8, transfer_fee: 3, united_years: 9 },
  };
  assert.deepEqual(parseRecords(JSON.stringify(r)), r);
});
test("first answer counts one game and updates per-mode best immediately", () => {
  const s = createSession("goals");
  const good = answerSession(
    s,
    valueFor(s.right, "goals")! > valueFor(s.left, "goals")!
      ? "higher"
      : "lower",
  );
  const r = recordAnswer(emptyRecords(), good);
  assert.equal(r.totalGames, 1);
  assert.equal(r.totalAnswers, 1);
  assert.equal(r.correctAnswers, 1);
  assert.equal(r.best.goals, 1);
  assert.equal(r.best.appearances, 0);
});
test("formatting keeps fee precision, career units, empty accuracy and bounded share grid", () => {
  assert.equal(formatValue(30.75, "transfer_fee"), "£30.75m");
  assert.equal(formatValue(13, "united_years"), "13 years");
  assert.equal(accuracy(0, 0), "—");
  const share = shareText(12, "goals", "normal");
  assert.ok(share.includes("12 STREAK"));
  assert.equal((share.match(/🟩/gu) || []).length, 12);
  assert.equal((share.match(/🟥/gu) || []).length, 1);
  assert.ok(shareText(10000, "goals", "hard").length < 1000);
});
test("throwing browser storage getters and quota failures are safely caught", () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  try {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        get localStorage() {
          throw new Error("blocked");
        },
      },
    });
    assert.deepEqual(readRecords(), emptyRecords());
    assert.equal(saveRecords(emptyRecords()), false);
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        localStorage: {
          getItem() {
            return "{";
          },
          setItem() {
            throw new Error("quota");
          },
        },
      },
    });
    assert.deepEqual(readRecords(), emptyRecords());
    assert.equal(saveRecords(emptyRecords()), false);
  } finally {
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
