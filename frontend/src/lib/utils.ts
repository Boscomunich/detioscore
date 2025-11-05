import type { FixtureResponse } from "@/types/football";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | null) => {
  if (!date) return "Not set";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function sortFixturesByPopularityAndCountry(
  fixtures: FixtureResponse[]
) {
  const PRIORITY_ORDER = [
    2, 3, 848, 39, 140, 78, 135, 61, 94, 88, 144, 179, 203,
  ];

  const leagueMap = new Map<
    number,
    {
      leagueId: number;
      leagueName: string;
      country: string;
      countryFlag?: string;
      matches: FixtureResponse[];
    }
  >();

  fixtures.forEach((fixture) => {
    const {
      id: leagueId,
      name: leagueName,
      country,
      flag,
      logo,
    } = fixture.league;
    if (!leagueMap.has(leagueId)) {
      leagueMap.set(leagueId, {
        leagueId,
        leagueName,
        country,
        countryFlag: flag || logo,
        matches: [],
      });
    }
    leagueMap.get(leagueId)!.matches.push(fixture);
  });

  const allLeagues = Array.from(leagueMap.values());

  const sortedLeagues = allLeagues.sort((a, b) => {
    const aIndex = PRIORITY_ORDER.indexOf(a.leagueId);
    const bIndex = PRIORITY_ORDER.indexOf(b.leagueId);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    const countryCompare = a.country.localeCompare(b.country);
    if (countryCompare !== 0) return countryCompare;
    return a.leagueName.localeCompare(b.leagueName);
  });

  return sortedLeagues;
}
