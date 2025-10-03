import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopScore from "./top-score";
import ManGoSet from "./man-go-set";
import { authClient } from "@/lib/auth-client";
import { LoginDialog } from "../auth/popup";
import { useEffect, useState } from "react";
import AllCompetition from "./competion";

export default function DetioScore() {
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [session, isPending]);

  return (
    <div className="h-full min-h-[80vh] w-[98%] flex justify-center items-start max-w-4xl border rounded-sm my-2 pt-6 pb-20 mx-auto">
      <div className="flex flex-col w-full">
        <Tabs defaultValue="all-competions">
          <TabsList className="rounded-sm max-w-2xl w-[95%] mx-auto ">
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
            <div className="text-center text-xl font-semibold">Coming soon</div>
          </TabsContent>
        </Tabs>
      </div>
      <LoginDialog open={open} />
    </div>
  );
}
