import { authApiClient } from "@/api-config";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { TeamRankingsTable } from "./ranking";
import { Loader2 } from "lucide-react";

export default function CompetitionInfo() {
  const { id } = useParams();

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

  const sortedParticipants = [...(data.participants || [])].sort((a, b) => {
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
        _id: team._id,
        name: team.name,
        logo: team.logo || null,
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
    <div className="space-y-4 max-w-3xl border px-4 rounded-sm my-2 w-[98%] mx-auto py-6">
      <h2 className="text-xl font-bold">{data.name} - Participants</h2>
      <TeamRankingsTable rankings={rankings} competitionType={data.type} />
    </div>
  );
}
