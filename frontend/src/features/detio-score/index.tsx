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
    <div className="h-full min-h-[80vh] w-full flex justify-center items-start max-w-4xl border rounded-sm my-2 py-6 mx-auto">
      <div className="flex flex-col w-full">
        <Tabs defaultValue="all-competions">
          <TabsList className="rounded-sm max-w-2xl w-full mx-auto">
            <TabsTrigger value="all-competions" className="rounded-sm ">
              Competitions
            </TabsTrigger>
            <TabsTrigger value="top-score" className="rounded-sm">
              Top score
            </TabsTrigger>
            <TabsTrigger value="mango-set" className="rounded-sm">
              Man go set
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
        </Tabs>
      </div>
      <LoginDialog open={open} />
    </div>
  );
}
