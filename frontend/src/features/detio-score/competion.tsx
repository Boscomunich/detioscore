import { authApiClient } from "@/api-config";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import CompetitionCard from "./competition-card";
import type { Competition } from "./type";

export default function AllCompetition() {
  const navigate = useNavigate();

  async function fetchData() {
    const response = await authApiClient.get("/competition/active-competition");
    return response.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["all-active-competition"],
    queryFn: fetchData,
  });

  const { data: session } = authClient.useSession();

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-start">
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
        className="h-12 px-4 max-w-xl w-[95%] fixed bottom-18 text-white"
        onClick={() => navigate("mango-set/create-new-competition")}
      >
        Create new competition
      </Button>
    </div>
  );
}
