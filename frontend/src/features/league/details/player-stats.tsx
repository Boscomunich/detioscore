import { useQuery } from "@tanstack/react-query";
import type { PlayerStatsApiResponse } from "../types";
import type { Leagues } from "@/types/football";
import { apiClient } from "@/api-config";
import { Loader2 } from "lucide-react";
import { PlayerStatsList } from "./statcard";

function TopScorers({ league }: { league: Leagues }) {
  const { data, isLoading } = useQuery<PlayerStatsApiResponse>({
    queryKey: ["topscorers", league?.league.id, league?.seasons[0].year],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/stats/players/topscorers?leagueId=${league?.league.id}&season=${league?.seasons[0].year}`
      );
      return response.data;
    },
    enabled: !!league,
  });

  if (!data && !isLoading) {
    return (
      <div className="max-w-3xl px-4 border rounded-sm my-2 w-full py-6 flex justify-center items-center text-center">
        <p className="text-sm text-muted-foreground">
          No stats for this section.
        </p>
      </div>
    );
  }
  return (
    <div className="my-4">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex justify-center">
          <PlayerStatsList
            data={data?.response ?? []}
            statType="goals"
            title={`${league.league.name} Top Scorers`}
          />
        </div>
      )}
    </div>
  );
}

function TopAssisters({ league }: { league: Leagues }) {
  const { data, isLoading } = useQuery<PlayerStatsApiResponse>({
    queryKey: ["topassisters", league?.league.id, league?.seasons[0].year],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/stats/players/topassisters?leagueId=${league?.league.id}&season=${league?.seasons[0].year}`
      );
      return response.data;
    },
    enabled: !!league,
  });

  if (!data && !isLoading) {
    return (
      <div className="max-w-3xl px-4 border rounded-sm my-2 w-full py-6 flex justify-center items-center text-center">
        <p className="text-sm text-muted-foreground">
          No stats for this section.
        </p>
      </div>
    );
  }
  return (
    <div className="my-4">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex justify-center">
          <PlayerStatsList
            data={data?.response ?? []}
            statType="assists"
            title={`${league.league.name} Top Assisters`}
          />
        </div>
      )}
    </div>
  );
}

function TopYellowCards({ league }: { league: Leagues }) {
  const { data, isLoading } = useQuery<PlayerStatsApiResponse>({
    queryKey: ["yellow-cards", league?.league.id, league?.seasons[0].year],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/stats/players/yellowcards?leagueId=${league?.league.id}&season=${league?.seasons[0].year}`
      );
      return response.data;
    },
    enabled: !!league,
  });

  if (!data && !isLoading) {
    return (
      <div className="max-w-3xl px-4 border rounded-sm my-2 w-full py-6 flex justify-center items-center text-center">
        <p className="text-sm text-muted-foreground">
          No stats for this section.
        </p>
      </div>
    );
  }
  return (
    <div className="my-4">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex justify-center">
          <PlayerStatsList
            data={data?.response ?? []}
            statType="yellowCards"
            title={`${league.league.name} Most Yellow cards`}
          />
        </div>
      )}
    </div>
  );
}

function TopRedCards({ league }: { league: Leagues }) {
  const { data, isLoading } = useQuery<PlayerStatsApiResponse>({
    queryKey: ["red-cards", league?.league.id, league?.seasons[0].year],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/stats/players/redcards?leagueId=${league?.league.id}&season=${league?.seasons[0].year}`
      );
      return response.data;
    },
    enabled: !!league,
  });

  if (!data && !isLoading) {
    return (
      <div className="max-w-3xl px-4 border rounded-sm my-2 w-full py-6 flex justify-center items-center text-center">
        <p className="text-sm text-muted-foreground">
          No stats for this section.
        </p>
      </div>
    );
  }
  return (
    <div className="my-4">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex justify-center">
          <PlayerStatsList
            data={data?.response ?? []}
            statType="redCards"
            title={`${league.league.name} Most Red cards`}
          />
        </div>
      )}
    </div>
  );
}

export default function PlayerStats({ league }: { league: Leagues }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 px-4 rounded-sm my-2 w-full mx-auto pb-6 gap-4">
      <TopScorers league={league} />
      <TopAssisters league={league} />
      <TopYellowCards league={league} />
      <TopRedCards league={league} />
    </div>
  );
}
