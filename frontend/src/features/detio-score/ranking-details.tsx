import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

interface Team {
  teamId: number;
  name: string;
  logo: string;
  _id: string;
  opponent: {
    teamId: number;
    name: string;
    logo?: string;
  };
  matchVenue: string;
}

interface User {
  avatar: string | null;
  username: string;
}

interface UseTeamInfoData {
  _id: string;
  rank: number;
  user: User;
  teams: Team[];
  starTeam: number;
  joinedAt: string;
  stakedAmount: number;
  teamPoints: any[];
  totalPoints: number;
}

export function UserTeamInfoPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data: UseTeamInfoData = state;

  const starTeam = data.teams.find((team) => team.teamId === data.starTeam);

  return (
    <>
      <div
        className="text-sm w-[95%] max-w-3xl mx-auto font-[400] px-6 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        ← Back
      </div>
      <div className="min-h-full bg-background p-4">
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

              {/* Star Team */}
              {starTeam && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={starTeam.logo || "/placeholder.svg"}
                      alt={starTeam.name}
                    />
                    <AvatarFallback>{starTeam.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{starTeam.name}</p>
                    <p className="text-xs text-muted-foreground">Star Team</p>
                  </div>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
              )}

              {/* Teams List */}
              <div className="grid grid-cols-2 gap-2">
                {data.teams.map((team, index) => (
                  <div
                    key={index}
                    className="flex flex-col p-2 rounded border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={team.logo || "/placeholder.svg"}
                          alt={team.name}
                        />
                        <AvatarFallback className="text-xs">
                          {team.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate">
                        {team.name}
                      </span>
                      {team.teamId === data.starTeam && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                    </div>
                    {/* Opponent + Venue */}
                    <div className=" m-1 text-xs text-muted-foreground">
                      vs {team.opponent.name}
                      <div className="flex justify-start items-center">
                        <MapPin className="size-3" />
                        {team.matchVenue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
