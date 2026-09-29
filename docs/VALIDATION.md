# V1 validation — 2026-09-29

## Automated checks

- `npm run lint`: passed, no warnings.
- `npm test`: 15 tests passed, including 3,000 seeded chained rounds (4 modes × 3 difficulties × 250 rounds).
- `npm run build`: passed; TypeScript passed; all routes prerendered successfully.
- Production HTTP smoke checks: `/`, `/stats`, `/about`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/opengraph-image`, `/icon.svg` return 200 with expected content types. An unknown route returns 404.
- Invalid/missing statistics, equal values, identical players, exhausted pools, returning-player durations, corrupt storage, unavailable storage, throwing browser storage getters and quota errors are covered by unit tests.

## Actual browser checks

- Desktop layout at 1440px and mobile layout at 390px; narrow-screen document width at 320px. No page-level horizontal overflow on checked mobile widths. Main answer buttons measure 53px high on mobile.
- Correct keyboard answer: Lingard's 232 appearances below Brown's 362; visible reveal and streak +1; Lingard becomes the next benchmark.
- Wrong answer: Robson's 461 compared with Lingard's 232; visible wrong feedback, then game over with streak 1, best 1 and 50% run accuracy.
- Enter on Play again restarts; H answers the restarted game. Focus returns to the game region.
- Copy Result changes to “Copied ✓”; last-question review displays both players, both values and the correct direction.
- Transfer fee, goals and United years mode switches generate appropriate questions and reset streak. Hard selection works; a reload intentionally restores default normal difficulty.
- Reload preserves preferred transfer-fee mode, sound ON and previous records. Sound was switched back OFF after testing.
- Direct `/stats`: 2 played games, 3 questions, 2 correct, 66.7% lifetime accuracy and appearances best 1, matching the exercised session.
- Direct `/about` renders definitions and source links. Unknown route renders “OFFSIDE.” and a return link.
- Final production page console: no captured warnings or errors.
- `docs/desktop.png` and `docs/mobile.png` are screenshots of the final production build.

## Explicit limits

- No claim of a Lighthouse score; Lighthouse was not run.
- Clipboard-denied fallback and reduced-motion styles were code-reviewed; OS-level clipboard denial and reduced-motion settings were not toggled in the user's browser.
- Vercel compatibility is supported by a successful standard Next.js production build, not by an actual Vercel deployment. No account was connected and no public URL was created.
- Data still requires the editorial review documented in README's DATA TODO before a public launch.
