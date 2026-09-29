import { MODES, type Mode } from "@/types/game";
import { modeDetails } from "@/lib/format";
export function ModeSelector({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  return (
    <div
      className="mode-selector"
      role="group"
      aria-label="Game mode"
      data-no-shortcuts
    >
      {MODES.map((m, i) => (
        <button key={m} aria-pressed={mode === m} onClick={() => onChange(m)}>
          <span className="mode-index" aria-hidden="true">
            0{i + 1}
          </span>
          {modeDetails[m].label}
        </button>
      ))}
    </div>
  );
}
