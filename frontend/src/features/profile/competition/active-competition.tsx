import { authApiClient } from "@/api-config";
import type { Competition } from "@/features/detio-score/type";
import { useQuery } from "@tanstack/react-query";
import CompetitionCard from "./card";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function ActiveCompetition() {
  async function fetchData() {
    const response = await authApiClient.get("/competition/user?status=active");
    return response.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["active-competition"],
    queryFn: fetchData,
  });

  const { data: session, isPending } = authClient.useSession();

  if (isLoading || isPending)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );

  if (data.length === 0)
    return (
      <div className="flex justify-center py-10">
        <p className="text-sm text-muted-foreground">No active competition</p>
      </div>
    );

  return (
    <div>
      {data?.map((competition: Competition) => (
        <CompetitionCard
          competition={competition}
          session={session}
          key={competition._id}
        />
      ))}
    </div>
  );
}
