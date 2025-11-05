import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import CompetitionCard from "./card";
import type { Competition } from "@/types/competition";

export default function InActiveCompetition() {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchCompetitions = async ({ pageParam = 1 }) => {
    const res = await authApiClient.get(
      `/competition/user?status=inactive&page=${pageParam}&limit=10`
    );
    return res.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["inactive-competition"],
    queryFn: fetchCompetitions,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
  });

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    // cleanup previous observer if any
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const node = nodeRef.current;
    if (node && observerRef.current) observerRef.current.observe(node);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading || isPending)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-10">
        <p className="text-sm text-red-500">Failed to load competitions</p>
      </div>
    );

  const competitions = data?.pages.flatMap((page) => page.competitions) ?? [];

  if (competitions.length === 0)
    return (
      <div className="flex justify-center py-10">
        <p className="text-sm text-muted-foreground">No competition</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {competitions.map((competition: Competition, idx: number) => {
        const isLast = idx === competitions.length - 1;
        return (
          <div key={competition._id} ref={isLast ? nodeRef : null}>
            <CompetitionCard competition={competition} session={session} />
          </div>
        );
      })}

      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
