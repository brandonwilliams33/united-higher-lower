import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found wrap">
      <p className="eyebrow">404 / OUT OF PLAY</p>
      <h1>OFFSIDE.</h1>
      <p>This page doesn’t count.</p>
      <Link href="/" className="primary-button">
        Back to the game
      </Link>
    </main>
  );
}
