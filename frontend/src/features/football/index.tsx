import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Standing from "./standing";
import ResultsCard from "./results-card";
import Fixtures from "./fixtures";
import { useLeague } from "../hooks/use-leagues";

export function LeagueTabs() {
  const { league } = useLeague();
  const [activeTab, setActiveTab] = useState("fixtures");

  useEffect(() => {
    setActiveTab("fixtures");
  }, [league?.league.id]);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {league?.league.id && (
          <TabsList className="rounded-sm mx-2">
            <TabsTrigger value="fixtures" className="rounded-sm">
              Fixtures
            </TabsTrigger>
            <TabsTrigger value="results" className="rounded-sm">
              Results
            </TabsTrigger>
            <TabsTrigger value="standing" className="rounded-sm">
              Standing
            </TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="fixtures">
          <Fixtures />
        </TabsContent>
        <TabsContent value="results">
          <ResultsCard />
        </TabsContent>
        <TabsContent value="standing">
          <Standing />
        </TabsContent>
      </Tabs>
    </div>
  );
}
