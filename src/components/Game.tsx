"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Difficulty, Guess, Mode, Records, Session } from "@/types/game";
import {
  advanceSession,
  answerSession,
  createSession,
  valueFor,
} from "@/lib/game-engine";
import {
  emptyRecords,
  readRecords,
  recordAnswer,
  saveRecords,
} from "@/lib/storage";
import { formatValue, modeDetails } from "@/lib/format";
import { ModeSelector } from "./ModeSelector";
import { PlayerPanel } from "./PlayerPanel";
import { GameControls } from "./GameControls";
import { ScoreHeader } from "./ScoreHeader";
import { GameOver } from "./GameOver";
const difficulties: Difficulty[] = ["casual", "normal", "hard"];
export function Game({ initialSession }: { initialSession: Session }) {
  const [session, setSession] = useState(initialSession);
  const [records, setRecords] = useState<Records>(emptyRecords);
  const [ready, setReady] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);
  const root = useRef<HTMLElement>(null);
  const locked = useRef(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = readRecords();
      setRecords(saved);
      setSession(createSession(saved.preferredMode));
      setHasAnswered(saved.totalAnswers > 0);
      setReady(true);
      root.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const persist = useCallback((next: Records) => {
    setRecords(next);
    setStorageOk(saveRecords(next));
  }, []);
  const guess = useCallback(
    (choice: Guess) => {
      if (!ready || locked.current || session.phase !== "playing") return;
      root.current?.focus({ preventScroll: true });
      locked.current = true;
      const next = answerSession(session, choice);
      setSession(next);
      setHasAnswered(true);
      persist(recordAnswer(records, next));
      if (records.sound) {
        audio.current?.pause();
        audio.current = new Audio(
          next.phase === "correct"
            ? "/sounds/correct.wav"
            : "/sounds/wrong.wav",
        );
        audio.current.volume = 0.22;
        void audio.current.play().catch(() => {});
      }
    },
    [ready, session, records, persist],
  );
  useEffect(() => {
    if (session.phase !== "correct" && session.phase !== "wrong") return;
    const timer = window.setTimeout(() => {
      setSession((s) => advanceSession(s));
      locked.current = false;
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [session.phase]);
  useEffect(
    () => () => {
      audio.current?.pause();
    },
    [],
  );
  function restart(
    mode = session.mode,
    difficulty = session.difficulty,
    focusGame = false,
  ) {
    locked.current = false;
    setSession(createSession(mode, difficulty));
    if (focusGame) root.current?.focus({ preventScroll: true });
    if (mode !== records.preferredMode)
      persist({ ...records, preferredMode: mode });
  }
  function keydown(event: React.KeyboardEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.repeat ||
      target.closest(
        "input, textarea, select, a, [contenteditable=true], [data-no-shortcuts]",
      )
    )
      return;
    const key = event.key.toLowerCase();
    if (
      session.phase === "playing" &&
      ["arrowup", "arrowdown", "h", "l"].includes(key)
    ) {
      event.preventDefault();
      guess(key === "arrowup" || key === "h" ? "higher" : "lower");
    }
    if (
      key === "enter" &&
      session.phase === "over" &&
      !target.closest("button, summary")
    ) {
      event.preventDefault();
      restart(session.mode, session.difficulty, true);
    }
  }
  const revealed = session.phase !== "playing";
  const status =
    session.phase === "correct"
      ? `Correct! ${session.right.name}: ${formatValue(valueFor(session.right, session.mode)!, session.mode)}. Streak ${session.streak}.`
      : session.phase === "wrong" || session.phase === "over"
        ? `Wrong. ${session.right.name}: ${formatValue(valueFor(session.right, session.mode)!, session.mode)}. Game over. Final streak ${session.streak}.`
        : "";
  return (
    <section
      className={`game wrap phase-${session.phase}`}
      ref={root}
      tabIndex={0}
      onKeyDown={keydown}
      aria-label="Higher or lower game"
    >
      <div className="game-intro">
        <div>
          <p className="eyebrow">A GAME FOR THE UNITED FAITHFUL</p>
          <h1>Know your United?</h1>
          <p>Two players. One stat. Higher or lower?</p>
        </div>
        <ScoreHeader best={records.best[session.mode]} />
      </div>
      <ModeSelector
        mode={session.mode}
        onChange={(mode: Mode) => restart(mode)}
      />
      <div className="match-toolbar">
        <span>
          MODE <strong>{modeDetails[session.mode].label}</strong>
        </span>
        <div
          className="difficulty"
          role="group"
          aria-label="Difficulty"
          data-no-shortcuts
        >
          {difficulties.map((d) => (
            <button
              key={d}
              aria-pressed={session.difficulty === d}
              onClick={() => restart(session.mode, d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {status}
      </div>
      {session.phase === "over" ? (
        <GameOver
          session={session}
          best={records.best[session.mode]}
          onRestart={() => restart(session.mode, session.difficulty, true)}
        />
      ) : (
        <div className="match-board">
          <PlayerPanel
            key={`left-${session.left.id}`}
            player={session.left}
            mode={session.mode}
            hidden={false}
            side="left"
          >
            <div className="benchmark-note">
              The number to beat.<span aria-hidden="true">↗</span>
            </div>
          </PlayerPanel>
          <div className="versus" aria-hidden="true">
            VS
          </div>
          <PlayerPanel
            key={`right-${session.right.id}`}
            player={session.right}
            mode={session.mode}
            hidden={!revealed}
            side="right"
            revealed={revealed}
          >
            <div className="answer-area">
              <p
                className={`answer-message ${revealed ? "answer-feedback" : ""}`}
              >
                {revealed ? (
                  session.phase === "correct" ? (
                    "✓ CORRECT. KEEP IT GOING!"
                  ) : (
                    "× WRONG. FINAL WHISTLE."
                  )
                ) : !hasAnswered ? (
                  <>
                    <span className="desktop-instruction">
                      Is the player on the right higher or lower?
                    </span>
                    <span className="mobile-instruction">
                      Is this player higher or lower?
                    </span>
                  </>
                ) : (
                  "Higher or lower than the benchmark?"
                )}
              </p>
              <GameControls disabled={!ready || revealed} onGuess={guess} />
            </div>
          </PlayerPanel>
        </div>
      )}
      <div className="scoreboard">
        <div className="streak-label">
          CURRENT
          <br />
          STREAK
        </div>
        <strong
          key={session.streak}
          className={session.phase === "correct" ? "streak-pop" : ""}
        >
          {String(session.streak).padStart(2, "0")}
        </strong>
        <span className="streak-message">
          {session.phase === "correct"
            ? "+1 · That’s the United way."
            : session.phase === "over"
              ? "Ready for another run?"
              : "How far can you go?"}
        </span>
        <div className="scoreboard-tools">
          <span className="keyboard-hint">
            ↑ H &nbsp; Higher &nbsp; / &nbsp; ↓ L &nbsp; Lower
          </span>
          <button
            aria-pressed={records.sound}
            disabled={!ready}
            onClick={() => persist({ ...records, sound: !records.sound })}
            data-no-shortcuts
          >
            SOUND {records.sound ? "ON" : "OFF"}{" "}
            <span aria-hidden="true">{records.sound ? "◖))" : "◖×"}</span>
          </button>
        </div>
      </div>
      <div className="match-footnote">
        <span>{modeDetails[session.mode].description}</span>
        <span>All United. All eras.</span>
      </div>
      {!storageOk && (
        <p className="storage-notice" role="status">
          Your browser cannot save records. You can keep playing; these records
          will last for this visit.
        </p>
      )}
    </section>
  );
}
