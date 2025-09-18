import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader, Loader2, Users } from "lucide-react";
import type {
  FixtureResponse,
  FixturesApiResponse,
} from "@/features/football/type";
import type { Competition, TeamSelection } from "../../type";
import { apiClient, authApiClient } from "@/api-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { TeamCard } from "../../team-card";

function sortFixturesByPopularityAndCountry(
  fixtures: FixtureResponse[] | undefined
) {
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

  fixtures?.forEach((fixture) => {
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

  return allLeagues.sort((a, b) => {
    const aIndex = PRIORITY_ORDER.indexOf(a.leagueId);
    const bIndex = PRIORITY_ORDER.indexOf(b.leagueId);

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    const countryCompare = a.country.localeCompare(b.country);
    if (countryCompare !== 0) return countryCompare;
    return a.leagueName.localeCompare(b.leagueName);
  });
}

function extractTeamsFromFixtures(
  fixtures: FixtureResponse[],
  starredTeam: number | null
): TeamSelection[] {
  return fixtures.flatMap((fixture) => [
    {
      teamId: fixture.teams.home.id,
      teamName: fixture.teams.home.name,
      teamLogo: fixture.teams.home.logo,
      isStarred: fixture.teams.home.id === starredTeam,
      opponent: fixture.teams.away.name,
      matchDate: fixture.fixture.date,
      league: fixture.league.name,
      leagueLogo: fixture.league.logo,
      matchVenue: fixture.fixture.venue?.name,
    },
    {
      teamId: fixture.teams.away.id,
      teamName: fixture.teams.away.name,
      teamLogo: fixture.teams.away.logo,
      isStarred: fixture.teams.away.id === starredTeam,
      opponent: fixture.teams.home.name,
      matchDate: fixture.fixture.date,
      league: fixture.league.name,
      leagueLogo: fixture.league.logo,
      matchVenue: fixture.fixture.venue?.name,
    },
  ]);
}

export default function SelectTeamForm({
  competition,
}: {
  competition: Competition;
}) {
  const [selectedTeams, setSelectedTeams] = useState<Set<number>>(new Set());
  const [starredTeam, setStarredTeam] = useState<number | null>(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const competitionDate = new Date(
    competition.startDate ?? Date.now()
  ).toLocaleDateString("en-CA");

  // Fetch fixtures from API
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data, isLoading } = useQuery<FixturesApiResponse>({
    queryKey: ["select fixtures", competition._id],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/get-daily-fixtures?date=${competitionDate}&timezone=${userTimezone}`
      );
      console.log(response.data);
      return response.data;
    },
  });

  // ✅ Apply sorting before extracting teams
  const allTeams: TeamSelection[] = useMemo(() => {
    const sortedLeagues = sortFixturesByPopularityAndCountry(data?.response);
    const sortedFixtures = sortedLeagues.flatMap((league) => league.matches);
    return extractTeamsFromFixtures(sortedFixtures, starredTeam);
  }, [data, starredTeam]);

  const handleTeamSelect = (teamId: number) => {
    setSelectedTeams((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else if (newSet.size < competition.requiredTeams) {
        newSet.add(teamId);
      }
      return newSet;
    });
  };

  const handleTeamStar = (teamId: number) => {
    setStarredTeam((prev) => (prev === teamId ? null : teamId));
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await authApiClient.post(
        `/man-go-set/join/${competition._id}`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success(
        `you have successfully joined the ${competition.name} competition`
      );
      navigate(`/detio-score/${competition._id}/details`, {
        replace: true,
        state: competition,
      });
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(`error joining ${competition.name}`);
      setError(error.response.data.message);
    },
  });

  const handleSubmit = () => {
    setError("");
    const selections = allTeams.filter((team) =>
      selectedTeams.has(team.teamId)
    );
    mutation.mutate(selections);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <Loader2 className="animate-spin rounded-full h-8 w-8 mx-auto mb-4" />
        <p className="text-muted-foreground">Loading matches...</p>
      </Card>
    );
  }

  if (allTeams.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No matches found for the selected date.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* rule */}
      <Card>
        <CardContent className="px-2">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              • Select between {competition.requiredTeams} teams to join the
              competition
            </p>
            <p>• Star your favorite team to score more points</p>
            <p>
              • Star team are unique per competition, no two users can have one
              star team
            </p>
          </div>
        </CardContent>
      </Card>

      {/* error display */}
      {error && (
        <div className="w-full rounded-xl border border-red-300 bg-red-50 p-4 flex items-center gap-3 text-red-700 shadow-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Selection Stats */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {selectedTeams.size}/{competition.requiredTeams} teams selected
          </Badge>
          {starredTeam && (
            <Badge variant="secondary">⭐ Starred team chosen</Badge>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={selectedTeams.size < competition.requiredTeams}
          className="bg-primary hover:bg-primary/90"
        >
          {mutation.isPending ? (
            <div className="flex justify-center py-10">
              <Loader className="w-8 h-8 animate-spin text-white" />
            </div>
          ) : (
            `Join Competition (${selectedTeams.size} teams)`
          )}
        </Button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
        {allTeams.map((team, index) => (
          <TeamCard
            key={index}
            team={{
              id: team.teamId,
              name: team.teamName,
              logo: team.teamLogo,
              winner: null,
            }}
            opponent={{ id: 0, name: team.opponent, logo: "", winner: null }}
            fixture={
              {
                fixture: {
                  id: team.teamId,
                  date: team.matchDate,
                  venue: { name: team.matchVenue ?? "" },
                },
                league: { name: team.league, logo: team.leagueLogo },
              } as any
            }
            isSelected={selectedTeams.has(team.teamId)}
            isStarred={team.isStarred}
            onSelect={handleTeamSelect}
            onStar={handleTeamStar}
          />
        ))}
      </div>
    </div>
  );
}
