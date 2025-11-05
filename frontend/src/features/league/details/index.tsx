import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Leagues } from "@/types/football";
import { useLocation, useNavigate } from "react-router";
import LeagueTable from "./table";
import Fixtures from "./fixtures";
import PlayerStats from "./player-stats";
import { ChevronLeft } from "lucide-react";
import MatchesCarousel from "./recent-fixtures";

export default function LeagueDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const league: Leagues = state;

  return (
    <Tabs defaultValue="table">
      <div className="w-[98%] flex flex-col gap-8 max-w-7xl mx-auto rounded-sm md:p-4 p-2">
        <div className="px-4 md:px-12 pt-4 rounded-sm bg-auto h-48 relative">
          <div
            className="text-base font-semibold cursor-pointer flex gap-2 mb-6"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft /> Back
          </div>
          <div className="flex justify-start items-center gap-5 mt-4">
            <img src={league.league.logo} className="size-16" />
            <div className="">
              <h1 className="text-lg md:text-3xl font-semibold">
                {league.league.name}
              </h1>
              <p className="text-sm md:text-xl font-[400]">
                {league.country.name}
              </p>
            </div>
          </div>
          <TabsList className="max-w-xl bg-transparent absolute -bottom-1">
            <TabsTrigger
              value="table"
              className="rounded-sm text-base md:text-xl font-semibold"
            >
              <span className="px-4">Table</span>
            </TabsTrigger>
            <TabsTrigger
              value="fixtures"
              className="rounded-sm text-base md:text-xl  font-semibold"
            >
              <span className="px-4">Fixtures</span>
            </TabsTrigger>
            <TabsTrigger
              value="player-stats"
              className="rounded-sm text-base md:text-xl  font-semibold"
            >
              <span className="px-4">Stats</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <MatchesCarousel league={league} />
        <TabsContent value="table" className="w-full">
          <LeagueTable league={league} />
        </TabsContent>
        <TabsContent value="fixtures" className="w-full">
          <Fixtures league={league} />
        </TabsContent>
        <TabsContent value="player-stats" className="w-full">
          <PlayerStats league={league} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
