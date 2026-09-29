import type { Guess } from "@/types/game";
export function GameControls({
  disabled,
  onGuess,
}: {
  disabled: boolean;
  onGuess: (guess: Guess) => void;
}) {
  return (
    <div className="game-controls">
      <button
        className="higher"
        disabled={disabled}
        onClick={() => onGuess("higher")}
        aria-keyshortcuts="ArrowUp H"
      >
        <span aria-hidden="true">↑</span> Higher
      </button>
      <button
        className="lower"
        disabled={disabled}
        onClick={() => onGuess("lower")}
        aria-keyshortcuts="ArrowDown L"
      >
        <span aria-hidden="true">↓</span> Lower
      </button>
    </div>
  );
}
