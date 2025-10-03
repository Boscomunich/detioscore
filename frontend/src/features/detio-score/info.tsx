import { authApiClient } from "@/api-config";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Loader2 } from "lucide-react";
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
    //filter out participants with no selected teams
    .filter((p) => Array.isArray(p.team?.teams) && p.team.teams.length > 0)
    .sort((a, b) => {
      const aHasPoints = a.team?.teamPoints?.length > 0;
      const bHasPoints = b.team?.teamPoints?.length > 0;

      if (aHasPoints && bHasPoints) {
        return (b.team?.totalPoints ?? 0) - (a.team?.totalPoints ?? 0);
      } else if (!aHasPoints && !bHasPoints) {
        const dateDiff =
          new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
        if (dateDiff !== 0) return dateDiff;
        return (a.user?.username ?? "").localeCompare(b.user?.username ?? "");
      } else {
        return aHasPoints ? -1 : 1;
      }
    });

  const rankings = sortedParticipants.map((p, index) => ({
    _id: p._id,
    rank: index + 1,
    user: {
      username: p.user?.username ?? "Unknown",
      avatar: p.user?.avatar || null,
    },
    teams:
      p.team?.teams?.map((team: any) => ({
        teamId: team.selectedTeam.teamId,
        name: team.selectedTeam.name,
        logo: team.selectedTeam.logo,
        opponent: {
          teamId: team.opponentTeam.teamId,
          name: team.opponentTeam.name,
          logo: team.opponentTeam.logo,
        },
        matchVenue: team.matchVenue ?? "",
      })) ?? [],
    starTeam: p.team?.starTeam || null,
    teamPoints:
      p.team?.teamPoints?.map((tp: any) => ({
        teamId: tp.teamId,
        points: tp.points,
      })) ?? [],
    totalPoints: p.team?.totalPoints ?? 0,
    stakedAmount: p.team?.stakedAmount ?? 0,
    joinedAt: p.joinedAt,
  }));

  return (
    <>
      <div
        className="text-sm w-[95%] max-w-3xl font-[400] px-6 mx-auto cursor-pointer"
        onClick={() => navigate(-1)}
      >
        ← Back
      </div>
      <div className="space-y-4 max-w-3xl border px-4 rounded-sm my-2 w-[98%] mx-auto py-6">
        <h2 className="text-xl font-bold">{data.name} - Participants</h2>
        <TeamRankingsTable rankings={rankings} competitionType={data.type} />
      </div>
    </>
  );
}
