import type { Metadata } from "next";
import { Stats } from "@/components/Stats";
export const metadata: Metadata = { title: "Your record" };
export default function StatsPage() {
  return (
    <main id="main" className="content-page wrap">
      <p className="eyebrow">THE NUMBERS THAT MATTER</p>
      <h1>YOUR RECORD.</h1>
      <p className="page-lead">
        For the love of the game. For a new personal best.
      </p>
      <Stats />
    </main>
  );
}
