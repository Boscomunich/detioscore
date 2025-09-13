import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { useLeague } from "../../hooks/use-leagues";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/api-config";
import ScoreCard from "../score-card";
import { type FixturesApiResponse, type FixtureResponse } from "../type";

function sortFixturesByPopularityAndCountry(fixtures: FixtureResponse[]) {
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

    // both in priority list → sort by array order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    // one in priority list → it comes first
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // otherwise → fallback alphabetical by country then league name
    const countryCompare = a.country.localeCompare(b.country);
    if (countryCompare !== 0) return countryCompare;
    return a.leagueName.localeCompare(b.leagueName);
  });

  return sortedLeagues;
}

export default function FixturesCard() {
  const [utcDate, setUtcDate] = useState("");
  const { league, currentDate } = useLeague();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const dateFormat: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<FixturesApiResponse>({
      queryKey: [
        "fixtures",
        league?.league.id,
        league?.seasons[0].year,
        utcDate,
      ],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await apiClient.get(
          `/livescore/get-daily-fixtures?leagueId=${league?.league.id}&season=${league?.seasons[0].year}&date=${utcDate}&page=${pageParam}&timezone=${userTimezone}`
        );
        return response.data;
      },
      enabled: !!utcDate,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.paging.current < lastPage.paging.total) {
          return lastPage.paging.current + 1;
        }
        return undefined;
      },
      staleTime: 5 * 60 * 1000,
    });

  // Infinite scroll observer
  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;

    const target = loadMoreRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    const dateObj = new Date(currentDate);
    const localDate = dateObj.toLocaleDateString("en-CA"); // "YYYY-MM-DD"
    setUtcDate(localDate);
  }, [currentDate]);

  const sortedLeagues = useMemo(() => {
    const fixtures = data?.pages.flatMap((page) => page.response) ?? [];
    if (!fixtures.length) return [];
    return sortFixturesByPopularityAndCountry(fixtures);
  }, [data]);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex flex-col gap-8 mt-4">
          {sortedLeagues.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              No fixtures available for this date.
            </div>
          ) : (
            sortedLeagues.map((league) => {
              const leagueStartDate = new Date(
                league.matches[0].fixture.date
              ).toLocaleDateString("en-US", dateFormat);

              return (
                <div key={league.leagueId} className="mb-6">
                  <div className="mb-3 flex items-center gap-2">
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

                  <div className="flex flex-col gap-2">
                    {league.matches.map((fixture, index) => (
                      <ScoreCard fixture={fixture} key={index} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Infinite scroll loader trigger */}
      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && (
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
