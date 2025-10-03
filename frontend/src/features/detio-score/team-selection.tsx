import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader, Loader2, Users } from "lucide-react";
import type {
  FixtureResponse,
  FixturesApiResponse,
} from "@/features/football/type";
import { apiClient, authApiClient } from "@/api-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import type { Competition, TeamWithOpponent } from "./type";
import { TeamCard } from "./team-card";

const PRIORITY_ORDER = [2, 3, 848, 39, 140, 78, 135, 61, 94, 88, 144, 179, 203];

const sortFixturesByPopularityAndCountry = (
  fixtures: FixtureResponse[] | undefined
) => {
  if (!fixtures) return [];

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
};

const extractTeamsFromFixtures = (
  fixtures: FixtureResponse[],
  starredTeam: number | null
): TeamWithOpponent[] => {
  const teams: TeamWithOpponent[] = [];

  for (const fixture of fixtures) {
    teams.push(
      {
        fixtureId: fixture.fixture.id,
        team: {
          id: fixture.teams.home.id,
          name: fixture.teams.home.name,
          logo: fixture.teams.home.logo,
          isStarred: fixture.teams.home.id === starredTeam,
        },
        opponent: {
          id: fixture.teams.away.id,
          name: fixture.teams.away.name,
          logo: fixture.teams.away.logo,
        },
        matchDate: fixture.fixture.date,
        league: fixture.league.name,
        leagueLogo: fixture.league.logo,
        matchVenue: fixture.fixture.venue?.name,
      },
      {
        fixtureId: fixture.fixture.id,
        team: {
          id: fixture.teams.away.id,
          name: fixture.teams.away.name,
          logo: fixture.teams.away.logo,
          isStarred: fixture.teams.away.id === starredTeam,
        },
        opponent: {
          id: fixture.teams.home.id,
          name: fixture.teams.home.name,
          logo: fixture.teams.home.logo,
        },
        matchDate: fixture.fixture.date,
        league: fixture.league.name,
        leagueLogo: fixture.league.logo,
        matchVenue: fixture.fixture.venue?.name,
      }
    );
  }

  return teams;
};

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function SelectTeamForm({
  competition,
}: {
  competition: Competition;
}) {
  const [selectedTeams, setSelectedTeams] = useState<Set<number>>(new Set());
  const [starredTeam, setStarredTeam] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const competitionDate = new Date(
    competition.startDate ?? Date.now()
  ).toLocaleDateString("en-CA");

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data, isLoading } = useQuery<FixturesApiResponse>({
    queryKey: ["select fixtures", competition._id],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/get-daily-fixtures?date=${competitionDate}&timezone=${userTimezone}`
      );
      return response.data;
    },
  });

  async function fetchData() {
    const response = await authApiClient.get(`/competition/${id}`);
    return response.data;
  }

  const { data: competitionData } = useQuery({
    queryKey: ["competition", id],
    queryFn: fetchData,
    enabled: !!id,
  });

  const allTeams: TeamWithOpponent[] = useMemo(() => {
    if (!data?.response) return [];

    const sortedLeagues = sortFixturesByPopularityAndCountry(data.response);
    const sortedFixtures = sortedLeagues.flatMap((league) => league.matches);
    return extractTeamsFromFixtures(sortedFixtures, starredTeam);
  }, [data, starredTeam]);

  const filteredTeams = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return allTeams;

    const query = debouncedSearchQuery.toLowerCase();
    return allTeams.filter(
      (t) =>
        t.team.name.toLowerCase().includes(query) ||
        t.opponent.name.toLowerCase().includes(query) ||
        t.league.toLowerCase().includes(query)
    );
  }, [allTeams, debouncedSearchQuery]);

  const handleTeamSelect = useCallback(
    (teamId: number) => {
      setSelectedTeams((prev) => {
        if (prev.has(teamId)) {
          const newSet = new Set(prev);
          newSet.delete(teamId);
          return newSet;
        }

        if (prev.size < competition.requiredTeams) {
          const newSet = new Set(prev);
          newSet.add(teamId);
          return newSet;
        }

        return prev;
      });
    },
    [competition.requiredTeams]
  );

  const handleTeamStar = useCallback((teamId: number) => {
    setStarredTeam((prev) => (prev === teamId ? null : teamId));
  }, []);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await authApiClient.post(
        `/top-score/join/${competition._id}`,
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
    const selections = allTeams.filter((t) => selectedTeams.has(t.team.id));
    mutation.mutate(selections);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <Loader2 className="animate-spin rounded-full h-8 w-8 mx-auto mb-4" />
        <p className="text-muted-foreground text-center">Loading matches...</p>
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
      <h1>All selected star teams</h1>
      {competitionData?.participants && (
        <Card>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Total Participants */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">
                {competitionData.participants.length} Participants
              </span>
            </div>

            {/* Starred Teams Logos + Names */}
            <div className="flex flex-wrap items-center gap-4">
              {competitionData.participants.map((p: any) => {
                if (!p.team) return null;
                const starTeamId = p.team.starTeam;
                const starTeam = p.team.teams.find(
                  (t: any) =>
                    t.selectedTeam?.teamId === starTeamId ||
                    t.opponentTeam?.teamId === starTeamId
                );

                const teamData =
                  starTeam.selectedTeam?.teamId === starTeamId
                    ? starTeam.selectedTeam
                    : starTeam.opponentTeam;

                return (
                  <div
                    key={`${p._id}-${starTeamId}`}
                    className="flex flex-col items-center text-center"
                  >
                    <img
                      src={teamData.logo}
                      alt={teamData.name}
                      className="w-5 h-5 rounded-full border shadow-sm"
                    />
                    <span className="text-[10px] mt-1 text-muted-foreground">
                      {teamData.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rule Card */}
      <Card>
        <CardContent className="px-2">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              • Select between 1 and {competition.requiredTeams} teams to join
              the competition
            </p>
            <p>• Star your favorite team to score more points</p>
          </div>
        </CardContent>
      </Card>

      {/* Error display */}
      {error && (
        <div className="w-full rounded-xl border border-red-300 bg-red-50 p-4 flex items-center gap-3 text-red-700 shadow-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Search input */}
      <Input
        type="text"
        placeholder="Search teams..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />

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
          className="bg-primary hover:bg-primary/90 w-full"
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
        {filteredTeams.map((t) => (
          <TeamCard
            key={`${t.fixtureId}-${t.team.id}`}
            {...t}
            isSelected={selectedTeams.has(t.team.id)}
            isStarred={starredTeam === t.team.id}
            onSelect={handleTeamSelect}
            onStar={handleTeamStar}
          />
        ))}
      </div>
    </div>
  );
}
