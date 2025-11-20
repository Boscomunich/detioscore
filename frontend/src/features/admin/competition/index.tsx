import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InActiveCompetitions from "./inactive-competition";
import ActiveCompetitions from "./active-competition";

export default function Competitions() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Competitions
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage and monitor all competitions
          </p>
        </div>
      </div>
      <Tabs defaultValue="active-competions">
        <TabsList className="rounded-none max-w-3xl w-[95%] mx-auto ">
          <TabsTrigger
            value="active-competions"
            className="rounded-sm text-sm font-medium"
          >
            Active Competitions
          </TabsTrigger>
          <TabsTrigger
            value="inactive-competitions"
            className="rounded-sm text-sm font-medium"
          >
            Inactive Competitions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active-competions">
          <ActiveCompetitions />
        </TabsContent>
        <TabsContent value="inactive-competitions" className="w-full">
          <InActiveCompetitions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
