import { ChevronLeft, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLeague } from "../hooks/use-leagues";
import { apiClient } from "@/api-config";
import { useQuery } from "@tanstack/react-query";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import type { Country, Leagues } from "@/types/football";

export default function CountriesCard({
  onCloseSheet,
}: {
  onCloseSheet?: () => void;
}) {
  const { country, setCountry, setLeague } = useLeague();
  const [isCountrySelected, setIsCountrySelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (country) setIsCountrySelected(true);
  }, [country]);

  async function fetchCountries() {
    const response = await apiClient.get("/livescore/countries");
    return response.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  function handleCountryToggle(country: Country) {
    if (isCountrySelected) {
      setCountry(null);
      setLeague(null);
      setIsCountrySelected(false);
      setSearchQuery("");
    } else {
      setCountry(country);
      setIsCountrySelected(true);
    }
  }

  const filteredCountries =
    data?.response?.filter((country: Country) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const countryName = country.name.toLowerCase();
      return query.split("").every((char) => countryName.includes(char));
    }) || [];

  if (isCountrySelected) {
    return (
      <div className="md:max-w-xs p-4 bg-auto rounded-sm w-full pb-2 min-h-[400px]">
        <CountryLeagues
          handleCountryToggle={handleCountryToggle}
          onCloseSheet={onCloseSheet}
        />
      </div>
    );
  }

  return (
    <div className="md:max-w-xs p-4 bg-auto rounded-sm w-full pb-2">
      <div className="flex items-center justify-between my-4 p-2">
        <div className="flex relative w-full max-w-md items-center">
          <Search className="absolute left-1.5 z-[10] top-2.5 size-4" />
          <Input
            placeholder="Search countries"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 text-xs backdrop-blur-sm border-border/75 hover:border-primary/50 focus-visible:ring-primary/20"
            autoFocus={false}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center w-full py-10 min-h-[300px]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredCountries.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No countries found
            </div>
          ) : (
            filteredCountries.map((data: Country, index: number) => (
              <div
                onClick={() => handleCountryToggle(data)}
                className={cn(
                  "flex items-center justify-start gap-4 p-3 cursor-pointer rounded-sm mx-1 hover:bg-muted text-sm font-medium",
                  data.name === country?.name && "bg-muted"
                )}
                key={index}
              >
                <LazyLoadImage
                  src={data.name === "World" ? "/assets/world.png" : data?.flag}
                  className="size-5"
                  loading="lazy"
                />
                {data.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function CountryLeagues({
  handleCountryToggle,
}: {
  handleCountryToggle: (country: Country) => void;
  onCloseSheet?: () => void;
}) {
  const navigate = useNavigate();
  const { country } = useLeague();

  async function fetchCountries() {
    const response = await apiClient.get(
      `/livescore/leagues?country=${country?.name}`
    );
    return response.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["leagues", country],
    queryFn: fetchCountries,
    enabled: !!country,
  });

  const leagueData: Leagues[] = data?.response ?? [];

  return (
    <div className="overflow-hidden w-full bg-auto p-4">
      {isLoading ? (
        <div className="flex justify-center items-center w-full py-10 min-h-[300px]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-4 p-1 cursor-pointer px-2 h-20 text-sm font-medium mb-2">
            <div onClick={() => handleCountryToggle(country!)}>
              <ChevronLeft />
            </div>
            <div className="flex w-[70%] justify-end gap-2 items-center">
              <LazyLoadImage
                src={country?.flag || "/assets/world.png"}
                className="size-5"
                loading="lazy"
              />
              {country?.name}
            </div>
          </div>

          {/* Leagues list */}
          <div className="flex flex-col gap-4">
            {leagueData.map((data, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-start gap-4 p-3 cursor-pointer mx-1 hover:bg-muted text-sm font-medium"
                )}
                onClick={() =>
                  navigate(`/league/${data.league.name}`, {
                    state: data,
                  })
                }
              >
                <LazyLoadImage
                  src={data.league.logo}
                  className="size-5"
                  loading="lazy"
                />
                {data.league.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
