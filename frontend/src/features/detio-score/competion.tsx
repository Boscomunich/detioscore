import { useState, useRef, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import CompetitionCard from "./competition-card";
import type { Competition } from "@/types/competition";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotFound } from "../components/not-found";

export default function AllCompetition() {
  const { data: session } = authClient.useSession();
  const [searchId, setSearchId] = useState("");
  const [queryId, setQueryId] = useState("");

  //Fetch multiple competitions (infinite)
  async function fetchCompetitions({ pageParam = 1 }) {
    const res = await authApiClient.get(
      `/competition/active-competition?page=${pageParam}&limit=10`
    );
    return res.data;
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["all-active-competitions"],
    queryFn: fetchCompetitions,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    enabled: !queryId, // disable when searching single ID
  });

  //Fetch single competition by ID
  const {
    data: singleCompetition,
    isFetching: isFetchingSingle,
    error: singleError,
  } = useQuery({
    queryKey: ["competition", queryId],
    queryFn: async () => {
      const res = await authApiClient.get(`/competition/single/${queryId}`);
      return res.data;
    },
    enabled: !!queryId,
    retry: false,
  });

  //Infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || queryId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const node = loadMoreRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, queryId]);

  const allCompetitions =
    data?.pages.flatMap((page) => page.competitions) ?? [];

  //Handle search
  const handleSearch = () => {
    if (searchId.trim() === "") return;
    setQueryId(searchId.trim());
  };

  const resetQuery = () => {
    setQueryId("");
    setSearchId("");
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start">
      <div className="w-[95%] max-w-3xl space-y-4">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md w-full p-1">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search competition ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="bg-transparent outline-none w-full text-sm text-gray-600 dark:text-neutral-200 placeholder:text-gray-400"
          />

          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* Search Result */}
        {queryId ? (
          <>
            {isFetchingSingle ? (
              <Skeleton className="rounded-lg h-28 p-4 w-full" />
            ) : singleError ? (
              <NotFound
                title="Invalid ID"
                message="Competition not found"
                refreshFn={resetQuery}
              />
            ) : (
              singleCompetition && (
                <CompetitionCard
                  competition={singleCompetition}
                  session={session}
                />
              )
            )}
          </>
        ) : (
          <>
            {/* Default infinite competitions */}
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="rounded-lg h-28 p-4 w-full" />
              ))
            ) : error ? (
              <NotFound
                title="Empty"
                message="Failed to load competition"
                refreshFn={refetch}
              />
            ) : (
              allCompetitions.map((competition: Competition) => (
                <CompetitionCard
                  key={competition._id}
                  competition={competition}
                  session={session}
                />
              ))
            )}

            {/* Infinite scroll loader */}
            <div ref={loadMoreRef} className="flex justify-center py-6">
              {isFetchingNextPage && (
                <Skeleton className="rounded-lg h-20 w-full md:w-1/2" />
              )}
            </div>

            {!hasNextPage && !isLoading && (
              <p className="text-center text-muted-foreground py-4">
                No more competitions.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
