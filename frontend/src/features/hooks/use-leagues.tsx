import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Country, FixtureResponse, Leagues } from "../../types/football";
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
      if (isMounted) {
        // Use fixture.fixture.id instead of fixtureId
        setFavouriteIds(new Set(stored.map((f) => f.fixture.id)));
      }
    }

    loadFavourites();

    return () => {
      isMounted = false;
    };
  }, []);

  async function toggleFavourite(id?: number, fixture?: FixtureResponse) {
    if (!id && !fixture) return;
    const fixtureId = id ?? fixture!.fixture.id;

    try {
      // Check if the fixture already exists in IndexedDB
      const existing = await getFixtureById(fixtureId);

      if (existing) {
        // Remove from DB
        await deleteFixture(fixtureId);

        // Update UI state
        setFavouriteIds((prev) => {
          const updated = new Set(prev);
          updated.delete(fixtureId);
          return updated;
        });
      } else {
        // Add to DB only if full fixture data is provided
        if (fixture) {
          setFavouriteIds((prev) => {
            const updated = new Set(prev);
            updated.add(fixtureId);
            return updated;
          });
          await saveFixture(fixture);
        } else {
          console.warn(
            `Cannot save fixture ${fixtureId}: full fixture data not provided`
          );
        }
      }
    } catch (err) {
      console.error("Error toggling favourite:", err);
    }
  }

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
