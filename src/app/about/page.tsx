import type { Metadata } from "next";
import Link from "next/link";
import { DATA_DISCLAIMER, DATA_REVIEW_DATE, sources } from "@/data/sources";
import { players } from "@/data/players";
export const metadata: Metadata = { title: "About the game" };
export default function AboutPage() {
  return (
    <main id="main" className="content-page about-page wrap">
      <p className="eyebrow">BEHIND THE NUMBERS</p>
      <h1>
        ALL UNITED.
        <br />
        ALL ERAS.
      </h1>
      <p className="page-lead">
        A little knowledge. A little instinct. One more question.
      </p>
      <div className="about-columns">
        <section>
          <h2>What is United Higher / Lower?</h2>
          <p>
            A quick, single-player game for Manchester United fans. Compare two
            players, choose higher or lower, and keep the streak alive. The
            challenger becomes your next benchmark. One wrong answer ends the
            run.
          </p>
          <p>
            There are {players.length} players in the curated starting pool.
            Each mode uses only players with a suitable statistic. Goals mode
            excludes goalkeepers and players with fewer than 20 goals. Equal
            values never become a question.
          </p>
          <h2>Make it your game</h2>
          <p>
            Casual allows the widest differences. Normal narrows the pool. Hard
            favours closer numbers. Switching mode or difficulty starts a fresh
            run; your best is saved separately for each mode.
          </p>
          <p>
            Focus the game area to use ↑ or H for higher and ↓ or L for lower.
            After the final whistle, press Enter on Play again.
          </p>
          <h2>Your record stays yours</h2>
          <p>
            No account, no analytics, no database. Records and preferences live
            in your browser. Clearing browser data resets them. If saving is
            unavailable, the game still works.
          </p>
        </section>
        <section id="data">
          <h2>How are stats defined?</h2>
          <dl className="definitions">
            <dt>Appearances & goals</dt>
            <dd>
              Manchester United men’s first-team competitive totals across all
              competitions, including the Community Shield. Friendlies and
              wartime fixtures are excluded. Historical career totals are
              preferred to changing current-player totals.
            </dd>
            <dt>Transfer fee</dt>
            <dd>
              Reported initial or commonly cited arrival value in £ millions,
              without inflation adjustment. Some historical values include
              add-ons or exchange valuations; the data file identifies those
              exceptions. Missing, free, academy and loan fees are excluded.
            </dd>
            <dt>United years</dt>
            <dd>
              A deliberately approximate measure: end year minus start year for
              each senior spell, summed for returning players. It is not a
              season count or exact time served. For example, Ronaldo: (2009 −
              2003) + (2022 − 2021) = 7 years. Internal loan periods are not
              subtracted.
            </dd>
          </dl>
          <h2>Data disclaimer</h2>
          <p>{DATA_DISCLAIMER}</p>
          <p>
            Seed reviewed {DATA_REVIEW_DATE}. Some fields are intentionally
            missing, including unsettled appearance figures and undated
            current-player totals.
          </p>
          <ul className="sources-list">
            {Object.entries(sources).map(([id, s]) => (
              <li key={id}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="about-bottom">
        <p>
          Unofficial fan project. Not affiliated with Manchester United Football
          Club. No club crest or player photography is used.
        </p>
        <a
          href="https://github.com/brandonwilliams33/united-higher-lower"
          rel="noreferrer"
          target="_blank"
        >
          GitHub repository
        </a>
      </div>
      <Link href="/" className="primary-button">
        Back to the game
      </Link>
    </main>
  );
}
