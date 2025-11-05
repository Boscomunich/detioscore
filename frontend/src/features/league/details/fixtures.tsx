import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type {
  FixtureResponse,
  FixturesApiResponse,
  Leagues,
} from "@/types/football";
import ScoreCard from "@/features/football/score-card";

// --- Helper: Group fixtures by round ---
function groupFixturesByRound(fixtures: FixtureResponse[]) {
  const groups: Record<string, FixtureResponse[]> = {};
  fixtures.forEach((fixture) => {
    const round = fixture.league.round;
    if (!groups[round]) groups[round] = [];
    groups[round].push(fixture);
  });

  // Sort each group by date
  Object.keys(groups).forEach((round) => {
    groups[round].sort(
      (a, b) =>
        new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
    );
  });

  // Sort rounds numerically
  const sortedRounds = Object.entries(groups).sort((a, b) => {
    const roundA = parseInt(a[0].replace(/\D/g, ""), 10);
    const roundB = parseInt(b[0].replace(/\D/g, ""), 10);
    return roundA - roundB;
  });

  return sortedRounds;
}

// --- Helper: Group fixtures by date ---
function groupFixturesByDate(fixtures: FixtureResponse[], locale = "en-US") {
  const groups: Record<string, FixtureResponse[]> = {};

  fixtures.forEach((fixture) => {
    const date = new Date(fixture.fixture.date).toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(fixture);
  });

  // Sort groups by actual date order
  const sortedDates = Object.entries(groups).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );

  // Sort fixtures within each date by kickoff time
  sortedDates.forEach(([, matches]) =>
    matches.sort(
      (a, b) =>
        new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
    )
  );

  return sortedDates;
}

export default function Fixtures({ league }: { league: Leagues }) {
  const [sortMode, setSortMode] = useState<"ROUND" | "DATE">("ROUND");

  const { data: fixtures, isLoading } = useQuery<FixturesApiResponse>({
    queryKey: ["fixtures", league?.league.id, league?.seasons[0].year],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/fixtures?leagueId=${league?.league.id}&season=${league?.seasons[0].year}`
      );
      return response.data;
    },
    enabled: !!league,
  });

  const groupedRounds = useMemo(
    () => (fixtures?.response ? groupFixturesByRound(fixtures.response) : []),
    [fixtures]
  );

  const groupedDates = useMemo(
    () => (fixtures?.response ? groupFixturesByDate(fixtures.response) : []),
    [fixtures]
  );

  if (!league) {
    return (
      <div className="max-w-3xl px-4 border rounded-sm my-2 w-full py-6 flex justify-center items-center text-center">
        <p className="text-sm text-muted-foreground">
          Please select a league to view the results.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 border bg-auto rounded-sm my-2 w-[98%] mx-auto pb-6">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div>
          {/* Sorting Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 mt-4">
            {(["ROUND", "DATE"] as const).map((mode) => (
              <Button
                key={mode}
                onClick={() => setSortMode(mode)}
                className={cn(
                  "px-6 py-2 rounded-sm text-sm font-medium transition-colors whitespace-nowrap hover:bg-card",
                  sortMode === mode
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border text-foreground"
                )}
              >
                {mode === "ROUND" ? "By Round" : "By Date"}
              </Button>
            ))}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8 mt-4">
            {sortMode === "ROUND"
              ? groupedRounds.map(([round, matches]) => {
                  const roundStartDate = new Date(
                    matches[0].fixture.date
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                  return (
                    <div key={round}>
                      <div className="mb-3">
                        <h2 className="font-semibold text-lg text-foreground">
                          {round}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Starts: {roundStartDate}
                        </p>
                      </div>
                      <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
                        {matches.map((fixture, index) => (
                          <ScoreCard fixture={fixture} key={index} />
                        ))}
                      </div>
                    </div>
                  );
                })
              : groupedDates.map(([date, matches]) => (
                  <div key={date}>
                    <div className="mb-3">
                      <h2 className="font-semibold text-lg text-foreground">
                        {date}
                      </h2>
                    </div>
                    <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
                      {matches.map((fixture, index) => (
                        <ScoreCard fixture={fixture} key={index} />
                      ))}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
