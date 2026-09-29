export const sources = {
  players: {
    title: "Manchester United players: competitive appearances and goals",
    url: "https://en.wikipedia.org/wiki/List_of_Manchester_United_F.C._players",
    note: "Historical reference table, including Community Shield; curated seed, not a live feed.",
  },
  fees: {
    title: "Manchester United transfer records",
    url: "https://en.wikipedia.org/wiki/List_of_Manchester_United_F.C._records_and_statistics#Transfers",
    note: "Reported GBP values; see per-player notes for initial fee versus package.",
  },
  berbatov: {
    title: "Berbatov and Carrick: reported transfer values",
    url: "https://www.the-independent.com/sport/football/premier-league/manchester-united-tottenham-spurs-news-eric-dier-pochettino-mourinho-a8021606.html",
    note: "Commonly cited £30.75m and £18.6m packages, respectively.",
  },
  cantona: {
    title: "Eric Cantona: club profile",
    url: "https://www.manutd.com/en/players-and-staff/detail/eric-cantona",
    note: "Profile and reference table disagree on appearances; omitted pending reconciliation.",
  },
  legends: {
    title: "Manchester United legends",
    url: "https://www.manutd.com/en/players-and-staff/legends",
    note: "Primary reference for final human verification of historical records.",
  },
} as const;
export const DATA_REVIEW_DATE = "2026-09-29";
export const DATA_DISCLAIMER =
  "Statistics are curated for gameplay and should be verified against the referenced sources before production publication.";
