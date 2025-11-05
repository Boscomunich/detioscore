"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { LazyLoadImage } from "react-lazy-load-image-component";

/**
 * Gets the appropriate football season based on European football calendar
 * Season runs from August to July
 * - Before August: use previous year as season
 * - August onwards: use current year as season
 */
function getCurrentFootballSeason(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // January = 1, December = 12

  // If it's before August (month 8), use previous year as season
  // If it's August or later, use current year as season
  return currentMonth < 8 ? currentYear - 1 : currentYear;
}

const currentYear = getCurrentFootballSeason();

const leagues = [
  {
    league: {
      id: 39,
      name: "Premier League",
      logo: "https://media.api-sports.io/football/leagues/39.png",
      type: "League",
    },
    country: {
      name: "England",
      code: "GB-ENG",
      flag: "https://media.api-sports.io/flags/gb-eng.svg",
    },
  },
  {
    league: {
      id: 140,
      name: "La Liga",
      logo: "https://media.api-sports.io/football/leagues/140.png",
      type: "League",
    },
    country: {
      name: "Spain",
      code: "ES",
      flag: "https://media.api-sports.io/flags/es.svg",
    },
  },
  {
    league: {
      id: 135,
      name: "Serie A",
      logo: "https://media.api-sports.io/football/leagues/135.png",
      type: "League",
    },
    country: {
      name: "Italy",
      code: "IT",
      flag: "https://media.api-sports.io/flags/it.svg",
    },
  },
  {
    league: {
      id: 78,
      name: "Bundesliga",
      logo: "https://media.api-sports.io/football/leagues/78.png",
      type: "League",
    },
    country: {
      name: "Germany",
      code: "DE",
      flag: "https://media.api-sports.io/flags/de.svg",
    },
  },
  {
    league: {
      id: 61,
      name: "Ligue 1",
      logo: "https://media.api-sports.io/football/leagues/61.png",
      type: "League",
    },
    country: {
      name: "France",
      code: "FR",
      flag: "https://media.api-sports.io/flags/fr.svg",
    },
  },
  {
    league: {
      id: 88,
      name: "Eredivisie",
      logo: "https://media.api-sports.io/football/leagues/88.png",
      type: "League",
    },
    country: {
      name: "Netherlands",
      code: "NL",
      flag: "https://media.api-sports.io/flags/nl.svg",
    },
  },
  {
    league: {
      id: 94,
      name: "Primeira Liga",
      logo: "https://media.api-sports.io/football/leagues/94.png",
      type: "League",
    },
    country: {
      name: "Portugal",
      code: "PT",
      flag: "https://media.api-sports.io/flags/pt.svg",
    },
  },
  {
    league: {
      id: 179,
      name: "Scottish Premiership",
      logo: "https://media.api-sports.io/football/leagues/179.png",
      type: "League",
    },
    country: {
      name: "Scotland",
      code: "GB-SCT",
      flag: "https://media.api-sports.io/flags/gb-sct.svg",
    },
  },
  {
    league: {
      id: 144,
      name: "Belgian Pro League",
      logo: "https://media.api-sports.io/football/leagues/144.png",
      type: "League",
    },
    country: {
      name: "Belgium",
      code: "BE",
      flag: "https://media.api-sports.io/flags/be.svg",
    },
  },
  {
    league: {
      id: 203,
      name: "Super Lig",
      logo: "https://media.api-sports.io/football/leagues/203.png",
      type: "League",
    },
    country: {
      name: "Turkey",
      code: "TR",
      flag: "https://media.api-sports.io/flags/tr.svg",
    },
  },
].map((item) => ({
  ...item,
  seasons: [
    {
      year: currentYear,
      start: `${currentYear}-08-15`,
      end: `${currentYear + 1}-05-24`,
      current: true,
      coverage: {
        fixtures: {
          events: true,
          lineups: true,
          statistics_fixtures: true,
          statistics_players: true,
        },
        standings: true,
        players: true,
        top_scorers: true,
        top_assists: true,
        top_cards: true,
        injuries: true,
        predictions: true,
        odds: true,
      },
    },
  ],
}));

export default function LeagueNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-muted/50">
      {/* Main leagues + More button column */}
      <div className="grid grid-cols-[1fr_auto] h-16">
        {/* Hidden overflow league links */}
        <div className="flex items-center gap-2 px-4 overflow-hidden">
          {leagues.map(({ league, country, seasons }) => (
            <Link
              key={league.id}
              to={`/league/${league.name}`}
              state={{ league, country, seasons }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground flex-shrink-0"
              )}
            >
              <LazyLoadImage
                src={league.logo}
                alt={league.name}
                className="w-5 h-5"
              />
              <span className="hidden sm:inline">{league.name}</span>
            </Link>
          ))}
        </div>

        {/* Fixed "More" column */}
        <div className="flex items-center justify-center border-l border-border bg-muted/20">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 transition-all cursor-pointer flex-shrink-0",
                  open
                    ? "text-foreground border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                More <MoreHorizontal className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-4 bg-background/95 rounded-2xl border shadow-xl">
              <div className="grid grid-cols-2 gap-3">
                {leagues.map(({ league, country, seasons }) => (
                  <Link
                    key={league.id}
                    to={`/league/${league.name}`}
                    state={{ league, country, seasons }}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/40 text-sm text-left transition-all"
                  >
                    <LazyLoadImage
                      src={league.logo}
                      alt={league.name}
                      className="w-5 h-5 shrink-0"
                    />
                    <span className="text-muted-foreground">{league.name}</span>
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
