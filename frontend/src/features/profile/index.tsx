import { useEffect, useState } from "react";
import { LoginDialog } from "../auth/popup";
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

export default function Profile() {
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
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

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [session, isPending]);

  return (
    <div className="h-full w-[98%] flex flex-col justify-center items-center max-w-3xl px-4 rounded-sm my-2 pb-6 mx-auto gap-4">
      <div className="w-full max-w-2xl flex items-center justify-between h-20">
        <div>
          <p className="text-xs font-extralight">Total balance</p>
          <h1 className="text-lg font-bold">0 DC</h1>
        </div>
        <Link to="/notifications">
          <Bell className="size-8" />
        </Link>
      </div>

      {/* profile section*/}
      <div className="w-full flex flex-col items-center">
        <h1 className="text-lg font-medium w-full max-w-2xl text-left">
          Profile
        </h1>
        <Card className="w-full max-w-2xl mt-1">
          <CardContent>
            <div className="flex justify-start items-center gap-4">
              <Avatar className="rounded-full bg-secondary size-10 flex justify-center items-center">
                <AvatarImage src={user?.image ?? ""} alt="" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <h1 className="text-base font-semibold">{user?.name}</h1>
            </div>
            <hr className="h-1 w-full my-4" />
            <ChangeUsernameDialog />
          </CardContent>
        </Card>
      </div>

      {/* coins section*/}
      <div className="w-full flex flex-col items-center">
        <h1 className="text-lg font-medium w-full max-w-2xl text-left">
          Transaction
        </h1>
        <Card className="w-full max-w-2xl mt-1">
          <CardContent className="">
            <Link to="/deposit" className="text-base font-semibold">
              Deposit
            </Link>
            <hr className="h-1 w-full my-4" />
            <Link to="/withdraw" className="text-base font-semibold">
              withdraw
            </Link>
            <hr className="h-1 w-full my-4" />
            <Link to="/transaction-history" className="text-base font-semibold">
              Transaction History
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
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Active Comeptition</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <ActiveCompetition />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <hr className="h-1 w-full my-4" />
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Inactive Comeptition</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <InActiveCompetition />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
      <LoginDialog open={open} />
    </div>
  );
}
