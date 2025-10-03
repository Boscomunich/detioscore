import Dexie, { type Table } from "dexie";
import type { FixtureResponse } from "../football/type";

export interface FixtureEntity {
  fixtureId: number;
  date: string;
  status: string;
  venue: string;

  leagueId: number;
  leagueName: string;
  leagueCountry: string;

  homeTeamId: number;
  homeTeamName: string;
  homeTeamLogo: string;

  awayTeamId: number;
  awayTeamName: string;
  awayTeamLogo: string;

  goalsHome: number | null;
  goalsAway: number | null;
}

class FootballDB extends Dexie {
  fixtures!: Table<FixtureEntity, number>;

  constructor() {
    super("FootballApp");
    this.version(1).stores({
      fixtures: "fixtureId, leagueId, homeTeamId, awayTeamId",
    });
  }
}

const db = new FootballDB();

export async function saveFixture(apiFixture: FixtureResponse) {
  const normalized: FixtureEntity = {
    fixtureId: apiFixture.fixture.id,
    date: apiFixture.fixture.date,
    status: apiFixture.fixture.status.long,
    venue: apiFixture.fixture.venue?.name || "Unknown",

    leagueId: apiFixture.league.id,
    leagueName: apiFixture.league.name,
    leagueCountry: apiFixture.league.country,

    homeTeamId: apiFixture.teams.home.id,
    homeTeamName: apiFixture.teams.home.name,
    homeTeamLogo: apiFixture.teams.home.logo,

    awayTeamId: apiFixture.teams.away.id,
    awayTeamName: apiFixture.teams.away.name,
    awayTeamLogo: apiFixture.teams.away.logo,

    goalsHome: apiFixture.goals.home,
    goalsAway: apiFixture.goals.away,
  };

  await db.fixtures.put(normalized);
}

export async function getFixtures(): Promise<FixtureEntity[]> {
  return await db.fixtures.toArray();
}

export async function getFixtureById(
  id: number
): Promise<FixtureEntity | undefined> {
  return await db.fixtures.get(id);
}

export async function updateFixture(
  fixtureId: number,
  updates: Partial<FixtureEntity>
): Promise<void> {
  await db.fixtures.update(fixtureId, updates);
}

export async function deleteFixture(fixtureId: number): Promise<void> {
  await db.fixtures.delete(fixtureId);
}

export async function clearAllFixtures(): Promise<void> {
  await db.fixtures.clear();
}
