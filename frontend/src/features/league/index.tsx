import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/api-config";
import { LoginDialog } from "../auth/popup";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import type { Country, Leagues } from "../football/type";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function League() {
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  async function fetchCountries() {
    const response = await apiClient.get("/livescore/get-countries");
    return response.data;
  }

  const { data } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const countries: Country[] = data?.response;

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [session, isPending]);

  return (
    <div className="h-full w-full max-w-3xl mx-auto flex justify-center items-center">
      <div className="flex flex-col justify-center items-start w-full">
        <Accordion type="single" collapsible className="w-full">
          {countries?.map((country, index) => (
            <CountryCard country={country} key={index} />
          ))}
        </Accordion>
      </div>
      <LoginDialog open={open} />
    </div>
  );
}

function CountryCard({ country }: { country: Country }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  async function fetchLeagues() {
    const response = await apiClient.get(
      `/livescore/get-leagues?country=${country?.name}`
    );
    return response.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["leagues", country?.name],
    queryFn: fetchLeagues,
    enabled: isOpen, // only fetch when accordion is open
  });

  const leagues: Leagues[] = data?.response ?? [];

  return (
    <AccordionItem value={country.name} className="m-4 border rounded-md">
      <AccordionTrigger
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-12 px-6 items-center"
      >
        <div className="flex items-center gap-2 text-sm font-medium h-full">
          <LazyLoadImage
            src={country.flag}
            alt={country.name}
            className="w-5 h-5 rounded-sm"
          />
          <span>{country.name}</span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="flex flex-col gap-4 text-sm px-4 pb-4">
        {isLoading && (
          <Loader2 className="animate-spin rounded-full h-5 w-5 mx-auto mb-4" />
        )}

        {!isLoading &&
          leagues.map((league: Leagues) => (
            <div
              key={league.league.id}
              className="flex items-center gap-3 p-2 border rounded-md hover:bg-muted"
              onClick={() =>
                navigate(league.league.name, { state: league as Leagues })
              }
            >
              <LazyLoadImage
                src={league.league.logo}
                alt={league.league.name}
                className="w-6 h-6 object-contain"
              />
              <span>{league.league.name}</span>
            </div>
          ))}

        {!isLoading && leagues.length === 0 && (
          <span className="text-muted-foreground">No leagues found</span>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
