export function ScoreHeader({ best }: { best: number }) {
  return (
    <div className="best-score">
      <span className="best-star" aria-hidden="true">
        ✳
      </span>
      <div>
        <span>PERSONAL BEST</span>
        <strong>{String(best).padStart(2, "0")}</strong>
      </div>
    </div>
  );
}
