import { authApiClient } from "@/api-config";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";
import CompetitionCard from "../competition-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Competition } from "../type";

export default function TopScore() {
  const navigate = useNavigate();

  async function fetchData() {
    const response = await authApiClient.get("/top-score/active-competition");
    return response.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["top-score-active"],
    queryFn: fetchData,
  });

  const { data: session } = authClient.useSession();

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center">
      <div className="w-[95%] md:w-[80%]">
        {isLoading
          ? [...Array(5)].map((_, i) => (
              <Skeleton key={i} className="rounded-lg h-28 p-4 w-full mb-4" />
            ))
          : data?.map((competition: Competition) => (
              <CompetitionCard
                competition={competition}
                session={session}
                key={competition._id}
              />
            ))}
      </div>
      <Button
        className="h-12 px-4 max-w-xl w-[92%] fixed bottom-24 text-white"
        onClick={() => navigate("topscore/create-new-competition")}
      >
        Create new competition
      </Button>
    </div>
  );
}
