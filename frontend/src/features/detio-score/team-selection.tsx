import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader, Loader2, Users } from "lucide-react";
import type { FixtureResponse, FixturesApiResponse } from "@/types/football";
import { apiClient, authApiClient } from "@/api-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { TeamCard } from "./team-card";
import type { Competition, TeamWithOpponent } from "@/types/competition";

const PRIORITY_ORDER = [2, 3, 848, 39, 140, 78, 135, 61, 94, 88, 144, 179, 203];

const sortFixturesByPopularityAndCountry = (
  fixtures: FixtureResponse[] | undefined
) => {
  if (!fixtures || !Array.isArray(fixtures)) return [];

  const leagueMap = new Map<number, any>();

  fixtures.forEach((fixture) => {
    if (!fixture?.league || !fixture.fixture) return;
    const {
      id: leagueId,
      name: leagueName,
      country,
      flag,
      logo,
    } = fixture.league;
    if (!leagueId) return;

    if (!leagueMap.has(leagueId)) {
      leagueMap.set(leagueId, {
        leagueId,
        leagueName: leagueName || "Unknown League",
        country: country || "Unknown Country",
        countryFlag: flag || logo || "",
        matches: [],
      });
    }
    leagueMap.get(leagueId)?.matches.push(fixture);
  });

  const allLeagues = Array.from(leagueMap.values());
  return allLeagues.sort((a, b) => {
    const aIndex = PRIORITY_ORDER.indexOf(a.leagueId);
    const bIndex = PRIORITY_ORDER.indexOf(b.leagueId);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    const countryCompare = a.country.localeCompare(b.country);
    if (countryCompare !== 0) return countryCompare;
    return a.leagueName.localeCompare(b.leagueName);
  });
};

const extractTeamsFromFixtures = (
  fixtures: FixtureResponse[],
  starredFixture: number | null
): TeamWithOpponent[] => {
  if (!fixtures?.length) return [];
  return fixtures
    .filter((f) => f?.fixture && f?.teams?.home && f?.teams?.away)
    .map((fixture) => ({
      fixtureId: fixture.fixture.id,
      team: {
        id: fixture.teams.home.id,
        name: fixture.teams.home.name,
        logo: fixture.teams.home.logo,
      },
      opponent: {
        id: fixture.teams.away.id,
        name: fixture.teams.away.name,
        logo: fixture.teams.away.logo,
      },
      isStarred: fixture.fixture.id === starredFixture,
      matchDate: fixture.fixture.date,
      league: fixture.league?.name || "Unknown League",
      leagueLogo: fixture.league?.logo,
      matchVenue: fixture.fixture.venue?.name || "Unknown Venue",
    }));
};

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function SelectTeamForm({
  competition,
}: {
  competition: Competition;
}) {
  const [selectedTeams, setSelectedTeams] = useState<Set<number>>(new Set());
  const [starredFixture, setStarredFixture] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const competitionDate = new Date(
    competition?.startDate ?? Date.now()
  ).toLocaleDateString("en-CA");
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data, isLoading, isError } = useQuery<FixturesApiResponse>({
    queryKey: ["select fixtures", competition?._id],
    queryFn: async () => {
      try {
        const response = await apiClient.get(
          `/livescore/daily-fixtures?date=${competitionDate}&timezone=${userTimezone}`
        );
        return response.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message || "Failed to fetch fixtures.";
        toast.error(message);
        throw new Error(message);
      }
    },
    enabled: !!competitionDate,
  });

  const { data: competitionData, isError: compError } = useQuery({
    queryKey: ["competition", id],
    queryFn: async () => {
      try {
        const response = await authApiClient.get(`/competition/${id}`);
        return response.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message || "Failed to fetch competition data.";
        toast.error(message);
        throw new Error(message);
      }
    },
    enabled: !!id,
  });

  const allTeams: TeamWithOpponent[] = useMemo(() => {
    if (!data?.response) return [];
    try {
      const sortedLeagues = sortFixturesByPopularityAndCountry(data.response);
      const sortedFixtures = sortedLeagues.flatMap((l) => l.matches || []);
      return extractTeamsFromFixtures(sortedFixtures, starredFixture);
    } catch {
      return [];
    }
  }, [data, starredFixture]);

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
      if (!teamId) return;
      setSelectedTeams((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(teamId)) {
          newSet.delete(teamId);
          return newSet;
        }
        if (newSet.size < (competition?.requiredTeams || 0)) {
          newSet.add(teamId);
        } else {
          toast.warning("You’ve reached the maximum number of teams.");
        }
        return newSet;
      });
    },
    [competition?.requiredTeams]
  );

  const handleTeamStar = useCallback((fixtureId: number) => {
    if (!fixtureId) return;
    setStarredFixture((prev) => (prev === fixtureId ? null : fixtureId));
  }, []);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      try {
        const res = await authApiClient.patch(
          `/competition/join/${competition?._id}`,
          data
        );
        return res.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          `Failed to join ${competition?.name || "competition"}.`;
        throw new Error(message);
      }
    },
    onSuccess: () => {
      toast.success(
        `You have successfully joined the ${competition?.name} competition`
      );
      navigate(`/detio-score/${competition?._id}/details`, { replace: true });
    },
    onError: (err: any) => {
      const message = err?.message || "An unexpected error occurred.";
      setError(message);
      toast.error(message);
    },
  });

  const handleSubmit = () => {
    setError("");
    if (selectedTeams.size < (competition?.requiredTeams || 0)) {
      toast.warning(
        "Please select the required number of teams before joining."
      );
      return;
    }
    const selections = allTeams.filter((t) => selectedTeams.has(t.team.id));
    if (!selections.length) {
      setError("No teams selected.");
      return;
    }
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

  if (isError || compError) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center text-red-600">
          Failed to load data. Please try again later.
        </CardContent>
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
      {competitionData?.participants?.length > 0 && (
        <Card>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">
                {competitionData.participants.length} Participants
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {competitionData.participants.map((p: any, index: any) => {
                const starTeamId = p?.team?.starTeam;
                const starFixture = p?.team?.teams?.find(
                  (t: any) => t.fixtureId === starTeamId
                );

                if (!starFixture) return null;
                return (
                  <div className="flex items-center justify-center gap-2">
                    <div
                      key={index}
                      className="flex flex-col items-center text-center"
                    >
                      <img
                        src={starFixture.selectedTeam.logo}
                        alt={starFixture.selectedTeam.name}
                        className="w-5 h-5 rounded-full border shadow-sm"
                      />
                      <span className="text-[10px] mt-1 text-muted-foreground">
                        {starFixture.selectedTeam.name}
                      </span>
                    </div>
                    <p className="text-xs font-bold">vs</p>
                    <div
                      key={`${p?._id}-${starTeamId}`}
                      className="flex flex-col items-center text-center"
                    >
                      <img
                        src={starFixture.opponentTeam.logo}
                        alt={starFixture.opponentTeam.name}
                        className="w-5 h-5 rounded-full border shadow-sm"
                      />
                      <span className="text-[10px] mt-1 text-muted-foreground">
                        {starFixture.opponentTeam.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="px-2">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              • Select {competition?.requiredTeams || 0} matches to join the
              competition
            </p>
            <p>• Star your match to score more points</p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="w-full rounded-xl border border-red-300 bg-red-50 p-4 flex items-center gap-3 text-red-700 shadow-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <Input
        type="text"
        placeholder="Search teams..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {selectedTeams.size}/{competition?.requiredTeams || 0} teams
            selected
          </Badge>
          {starredFixture && (
            <Badge variant="secondary">⭐ Starred fixture chosen</Badge>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={
            selectedTeams.size < (competition?.requiredTeams || 0) ||
            mutation.isPending
          }
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

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
        {filteredTeams.map((t) => (
          <TeamCard
            key={`${t.fixtureId}-${t.team.id}`}
            {...t}
            isSelected={selectedTeams.has(t.team.id)}
            isStarred={starredFixture === t.fixtureId}
            onSelect={handleTeamSelect}
            onStar={handleTeamStar}
          />
        ))}
      </div>
    </div>
  );
}
