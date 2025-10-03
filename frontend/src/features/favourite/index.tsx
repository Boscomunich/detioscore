import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { LoginDialog } from "../auth/popup";
import { Loader2 } from "lucide-react";
import { getFixtures, type FixtureEntity } from "./database";
import ScoreCard from "./scorecard";

export default function Favourite() {
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
    <div className="h-full w-full max-w-3xl flex justify-center items-center mx-auto">
      <FixturesCard />
      <LoginDialog open={open} />
    </div>
  );
}

function FixturesCard() {
  const [fixtures, setFixtures] = useState<FixtureEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all fixtures from IndexedDB on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchFixtures() {
      const storedFixtures = await getFixtures();
      if (isMounted) {
        setFixtures(storedFixtures);
        setIsLoading(false);
      }
    }

    fetchFixtures();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full p-4">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : fixtures.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground">
          No favourite fixtures saved.
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4 w-full justify-start items-center border rounded-sm my-2 p-4 mx-auto">
          {fixtures.map((fixture) => (
            <ScoreCard key={fixture.fixtureId} fixture={fixture} />
          ))}
        </div>
      )}
    </div>
  );
}
