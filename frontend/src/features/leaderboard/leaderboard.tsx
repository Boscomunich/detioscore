import { authApiClient } from "@/api-config";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { RankingResponse } from "./components/global-rank";
import { LeaderboardTable } from "./components/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const limit = 25;

export default function LeaderboardPage() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [activeScope, setActiveScope] = useState<"world" | "country">("world");

  // Fetch function
  const fetchRankings = async ({
    pageParam = 1,
    scope,
  }: {
    pageParam?: number;
    scope: "world" | "country";
  }): Promise<RankingResponse> => {
    const res = await authApiClient.get("/rankings", {
      params: { type: "all", scope, limit, page: pageParam },
    });
    return res.data;
  };

  // WORLD query
  const worldQuery = useInfiniteQuery({
    queryKey: ["rankings", "world", limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchRankings({ pageParam, scope: "world" }),
    getNextPageParam: (lastPage) => {
      const current = lastPage?.context?.page;
      const totalPages = lastPage?.context?.totalPages;
      return current < totalPages ? current + 1 : undefined;
    },
  });

  // COUNTRY query
  const countryQuery = useInfiniteQuery({
    queryKey: ["rankings", "country", limit],
    initialPageParam: 1,
    enabled: activeScope === "country",
    queryFn: ({ pageParam }) => fetchRankings({ pageParam, scope: "country" }),
    getNextPageParam: (lastPage) => {
      const current = lastPage?.context?.page;
      const totalPages = lastPage?.context?.totalPages;
      return current < totalPages ? current + 1 : undefined;
    },
  });

  const q = activeScope === "world" ? worldQuery : countryQuery;

  // Flatten pages & transform into table-friendly structure
  const tableData =
    q.data?.pages.flatMap((p) =>
      p.data.map((player) => ({
        id: player._id,
        username: player.user?.username ?? "Unknown",
        country: player.user?.country ?? "Unknown",
        firstWin: player.firstWin,
        totalWins: player.totalWins,
        topScoreWin: player.topScoreWin,
        manGoSetWin: player.manGoSetWin,
        leagueWin: player.leagueWin,
        points: player.points,
        trend:
          activeScope === "world"
            ? player.worldRank?.trend ?? "stable"
            : player.countryRank?.trend ?? "stable",
        topScoreRank: player.topScoreRank,
        manGoSetRank: player.manGoSetRank,
        leagueRank: player.leagueRank,
        worldRank: player.worldRank,
        countryRank: player.countryRank,
      }))
    ) ?? [];

  // Infinite scroll
  const {
    hasNextPage: worldHasNextPage,
    isFetchingNextPage: worldIsFetchingNextPage,
    fetchNextPage: worldFetchNextPage,
  } = worldQuery;

  const {
    hasNextPage: countryHasNextPage,
    isFetchingNextPage: countryIsFetchingNextPage,
    fetchNextPage: countryFetchNextPage,
  } = countryQuery;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const fetchNext =
        activeScope === "world" ? worldFetchNextPage : countryFetchNextPage;
      const hasNext =
        activeScope === "world" ? worldHasNextPage : countryHasNextPage;
      const isFetching =
        activeScope === "world"
          ? worldIsFetchingNextPage
          : countryIsFetchingNextPage;

      if (entries[0].isIntersecting && hasNext && !isFetching) {
        fetchNext();
      }
    });

    const el = bottomRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [
    activeScope,
    worldHasNextPage,
    worldIsFetchingNextPage,
    worldFetchNextPage,
    countryHasNextPage,
    countryIsFetchingNextPage,
    countryFetchNextPage,
  ]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leaderboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mt-4">
          <Button
            onClick={() => setActiveScope("world")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeScope === "world"
                ? "bg-primary text-white"
                : "bg-muted text-foreground hover:bg-muted/70"
            }`}
          >
            🌍 World Ranking
          </Button>

          <Button
            onClick={() => setActiveScope("country")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeScope === "country"
                ? "bg-primary text-white"
                : "bg-muted text-foreground hover:bg-muted/70"
            }`}
          >
            Country Ranking
          </Button>
        </div>
      </div>

      {/* Content */}
      {q.isLoading && (
        <div className="flex justify-center py-10 w-full">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}
      {q.isError && <p>Error loading leaderboard.</p>}

      {/* Table */}
      <LeaderboardTable data={tableData} type="overall" />

      <div ref={bottomRef} className="h-12" />
      {q.isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
}
