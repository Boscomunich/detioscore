import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { Rank } from "@/types/rank";
import { cn } from "@/lib/utils";

type Props = {
  scope?: "world" | "country";
  type?: "all" | "topscore" | "league" | "mangoset";
  initialLimit?: number;
  heightClass?: string; // optional height class (default h-96)
};
export type RankingResponse = {
  data: Rank[];
  context: {
    type: string;
    scope: string;
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    userCountry?: string | null;
  };
};

export default function GlobalRank({
  scope = "world",
  type = "all",
  initialLimit = 25,
  heightClass = "h-96",
}: Props) {
  const limit = initialLimit;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // fetch function
  const fetchRankings = async ({ pageParam = 1 }): Promise<RankingResponse> => {
    const res = await authApiClient.get("/rankings", {
      params: { type, scope, limit, page: pageParam },
    });
    return res.data;
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["rankings", type, scope, limit],
    queryFn: fetchRankings,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage?.context?.totalPages ?? 1;
      const currentPage = allPages.length;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  // infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    const el = bottomRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const ranks: Rank[] = data?.pages.flatMap((p) => p.data) ?? [];

  // loading / error states
  if (isLoading) return <RankTableSkeleton heightClass={heightClass} />;
  if (isError)
    return (
      <div className={cn("p-4 text-center rounded-md shadow-sm", heightClass)}>
        Failed to load rankings
      </div>
    );

  return (
    <ScrollArea
      className={cn("border rounded-md shadow-sm overflow-hidden", heightClass)}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-xs">#</TableHead>
            <TableHead className="text-xs min-w-[120px]">Player</TableHead>
            <TableHead className="text-xs text-center">Country</TableHead>
            <TableHead className="text-xs text-center">
              {scope === "country" ? "Country Rank" : "World Rank"}
            </TableHead>
            <TableHead className="text-xs text-center font-semibold">
              Points
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {ranks.map((rank, index) => (
            <TableRow
              key={index}
              className={cn(
                "hover:bg-muted/40 transition-colors",
                rank.worldRank?.position <= 3 &&
                  "border-l-2 border-l-yellow-500"
              )}
            >
              <TableCell className="text-xs font-medium">
                {scope === "country"
                  ? rank.countryRank?.position ?? "-"
                  : rank.worldRank?.position ?? "-"}
              </TableCell>

              <TableCell className="flex items-center gap-2 truncate">
                <Avatar className="size-5">
                  <AvatarImage
                    src={
                      rank.user?.image ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${rank.user?.username}`
                    }
                  />
                  <AvatarFallback>
                    {rank?.user?.username
                      ? rank.user.username.slice(0, 2).toUpperCase()
                      : "NA"}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-sm font-medium">
                  {rank.user?.username ?? "Unknown"}
                </span>
              </TableCell>

              <TableCell className="text-center text-xs">
                {rank.user?.country ?? "-"}
              </TableCell>

              <TableCell className="text-center text-xs">
                {scope === "country"
                  ? rank.countryRank?.position ?? "-"
                  : rank.worldRank?.position ?? "-"}
              </TableCell>

              <TableCell className="text-center text-xs font-semibold">
                {rank.points ?? 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Infinite scroll indicator */}
      <div
        ref={bottomRef}
        className="h-10 flex justify-center items-center text-xs text-muted-foreground"
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Scroll for more"
          : "No more results"}
      </div>
    </ScrollArea>
  );
}

function RankTableSkeleton({ heightClass }: { heightClass?: string }) {
  const skeletons = Array.from({ length: 10 });

  return (
    <ScrollArea
      className={cn("border rounded-md shadow-sm overflow-hidden", heightClass)}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-xs">#</TableHead>
            <TableHead className="text-xs min-w-[120px]">Player</TableHead>
            <TableHead className="text-xs text-center">Country</TableHead>
            <TableHead className="text-xs text-center">Rank</TableHead>
            <TableHead className="text-xs text-center font-semibold">
              Points
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletons.map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-3 w-4" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-3 w-10 mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-3 w-8 mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
