import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getFixtures } from "./database";
import type { FixtureResponse } from "@/types/football";
import { sortFixturesByPopularityAndCountry } from "@/lib/utils";
import ScoreCard from "../football/score-card";

export default function Favourite() {
  return (
    <div className="h-full w-full max-w-3xl flex justify-center items-center mx-auto">
      <FixturesCard />
    </div>
  );
}

function FixturesCard() {
  const [fixtures, setFixtures] = useState<FixtureResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from IndexedDB
  useEffect(() => {
    let isMounted = true;

    async function fetchFixtures() {
      try {
        const storedFixtures = await getFixtures();

        if (isMounted) {
          setFixtures(storedFixtures);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchFixtures();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sort fixtures like live fixtures view
  const sortedLeagues = fixtures.length
    ? sortFixturesByPopularityAndCountry(fixtures)
    : [];

  return (
    <div className="w-full p-4 mb-20">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : sortedLeagues.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground">
          No favourite fixtures saved.
        </div>
      ) : (
        <div className="flex flex-col gap-8 mt-4">
          {sortedLeagues.map((league) => (
            <div
              key={league.leagueId}
              className="mb-6 bg-auto rounded-xl border border-border"
            >
              {/* League Header */}
              <div className="mb-3 flex items-start gap-2 bg-background/50 p-4">
                <img
                  src={league.countryFlag || "/placeholder.svg"}
                  alt={league.leagueName}
                  className="size-6 object-contain rounded-sm"
                />
                <div>
                  <div className="font-medium text-sm text-foreground">
                    {league.leagueName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {league.country}
                  </div>
                </div>
              </div>

              {/* Matches */}
              <div className="flex flex-col gap-2 p-4 bg-auto rounded-b-xl">
                {league.matches.map((fixture, index) => (
                  <ScoreCard fixture={fixture} key={index} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
