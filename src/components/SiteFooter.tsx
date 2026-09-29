import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="site-footer wrap">
      <span>Made for the fans. Played for the pride.</span>
      <p>
        Unofficial fan project. Not affiliated with Manchester United Football
        Club.
      </p>
      <Link href="/about#data">Data & sources</Link>
    </footer>
  );
}
