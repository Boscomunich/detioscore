import { createContext, useContext, useState, type ReactNode } from "react";
import type { Country, Leagues } from "../football/type";

type LeagueContextType = {
  league: Leagues | null;
  country: Country | null;
  setLeague: React.Dispatch<React.SetStateAction<Leagues | null>>;
  setCountry: React.Dispatch<React.SetStateAction<Country | null>>;
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
};

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export function LeagueProvider({ children }: { children: ReactNode }) {
  const [league, setLeague] = useState<Leagues | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  return (
    <LeagueContext.Provider
      value={{
        league,
        setLeague,
        country,
        setCountry,
        currentDate,
        setCurrentDate,
      }}
    >
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error("useLeague must be used within a LeagueProvider");
  }
  return context;
}
