import Link from "next/link";
export function SiteHeader() {
  return (
    <header className="site-header wrap">
      <Link href="/" className="brand" aria-label="United Higher or Lower home">
        <span className="brand-mark" aria-hidden="true">
          ↑↓
        </span>
        <span className="wordmark">
          UNITED<span>HIGHER / LOWER</span>
        </span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/stats">Your record</Link>
        <Link href="/about">About the game</Link>
      </nav>
    </header>
  );
}
