"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { emptyRecords, readRecords, STORAGE_KEY } from "@/lib/storage";
import { MODES } from "@/types/game";
import { accuracy, modeDetails } from "@/lib/format";
export function Stats() {
  const [records, setRecords] = useState(emptyRecords);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const load = () => {
      setRecords(readRecords());
      setReady(true);
    };
    const frame = requestAnimationFrame(load);
    const storage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) load();
    };
    window.addEventListener("storage", storage);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("storage", storage);
    };
  }, []);
  const max = Math.max(10, ...Object.values(records.best));
  return (
    <div aria-busy={!ready}>
      <dl className="stats-grid">
        {[
          ["Games played", records.totalGames],
          ["Questions", records.totalAnswers],
          ["Correct", records.correctAnswers],
          ["Accuracy", accuracy(records.correctAnswers, records.totalAnswers)],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{ready ? value : "—"}</dd>
          </div>
        ))}
      </dl>
      <h2 className="section-heading">BEST STREAKS</h2>
      <div className="record-bars">
        {MODES.map((mode) => (
          <div className="record-row" key={mode}>
            <span>{modeDetails[mode].label}</span>
            <div className="bar-track" aria-hidden="true">
              <div style={{ width: `${(records.best[mode] / max) * 100}%` }} />
            </div>
            <strong>{records.best[mode]}</strong>
          </div>
        ))}
      </div>
      <p className="record-note">
        {records.totalGames
          ? "Every run counts. Your next record is one game away."
          : "A clean sheet. Play your first game to start your record."}
      </p>
      <Link className="primary-button" href="/">
        Back to the game
      </Link>
      <p className="privacy-note">
        Saved only in this browser. A game counts when you answer its first
        question, even if you leave before losing. Best streaks are shared
        across difficulties within each mode.
      </p>
    </div>
  );
}
