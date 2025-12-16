import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Bell } from "lucide-react";
import { ChangeUsernameDialog } from "./username";
import ActiveCompetition from "./competition/active-competition";
import InActiveCompetition from "./competition/inactive-competition";
import { ChangePasswordDialog } from "./change-password";
import UserRank from "./user-rank";
import { useQuery } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  let initials = "";
  if (user?.name) {
    const words = user.name.trim().split(" ");
    if (words.length === 1) {
      initials = words[0].substring(0, 2).toUpperCase();
    } else {
      initials = (words[0][0] + words[1][0]).toUpperCase();
    }
  }

  const { data } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const res = await authApiClient.get(`/user/wallet/`);
      return res.data;
    },
  });

  const { data: count } = useQuery({
    queryKey: ["notification count"],
    queryFn: async () => {
      const res = await authApiClient.get(`/notification/count/`);
      return res.data;
    },
  });

  return (
    <div className="h-full w-[98%] flex flex-col justify-center items-center max-w-3xl px-4 rounded-sm my-2 pb-6 mx-auto gap-4">
      <div className="w-full max-w-2xl flex items-center justify-between h-20">
        <div>
          <p className="text-xs font-extralight">Total balance</p>
          <h1 className="text-lg font-bold">{data?.wallet.balance || 0} DC</h1>
        </div>
        <Link to="/notifications" className="relative">
          <Bell className="size-8" />
          {count?.unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-2 size-5 rounded-full flex justify-center items-center p-0"
            >
              {count?.unreadCount}
            </Badge>
          )}
        </Link>
      </div>

      {/* profile section*/}
      <div className="w-full flex flex-col items-center">
        <h1 className="text-lg font-medium w-full max-w-2xl text-left">
          Profile
        </h1>
        <Card className="w-full max-w-2xl mt-1">
          <CardContent>
            <Accordion type="single" collapsible className="w-full py-2">
              <AccordionItem value="item-1">
                <AccordionTrigger className="mb-4 text-base font-semibold">
                  <div className="flex justify-start items-center gap-4">
                    <Avatar className="rounded-full bg-secondary size-10 flex justify-center items-center">
                      <AvatarImage src={user?.image ?? ""} alt="" />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-base font-semibold">{user?.name}</h1>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <UserRank />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <hr className="h-1 w-full" />
            <ChangeUsernameDialog />
            <hr className="h-1 w-full" />
            <Accordion type="multiple" className="w-full py-2">
              <AccordionItem value="item-2">
                <AccordionTrigger className="mb-4 text-base font-semibold">
                  Account Information
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">ID:</span>
                    <span>{user?.id}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* coins section*/}
      <div className="w-full flex flex-col items-center">
        <h1 className="text-lg font-medium w-full max-w-2xl text-left">
          Transaction
        </h1>
        <Card className="w-full max-w-2xl mt-1">
          <CardContent className=" w-full">
            <Link to="/deposit" className="text-base font-semibold">
              <h1 className="w-full py-4">Deposit</h1>
            </Link>
            <hr className="h-1 w-full" />
            <Link to="/withdraw" className="text-base font-semibold">
              <h1 className="w-full py-4">withdraw</h1>
            </Link>
            <hr className="h-1 w-full" />
            <Link to="/transaction-history" className="text-base font-semibold">
              <h1 className="w-full py-4">Transaction History</h1>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* competition section*/}
      <div className="w-full flex flex-col items-center">
        <h1 className="text-lg font-medium w-full max-w-2xl text-left">
          Competition
        </h1>
        <Card className="w-full max-w-2xl mt-1">
          <CardContent className="">
            <Accordion type="single" collapsible className="w-full py-4">
              <AccordionItem value="item-1">
                <AccordionTrigger className="mb-4 text-base font-semibold">
                  Active Comeptition
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <ActiveCompetition />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <hr className="h-1 w-full" />
            <Accordion type="single" collapsible className="w-full py-4">
              <AccordionItem value="item-1">
                <AccordionTrigger className="mb-4 text-base font-semibold">
                  Inactive Comeptition
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <InActiveCompetition />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <hr className="h-1 w-full" />
            <Link to="/achievements" className="text-base font-semibold">
              <h1 className="w-full py-4">Achievements</h1>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* settings section*/}
      <div className="w-full flex flex-col items-center">
        <h1 className="text-lg font-medium w-full max-w-2xl text-left">
          Settings
        </h1>
        <Card className="w-full max-w-2xl mt-1">
          <CardContent className="">
            <ChangePasswordDialog />
            <hr className="h-1 w-full my-4" />
            <div className="flex justify-start items-center gap-4">
              <Button onClick={() => authClient.signOut()}>Signout</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
