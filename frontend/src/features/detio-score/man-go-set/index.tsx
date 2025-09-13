import { authApiClient } from "@/api-config";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import CompetitionCard from "../competition-card";
import type { Competition } from "../type";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManGoSet() {
  const navigate = useNavigate();

  async function fetchData() {
    const response = await authApiClient.get("/man-go-set/active-competition");
    return response.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["man-go-set-active"],
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
