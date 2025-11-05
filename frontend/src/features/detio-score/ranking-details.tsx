import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, MapPin, ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { cn } from "@/lib/utils";
import type { RankingEntry } from "@/types/competition";

export function UserTeamInfoPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state as RankingEntry;

  const starFixture = data.teams.find(
    (fixture) => String(fixture.fixtureId) === String(data.starFixture)
  );

  return (
    <>
      <div className="space-y-4 max-w-3xl px-4 rounded-sm my-4 w-[98%] mx-auto">
        <span
          onClick={() => navigate(-1)}
          className="flex capitalize gap-1.5 cursor-pointer"
        >
          <ChevronLeft /> Back
        </span>
      </div>

      <div className="min-h-full p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <Card>
            <CardContent className="p-6">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      data.user.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.username}`
                    }
                  />
                  <AvatarFallback>
                    {data.user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    {data.user.username}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span>Rank #{data.rank}</span>
                    </div>
                    <span>{data.totalPoints} pts</span>
                  </div>
                </div>
              </div>

              {/* Star Fixture */}
              {starFixture && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg mb-4">
                  <div className="relative flex items-center gap-[3px]">
                    <div className="size-7 rounded-full overflow-hidden border">
                      <LazyLoadImage
                        src={starFixture.home.logo}
                        alt={starFixture.home.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="size-7 rounded-full overflow-hidden border">
                      <LazyLoadImage
                        src={starFixture.away.logo}
                        alt={starFixture.away.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Star className="absolute -top-1 -right-2 h-3.5 w-3.5 text-yellow-500 fill-current" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {starFixture.home.name} vs {starFixture.away.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Star Fixture
                    </p>
                  </div>
                </div>
              )}

              {/* Fixtures List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.teams.map((fixture) => {
                  const isStarred =
                    String(fixture.fixtureId) === String(data.starFixture);

                  const teamPoint = data.teamPoints?.find(
                    (tp) => String(tp.fixtureId) === String(fixture.fixtureId)
                  );

                  const homeScore = teamPoint?.score?.home ?? null;
                  const awayScore = teamPoint?.score?.away ?? null;
                  const isLive = teamPoint?.isLive ?? false;
                  const isFT = teamPoint?.isFT ?? false;

                  return (
                    <div
                      key={fixture.fixtureId}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded border relative transition-all",
                        isStarred && "ring-2 ring-yellow-500"
                      )}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {/* Home */}
                        <div className="flex flex-col justify-center items-center">
                          <LazyLoadImage
                            src={fixture.home.logo}
                            alt={fixture.home.name}
                            className="size-7 sm:size-8 object-cover rounded-full"
                          />
                          <span
                            className="text-[11px] text-muted-foreground mt-1 truncate max-w-[80px] text-center"
                            title={fixture.home.name}
                          >
                            {fixture.home.name}
                          </span>
                        </div>

                        {/* Score */}
                        <div className="flex flex-col items-center mx-1">
                          <p className="text-xs font-bold">
                            {homeScore != null && awayScore != null
                              ? `${homeScore} - ${awayScore}`
                              : "vs"}
                          </p>
                          {isLive && (
                            <span className="text-[10px] text-red-500 font-semibold animate-pulse">
                              LIVE
                            </span>
                          )}
                          {!isLive && isFT && (
                            <span className="text-[10px] text-gray-500 font-medium">
                              FT
                            </span>
                          )}
                        </div>

                        {/* Away */}
                        <div className="flex flex-col justify-center items-center">
                          <LazyLoadImage
                            src={fixture.away.logo}
                            alt={fixture.away.name}
                            className="size-7 sm:size-8 rounded-full object-cover"
                          />
                          <span
                            className="text-[11px] text-muted-foreground mt-1 truncate max-w-[80px] text-center"
                            title={fixture.away.name}
                          >
                            {fixture.away.name}
                          </span>
                        </div>
                      </div>

                      {/* Venue */}
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground truncate">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span
                          className="truncate max-w-[100px]"
                          title={fixture.matchVenue}
                        >
                          {fixture.matchVenue}
                        </span>
                      </div>

                      {isStarred && (
                        <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
