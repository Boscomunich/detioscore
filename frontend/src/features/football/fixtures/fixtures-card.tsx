import { Loader2 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useLeague } from "../../hooks/use-leagues";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api-config";
import ScoreCard from "../score-card";
import { sortFixturesByPopularityAndCountry } from "@/lib/utils";
import type { FixturesApiResponse } from "@/types/football";

export default function FixturesCard() {
  const [utcDate, setUtcDate] = useState("");
  const { league, currentDate } = useLeague();

  const dateFormat: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Use simple query instead of infinite query (same data)
  const { data, isLoading } = useQuery<FixturesApiResponse>({
    queryKey: ["fixtures", league?.league.id, league?.seasons[0].year, utcDate],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/daily-fixtures?leagueId=${league?.league.id}&season=${league?.seasons[0].year}&date=${utcDate}&timezone=${userTimezone}`
      );
      return response.data;
    },
    enabled: !!utcDate,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const dateObj = new Date(currentDate);
    const localDate = dateObj.toLocaleDateString("en-CA"); // "YYYY-MM-DD"
    setUtcDate(localDate);
  }, [currentDate]);

  const sortedLeagues = useMemo(() => {
    const fixtures = data?.response ?? [];
    if (!fixtures.length) return [];
    return sortFixturesByPopularityAndCountry(fixtures);
  }, [data]);

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );

  if (sortedLeagues.length === 0)
    return (
      <div className="text-center py-10 text-sm text-muted-foreground">
        No fixtures available for this date.
      </div>
    );

  return (
    <div className="flex flex-col gap-4 md:gap-6 mt-4">
      {sortedLeagues.map((league) => {
        const leagueStartDate = new Date(
          league.matches[0].fixture.date
        ).toLocaleDateString("en-US", dateFormat);

        return (
          <div key={league.leagueId} className=" bg-auto rounded-xl border">
            {/* League Header */}
            <div className="mb-3 flex items-start gap-2 bg-background/50 p-4">
              <img
                src={league.countryFlag || "/placeholder.svg"}
                alt={league.country}
                className="size-6 object-cover rounded-sm"
              />
              <div>
                <div className="font-medium text-sm text-foreground">
                  {league.leagueName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {league.country} • {leagueStartDate}
                </div>
              </div>
            </div>

            {/* Fixtures (same layout as LiveCard / ScoreCard) */}
            <div className="flex flex-col gap-2 p-4 rounded-b-xl">
              {league.matches.map((fixture, index) => (
                <ScoreCard fixture={fixture} key={index} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
