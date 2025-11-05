import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";
import CompetitionCard from "../competition-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Competition } from "@/types/competition";

export default function TopScore() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  // --- Fetch function with pagination
  async function fetchCompetitions({ pageParam = 1 }) {
    const res = await authApiClient.get(
      `/top-score/active-competition?page=${pageParam}&limit=10`
    );
    return res.data; // expected: { competitions, pagination }
  }

  // --- Infinite Query setup
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["top-score-active"],
    queryFn: fetchCompetitions,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
  });

  // --- Infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 1.0 }
    );

    const node = loadMoreRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // --- Combine all pages into a single list
  const allCompetitions =
    data?.pages.flatMap((page) => page.competitions) ?? [];

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center">
      <div className="w-[95%] max-w-3xl space-y-4">
        <Button
          className="h-12 px-4 w-full text-white"
          onClick={() => navigate("topscore/create-new-competition")}
        >
          Create new competition
        </Button>

        {/* Loading state */}
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Skeleton key={i} className="rounded-lg h-28 p-4 w-full" />
          ))
        ) : error ? (
          <p className="text-red-500 text-center">
            Failed to load competitions.
          </p>
        ) : (
          allCompetitions.map((competition: Competition) => (
            <CompetitionCard
              competition={competition}
              session={session}
              key={competition._id}
            />
          ))
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={loadMoreRef} className="flex justify-center py-6">
          {isFetchingNextPage && (
            <Skeleton className="rounded-lg h-20 w-full md:w-1/2" />
          )}
        </div>

        {/* End of list message */}
        {!hasNextPage && !isLoading && allCompetitions.length > 0 && (
          <p className="text-center text-muted-foreground py-4">
            No more competitions.
          </p>
        )}
      </div>
    </div>
  );
}
