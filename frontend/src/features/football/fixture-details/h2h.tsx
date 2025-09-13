import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api-config";
import ScoreCard from "../score-card";
import { type FixturesApiResponse, type FixtureResponse } from "../type";

// Group fixtures by country, then league, then by date
function groupFixturesByCountryLeagueAndDate(fixtures: FixtureResponse[]) {
  const countryGroups: Record<string, Record<string, any[]>> = {};

  fixtures.forEach((fixture) => {
    const country = fixture.league.country || "Unknown";
    const leagueId = fixture.league.id || "unknown";

    if (!countryGroups[country]) countryGroups[country] = {};
    if (!countryGroups[country][leagueId])
      countryGroups[country][leagueId] = [];

    countryGroups[country][leagueId].push(fixture);
  });

  const sorted = Object.entries(countryGroups)
    .sort(([aCountry], [bCountry]) => aCountry.localeCompare(bCountry))
    .map(([country, leagues]) => {
      const sortedLeagues = Object.entries(leagues)
        .sort(([, aMatches], [, bMatches]) =>
          aMatches[0].league.name.localeCompare(bMatches[0].league.name)
        )
        .map(([leagueId, matches]) => {
          // Sort fixtures by date (oldest → newest)
          matches.sort(
            (a, b) =>
              new Date(a.fixture.date).getTime() -
              new Date(b.fixture.date).getTime()
          );

          // Group by date first
          const dateGroups: Record<
            string,
            { round: string; fixtures: FixtureResponse[] }[]
          > = {};
          matches.forEach((match) => {
            const matchDate = new Date(match.fixture.date);
            const dateKey = matchDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            if (!dateGroups[dateKey]) dateGroups[dateKey] = [];

            // Find if this round already exists for this date
            const existingRoundIndex = dateGroups[dateKey].findIndex(
              (item) => item.round === match.league.round
            );

            if (existingRoundIndex === -1) {
              dateGroups[dateKey].push({
                round: match.league.round || "Unknown Round",
                fixtures: [match],
              });
            } else {
              dateGroups[dateKey][existingRoundIndex].fixtures.push(match);
            }
          });

          // Sort date groups chronologically
          const sortedDates = Object.entries(dateGroups).sort(
            ([aDate], [bDate]) => {
              return new Date(aDate).getTime() - new Date(bDate).getTime();
            }
          );

          return { leagueId, matches, dateGroups: sortedDates };
        });

      return { country, leagues: sortedLeagues };
    });

  return sorted;
}

export default function H2HCard({
  homeId,
  awayId,
}: {
  homeId: string;
  awayId: string;
}) {
  const { data: fixtures, isLoading } = useQuery<FixturesApiResponse>({
    queryKey: ["fixtures"],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/get-fixture-h2h?homeId=${homeId}&awayId=${awayId}`
      );
      return response.data;
    },
  });

  const groupedCountries = fixtures?.response
    ? groupFixturesByCountryLeagueAndDate(fixtures.response)
    : [];

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        /* Grouped by Country and League */
        <div className="flex flex-col gap-8 mt-4">
          {groupedCountries.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              No head to head available for this fixture.
            </div>
          ) : (
            groupedCountries.map(({ country, leagues }) => (
              <div key={country}>
                <h2 className="text-lg font-bold mb-3">{country}</h2>
                {leagues.map(({ leagueId, matches, dateGroups }) => {
                  const leagueInfo = matches[0].league;

                  return (
                    <div key={leagueId} className="mb-6">
                      <div className="mb-3 flex items-center gap-2">
                        <img
                          src={leagueInfo.flag || leagueInfo.logo}
                          alt={leagueInfo.country}
                          className="size-6 object-cover rounded-sm"
                        />
                        <div>
                          <div className="font-medium text-sm text-foreground">
                            {leagueInfo.name}
                          </div>
                        </div>
                      </div>

                      {/* Fixtures Grouped by Date, then by Round */}
                      {dateGroups.map(([date, roundGroups]) => (
                        <div key={date} className="mb-4">
                          {/* Date Header */}
                          <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
                            {date}
                          </h4>

                          {/* Rounds within this date */}
                          {roundGroups.map(({ round, fixtures }) => (
                            <div key={round} className="mb-3">
                              {/* Round Header */}
                              <h5 className="text-xs font-medium mb-1 text-muted-foreground pl-2">
                                {round}
                              </h5>

                              <div className="flex flex-col gap-2">
                                {fixtures.map((fixture) => (
                                  <ScoreCard
                                    fixture={fixture}
                                    key={fixture.fixture.id}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
