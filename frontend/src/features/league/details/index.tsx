import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Leagues } from "@/features/football/type";
import { useLocation, useNavigate } from "react-router";

export default function LeagueDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const league: Leagues = state;
  return (
    <div className="bg-primary w-full relative -top-2 md:-top-8 px-4 md:px-12 pt-4">
      <div
        className="text-base font-semibold cursor-pointer text-white"
        onClick={() => navigate(-1)}
      >
        ← Back
      </div>
      <div className="flex justify-start items-center gap-5 mt-4">
        <img src={league.league.logo} className="size-8" />
        <div className="text-white">
          <h1 className="text-lg font-semibold">{league.league.name}</h1>
          <p className="text-sm font-[400]">{league.country.name}</p>
        </div>
      </div>
      <Tabs defaultValue="all-competions" className="">
        <TabsList className="rounded-sm max-w-2xl w-[95%] bg-transparent">
          <TabsTrigger
            value="all-competions"
            className="rounded-sm text-sm font-medium text-white dark:text-white"
          >
            Table
          </TabsTrigger>
          <TabsTrigger
            value="top-score"
            className="rounded-sm text-sm font-medium text-white dark:text-white"
          >
            Fixtures
          </TabsTrigger>
          <TabsTrigger
            value="mango-set"
            className="rounded-sm text-sm font-medium text-white dark:text-white"
          >
            Player Stats
          </TabsTrigger>
          <TabsTrigger
            value="league"
            className="rounded-sm text-sm font-medium text-white dark:text-white"
          >
            Team Stats
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all-competions"></TabsContent>
        <TabsContent value="top-score" className="w-full"></TabsContent>
        <TabsContent value="mango-set" className="w-full"></TabsContent>
        <TabsContent value="league" className="w-full"></TabsContent>
      </Tabs>
    </div>
  );
}
