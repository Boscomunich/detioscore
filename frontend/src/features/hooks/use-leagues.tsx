import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Country, FixtureResponse, Leagues } from "../football/type";
import {
  deleteFixture,
  getFixtureById,
  getFixtures,
  saveFixture,
} from "../favourite/database";

type LeagueContextType = {
  league: Leagues | null;
  country: Country | null;
  setLeague: React.Dispatch<React.SetStateAction<Leagues | null>>;
  setCountry: React.Dispatch<React.SetStateAction<Country | null>>;
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  favouriteIds: Set<number>;
  toggleFavourite: (id?: number, fixture?: FixtureResponse) => Promise<void>;
};

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export function LeagueProvider({ children }: { children: ReactNode }) {
  const [league, setLeague] = useState<Leagues | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [favouriteIds, setFavouriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    let isMounted = true;

    async function loadFavourites() {
      const stored = await getFixtures();
      if (isMounted) setFavouriteIds(new Set(stored.map((f) => f.fixtureId)));
    }

    loadFavourites();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFavourite = async (id?: number, fixture?: FixtureResponse) => {
    if (!id && !fixture) return;

    const fixtureId = id ?? fixture!.fixture.id;
    const exists = await getFixtureById(fixtureId);

    if (exists) {
      await deleteFixture(fixtureId);
      setFavouriteIds((prev) => {
        const copy = new Set(prev);
        copy.delete(fixtureId);
        return copy;
      });
    } else {
      if (fixture) {
        await saveFixture(fixture);
      } else {
        console.warn(
          `Cannot save fixture ${fixtureId}: full fixture data not provided`
        );
        return;
      }
      setFavouriteIds((prev) => new Set(prev).add(fixtureId));
    }
  };

  return (
    <LeagueContext.Provider
      value={{
        league,
        setLeague,
        country,
        setCountry,
        currentDate,
        setCurrentDate,
        favouriteIds,
        toggleFavourite,
      }}
    >
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  const context = useContext(LeagueContext);
  if (!context)
    throw new Error("useLeague must be used within a LeagueProvider");
  return context;
}
