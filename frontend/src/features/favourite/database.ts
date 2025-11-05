import Dexie, { type Table } from "dexie";
import type { FixtureResponse } from "../../types/football";

export interface StoredFixture extends FixtureResponse {
  fixtureId: number;
}

class FootballDB extends Dexie {
  fixtures!: Table<StoredFixture, number>;

  constructor() {
    super("FootballApp");
    this.version(2).stores({
      fixtures: "fixtureId, league.id, teams.home.id, teams.away.id",
    });
  }
}

const db = new FootballDB();
export default db;

/**
 * Save a fixture into IndexedDB.
 * Adds a top-level `fixtureId` for Dexie key.
 */
export async function saveFixture(fixture: FixtureResponse): Promise<void> {
  const record: StoredFixture = {
    ...fixture,
    fixtureId: fixture.fixture.id,
  };

  await db.fixtures.put(record);
}

/**
 * Get all fixtures
 */
export async function getFixtures(): Promise<StoredFixture[]> {
  return await db.fixtures.toArray();
}

/**
 * Get a fixture by its ID
 */
export async function getFixtureById(
  id: number
): Promise<StoredFixture | undefined> {
  return await db.fixtures.get(id);
}

/**
 * Update a fixture partially
 */
export async function updateFixture(
  id: number,
  updates: Partial<StoredFixture>
): Promise<void> {
  await db.fixtures.update(id, updates);
}

/**
 * Delete a fixture by its ID
 */
export async function deleteFixture(id: number): Promise<void> {
  await db.fixtures.delete(id);
}

/**
 * Clear all fixtures
 */
export async function clearAllFixtures(): Promise<void> {
  await db.fixtures.clear();
}
