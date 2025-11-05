import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopScore from "./top-score";
import ManGoSet from "./man-go-set";
import AllCompetition from "./competion";
import RankTables from "../leaderboard";
// import { useState } from "react";

export default function DetioScore() {
  // const [selectedTab, setSelectedTab] = useState("all-competions");
  return (
    <div className="flex justify-center gap-8 relative items-start">
      <div className="h-full min-h-[80vh] w-[98%] flex justify-center items-start max-w-4xl border bg-auto shadow-2xl rounded-sm my-2 pt-6 pb-20 mx-auto md:mx-0">
        <div className="flex flex-col w-full">
          <Tabs defaultValue="all-competions">
            <TabsList className="rounded-none max-w-3xl w-[95%] mx-auto ">
              <TabsTrigger
                value="all-competions"
                className="rounded-sm text-sm font-medium"
              >
                Competitions
              </TabsTrigger>
              <TabsTrigger
                value="top-score"
                className="rounded-sm text-sm font-medium"
              >
                Top score
              </TabsTrigger>
              <TabsTrigger
                value="mango-set"
                className="rounded-sm text-sm font-medium"
              >
                Man go set
              </TabsTrigger>
              <TabsTrigger
                value="league"
                className="rounded-sm text-sm font-medium"
              >
                League
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all-competions">
              <AllCompetition />
            </TabsContent>
            <TabsContent value="top-score" className="w-full">
              <TopScore />
            </TabsContent>
            <TabsContent value="mango-set" className="w-full">
              <ManGoSet />
            </TabsContent>
            <TabsContent value="league" className="w-full">
              <div className="text-center text-xl font-semibold">
                Coming soon
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="hidden md:block h-120">
        <div>
          <h2 className="text-lg font-semibold mb-4">Global Rankings</h2>
        </div>
        <RankTables />
      </div>
    </div>
  );
}
