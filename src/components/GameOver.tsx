import { useEffect, useRef, useState } from "react";
import type { Session } from "@/types/game";
import { accuracy, formatValue, modeDetails, shareText } from "@/lib/format";
import { valueFor } from "@/lib/game-engine";
export function GameOver({
  session,
  best,
  onRestart,
}: {
  session: Session;
  best: number;
  onRestart: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const text = shareText(session.streak, session.mode, session.difficulty);
  useEffect(() => {
    button.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (fallback) {
      textarea.current?.focus();
      textarea.current?.select();
    }
  }, [fallback]);
  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setFallback(true);
    }
  }
  return (
    <section className="game-over" aria-labelledby="game-over-title">
      <div className="over-heading">
        <p>FINAL WHISTLE</p>
        <h2 id="game-over-title">GAME OVER.</h2>
        <span>There’s always the next game.</span>
      </div>
      <dl className="result-numbers">
        <div>
          <dt>Streak</dt>
          <dd>{session.streak}</dd>
        </div>
        <div>
          <dt>Best</dt>
          <dd>{best}</dd>
        </div>
        <div>
          <dt>Accuracy</dt>
          <dd>{accuracy(session.streak, session.answers.length)}</dd>
        </div>
      </dl>
      <div className="result-actions">
        <button className="primary-button" ref={button} onClick={onRestart}>
          Play again <span aria-hidden="true">↵</span>
        </button>
        <button className="secondary-button" onClick={copy}>
          {copied ? "Copied ✓" : "Copy result"}
        </button>
      </div>
      <span className="sr-only" role="status">
        {copied ? "Result copied to clipboard." : ""}
      </span>
      {fallback && (
        <label className="copy-fallback">
          Copy your result below
          <textarea ref={textarea} readOnly value={text} rows={7} />
        </label>
      )}
      <details className="last-question">
        <summary>Review the last question</summary>
        <p>
          {session.left.name}:{" "}
          <strong>
            {formatValue(valueFor(session.left, session.mode)!, session.mode)}
          </strong>
          <br />
          {session.right.name}:{" "}
          <strong>
            {formatValue(valueFor(session.right, session.mode)!, session.mode)}
          </strong>
        </p>
        <p>
          {session.right.name} was{" "}
          <strong>
            {valueFor(session.right, session.mode)! >
            valueFor(session.left, session.mode)!
              ? "higher"
              : "lower"}
          </strong>{" "}
          in {modeDetails[session.mode].label.toLowerCase()}.
        </p>
      </details>
    </section>
  );
}
