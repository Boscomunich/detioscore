import { ChevronRight, Loader2 } from "lucide-react";

import { useLeague } from "../hooks/use-leagues";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api-config";
import ScoreCard from "./score-card";
import type {
  FixtureResponse,
  FixturesApiResponse,
} from "../../types/football";

// Group fixtures by round and sort
function groupFixturesByRound(fixtures: FixtureResponse[]) {
  const groups: Record<string, FixtureResponse[]> = {};

  fixtures.forEach((fixture) => {
    const round = fixture.league.round;
    if (!groups[round]) {
      groups[round] = [];
    }
    groups[round].push(fixture);
  });

  // Sort each group by date
  Object.keys(groups).forEach((round) => {
    groups[round].sort(
      (a, b) =>
        new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
    );
  });

  // Sort groups by numeric round order
  const sortedRounds = Object.entries(groups).sort((a, b) => {
    const roundA = parseInt(a[0].replace(/\D/g, ""), 10);
    const roundB = parseInt(b[0].replace(/\D/g, ""), 10);
    return roundA - roundB;
  });

  return sortedRounds;
}

export default function ResultsCard() {
  const { league } = useLeague();

  const dateFormat: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
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

  const groupedRounds = fixtures?.response
    ? groupFixturesByRound(fixtures.response)
    : [];

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
    <div className="max-w-3xl px-4 border rounded-sm my-2 w-full pb-6">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div>
          {fixtures && (
            <div className="mt-4 pt-3 border-t border-border my-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      fixtures?.response[0]?.league?.flag || "/placeholder.svg"
                    }
                    alt={fixtures?.response[0]?.league?.country}
                    className="size-6 object-cover rounded-sm"
                  />
                  <div>
                    <div className="font-medium text-sm text-foreground">
                      {fixtures?.response[0]?.league?.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {fixtures?.response[0]?.league?.country}
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          )}

          {/* Grouped by Round */}
          <div className="flex flex-col gap-8 mt-4">
            {groupedRounds.map(([round, matches]) => {
              const roundStartDate = new Date(
                matches[0].fixture.date
              ).toLocaleDateString("en-US", dateFormat);

              return (
                <div key={round}>
                  {/* Round Heading */}
                  <div className="mb-3">
                    <h2 className="font-medium text-sm text-foreground">
                      {round}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Starts: {roundStartDate}
                    </p>
                  </div>

                  {/* Matches in this round */}
                  <div className="flex flex-col gap-2">
                    {matches.map((fixture, index) => (
                      <ScoreCard fixture={fixture} key={index} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
