import { Loader2 } from "lucide-react";
import { useLeague } from "../../hooks/use-leagues";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api-config";
import ScoreCard from "../score-card";
import { type FixturesApiResponse, type FixtureResponse } from "../type";

// Group fixtures by league and sort
function sortFixturesByPopularityAndCountry(fixtures: FixtureResponse[]) {
  const TOP_EUROPEAN_LEAGUES = new Set([
    39, 140, 78, 135, 61, 94, 88, 144, 179, 203,
  ]);

  const leagueMap = new Map<
    number,
    {
      leagueId: number;
      leagueName: string;
      country: string;
      leagueLogo?: string;
      countryFlag?: string | null;
      matches: FixtureResponse[];
      isTopLeague: boolean;
    }
  >();

  fixtures.forEach((fixture) => {
    const { id: leagueId, name, country, flag, logo } = fixture.league;
    const isTopLeague = TOP_EUROPEAN_LEAGUES.has(leagueId);

    if (!leagueMap.has(leagueId)) {
      leagueMap.set(leagueId, {
        leagueId,
        leagueName: name,
        country,
        countryFlag: flag || logo,
        matches: [],
        isTopLeague,
      });
    }

    leagueMap.get(leagueId)!.matches.push(fixture);
  });

  const allLeagues = Array.from(leagueMap.values());

  const topLeagues = allLeagues
    .filter((l) => l.isTopLeague)
    .sort((a, b) => a.leagueId - b.leagueId);

  const otherLeagues = allLeagues
    .filter((l) => !l.isTopLeague)
    .sort((a, b) => {
      const countryCompare = a.country.localeCompare(b.country);
      if (countryCompare !== 0) return countryCompare;
      return a.leagueName.localeCompare(b.leagueName);
    });

  return [...topLeagues, ...otherLeagues];
}

export default function LiveFixturesCard() {
  const { league } = useLeague();

  const { data, isLoading } = useQuery<FixturesApiResponse>({
    queryKey: ["live-fixtures", league?.league.id, league?.seasons[0].year],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/get-live?leagueId=${league?.league.id}&season=${league?.seasons[0].year}`
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
            <div key={league.leagueId} className="mb-6">
              {/* League Header */}
              <div className="mb-3 flex items-center gap-2">
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
              <div className="flex flex-col gap-2">
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
