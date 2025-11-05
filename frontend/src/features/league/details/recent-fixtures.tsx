import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import type { FixturesApiResponse, Leagues } from "@/types/football";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api-config";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Skeleton } from "@/components/ui/skeleton"; // 👈 added

function MatchesCarousel({ league }: { league: Leagues }) {
  const { data: fixtures, isLoading } = useQuery<FixturesApiResponse>({
    queryKey: ["fixtures", league?.league.id, league?.seasons[0].year],
    queryFn: async () => {
      const today = new Date();
      const toDate = new Date();
      toDate.setDate(today.getDate() + 14);

      const from = today.toISOString().split("T")[0];
      const to = toDate.toISOString().split("T")[0];

      const response = await apiClient.get(
        `/livescore/fixtures?leagueId=${league?.league.id}&season=${league?.seasons[0].year}&from=${from}&to=${to}`
      );

      console.log("Fixtures response:", response.data);
      return response.data;
    },
    enabled: !!league,
  });

  if (isLoading)
    return (
      <div className="w-full space-y-4 mx-auto bg-auto py-8 rounded-sm">
        <h1 className="md:mx-[5%] mx-[10%] text-xl md:text-2xl font-semibold">
          Upcoming Matches
        </h1>
        <div className="w-[80%] md:w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-10" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );

  const matches = fixtures?.response ?? [];

  return (
    <div className="w-full space-y-4 mx-auto bg-auto py-8 rounded-sm">
      <h1 className="mx-[5%] text-xl md:text-2xl font-semibold">
        Upcoming Matches
      </h1>

      <Carousel className="w-[90%] mx-auto">
        <CarouselContent className="flex space-x-4">
          {matches.map((match: any) => (
            <CarouselItem
              key={match.fixture.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <MatchCard fixture={match} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}

export default MatchesCarousel;

function MatchCard({ fixture }: { fixture: any }) {
  const { teams, goals, fixture: fx } = fixture;
  const status = fx.status.short;
  const elapsed = fx.status.elapsed;
  const date = new Date(fx.date);

  const isLive = ["1H", "2H", "ET", "BT", "P", "LIVE", "INT", "SUSP"].includes(
    status
  );
  const isFinished = ["FT", "AET", "PEN"].includes(status);
  const isCancelled = ["CANC", "ABD", "AWD", "WO"].includes(status);
  const showScores = (isLive || isFinished) && !isCancelled;

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getStatusBadge = () => {
    const statusText: Record<string, string> = {
      NS: formatTime(fx.date),
      "1H": `${elapsed || 0}'`,
      "2H": `${elapsed || 45}'`,
      ET: `${elapsed || 90}'`,
      BT: "Break",
      P: "Pen",
      HT: "HT",
      FT: "FT",
      AET: "AET",
      PEN: "PEN",
      CANC: "Cancelled",
      ABD: "Abandoned",
      AWD: "Awarded",
      WO: "Walkover",
    };

    const color = isLive
      ? "text-orange-500"
      : isFinished
      ? "text-green-500"
      : isCancelled
      ? "text-destructive"
      : "text-muted-foreground";

    return (
      <div className="flex items-center gap-2">
        {isLive && (
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        )}
        <Badge variant="outline" className={cn("text-xs font-medium", color)}>
          {statusText[status] || status}
        </Badge>
      </div>
    );
  };

  return (
    <Card className="rounded-sm border shadow-sm hover:shadow-md transition">
      <CardContent className="p-2 md:p-4flex flex-col items-center text-center space-y-3">
        {/* Status and Date */}
        <div className="flex items-center justify-between px-4 pb-4 w-full text-sm text-muted-foreground">
          <span>
            {date.toLocaleDateString("en-GB", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
          {getStatusBadge()}
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between w-full">
          {/* Home */}
          <div className="flex flex-col items-center w-1/3">
            <LazyLoadImage
              src={teams.home.logo}
              alt={teams.home.name}
              className="w-10 h-10 object-contain"
            />
            <span className="mt-2 text-sm font-medium truncate">
              {teams.home.name}
            </span>
          </div>

          {/* Score / Time */}
          <div className="flex flex-col items-center justify-center w-1/3">
            {showScores ? (
              <>
                <span className="text-lg font-bold">{`${goals.home ?? 0} - ${
                  goals.away ?? 0
                }`}</span>
                <span className="text-xs text-muted-foreground">
                  {fx.venue?.city}
                </span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-muted-foreground mb-1" />
                <span className="text-sm font-medium">
                  {formatTime(fx.date)}
                </span>
              </>
            )}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center w-1/3">
            <LazyLoadImage
              src={teams.away.logo}
              alt={teams.away.name}
              className="w-10 h-10 object-contain"
            />
            <span className="mt-2 text-sm font-medium truncate">
              {teams.away.name}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
