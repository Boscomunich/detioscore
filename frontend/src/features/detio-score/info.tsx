import { authApiClient } from "@/api-config";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, Loader2 } from "lucide-react";
import { TeamRankingsTable } from "./ranking";

export default function CompetitionInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchData() {
    const response = await authApiClient.get(`/competition/${id}`);
    return response.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["competition", id],
    queryFn: fetchData,
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );

  if (!data)
    return <div className="flex justify-center py-10">No competition data</div>;

  const sortedParticipants = [...(data.participants || [])]
    .filter((p) => Array.isArray(p.team?.teams) && p.team.teams.length > 0)
    .sort((a, b) => {
      const aRank = a.team?.rank ?? null;
      const bRank = b.team?.rank ?? null;
      const aPoints = a.team?.totalPoints ?? 0;
      const bPoints = b.team?.totalPoints ?? 0;

      // 1️⃣ If both have ranks, sort by rank (lower = better)
      if (aRank != null && bRank != null) {
        return aRank - bRank;
      }

      // 2️⃣ If only one has a rank, that one comes first
      if (aRank != null && bRank == null) return -1;
      if (aRank == null && bRank != null) return 1;

      // 3️⃣ Otherwise sort by total points (descending)
      if (bPoints !== aPoints) return bPoints - aPoints;

      // 4️⃣ If equal points, sort by join date (earlier first)
      const dateDiff =
        new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
      if (dateDiff !== 0) return dateDiff;

      // 5️⃣ Fallback: alphabetical username order
      return (a.user?.username ?? "").localeCompare(b.user?.username ?? "");
    });

  const rankings = sortedParticipants.map((p, index) => ({
    _id: p._id,
    rank: p.team?.rank ?? index + 1,

    user: {
      username: p.user?.username ?? "Unknown",
      avatar: p.user?.avatar || null,
    },

    teams:
      p.team?.teams?.map((team: any) => ({
        fixtureId: team.fixtureId,
        matchVenue: team.matchVenue ?? "",
        home: {
          teamId: team.selectedTeam?.teamId,
          name: team.selectedTeam?.name,
          logo: team.selectedTeam?.logo,
        },
        away: {
          teamId: team.opponentTeam?.teamId,
          name: team.opponentTeam?.name,
          logo: team.opponentTeam?.logo,
        },
      })) ?? [],

    teamPoints:
      p.team?.teamPoints?.map((tp: any) => ({
        fixtureId: tp.fixtureId,
        points: tp.points,
        score: tp.score,
        isFT: tp.isFT,
        isLive: tp.isLive,
      })) ?? [],

    starFixture: p.team?.starTeam ?? null,

    totalPoints: p.team?.totalPoints ?? 0,
    stakedAmount: p.team?.stakedAmount ?? 0,
    joinedAt: p.joinedAt,
  }));

  return (
    <>
      <div className="space-y-4 max-w-7xl px-4 rounded-sm my-4 w-[98%] mx-auto">
        <span
          onClick={() => navigate(-1)}
          className="flex capitalize gap-1.5 cursor-pointer"
        >
          <ChevronLeft /> Back
        </span>
      </div>
      <div className="space-y-4 max-w-7xl shadow-sm px-4 rounded-sm my-2 w-[98%] mx-auto py-6 bg-auto">
        <h2 className="text-xl font-bold">{data.name} - participants</h2>
        <p className="text-muted-foreground font-mono text-sm">
          ID: {data._id}
        </p>
        <TeamRankingsTable rankings={rankings} competitionType={data.type} />
      </div>
    </>
  );
}
