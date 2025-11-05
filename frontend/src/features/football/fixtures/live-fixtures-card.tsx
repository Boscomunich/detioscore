import { Loader2 } from "lucide-react";
import { useLeague } from "../../hooks/use-leagues";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api-config";
import ScoreCard from "../score-card";
import { sortFixturesByPopularityAndCountry } from "@/lib/utils";
import type { FixturesApiResponse } from "@/types/football";

export default function LiveFixturesCard() {
  const { league } = useLeague();

  const { data, isLoading } = useQuery<FixturesApiResponse>({
    queryKey: ["live-fixtures", league?.league.id, league?.seasons[0].year],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/live?leagueId=${league?.league.id}&season=${league?.seasons[0].year}`
      );
      return response.data;
    },
  });

  const fixtures = data?.response ?? [];
  const sortedLeagues = fixtures.length
    ? sortFixturesByPopularityAndCountry(fixtures)
    : [];

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : sortedLeagues.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground">
          No Live fixture available.
        </div>
      ) : (
        <div className="flex flex-col gap-8 mt-4">
          {sortedLeagues.map((league) => (
            <div
              key={league.leagueId}
              className="mb-6 bg-auto rounded-xl border"
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
