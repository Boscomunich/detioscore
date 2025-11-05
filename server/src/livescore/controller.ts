// import {
//   Country,
//   FixturesResponse,
//   FootballApiResponse,
//   League,
// } from "./types";
// import { fetchFootballData } from "./utils";
// import { Request, Response } from "express";
// import { StandingsResponse } from "./types";
// import client from "../redis";

// type CountriesResponse = FootballApiResponse<Country>;

// const POPULAR_LEAGUE_COUNTRIES = [
//   "England",
//   "Spain",
//   "Germany",
//   "Italy",
//   "France",
//   "Portugal",
//   "Netherlands",
//   "Belgium",
//   "Scotland",
//   "Turkey",
// ];

// export async function fetchAllCountries(req: Request, res: Response) {
//   try {
//     const cachedData = await client.get("active-countries-new-sorted");
//     if (cachedData) {
//       return res.status(200).json(JSON.parse(cachedData));
//     }

//     const response = await fetchFootballData<Country[]>("countries");
//     const result: CountriesResponse = response.data;

//     // Sort countries before fetching leagues
//     const sortedCountryList = [...result.response].sort((a, b) => {
//       const aPopular = POPULAR_LEAGUE_COUNTRIES.includes(a.name);
//       const bPopular = POPULAR_LEAGUE_COUNTRIES.includes(b.name);

//       if (aPopular && bPopular) {
//         return (
//           POPULAR_LEAGUE_COUNTRIES.indexOf(a.name) -
//           POPULAR_LEAGUE_COUNTRIES.indexOf(b.name)
//         );
//       }
//       if (aPopular) return -1;
//       if (bPopular) return 1;

//       return a.name.localeCompare(b.name);
//     });

//     const countriesWithLeagues = (
//       await Promise.all(
//         sortedCountryList.map(async (country) => {
//           try {
//             const leaguesResponse = await fetchFootballData<League[]>(
//               "leagues",
//               {
//                 country: country.name,
//                 current: "true",
//               }
//             );

//             const leagues = leaguesResponse.data.response.map((league) => ({
//               ...league,
//               isCurrent: league.seasons?.some((s) => s.current) ?? false,
//               isUpcoming:
//                 league.seasons?.some((s) => new Date(s.start) > new Date()) ??
//                 false,
//             }));

//             return {
//               ...country,
//               leagues,
//               hasActiveLeagues: leagues.some(
//                 (l) => l.isCurrent || l.isUpcoming
//               ),
//               isPopular: POPULAR_LEAGUE_COUNTRIES.includes(country.name),
//             };
//           } catch (error) {
//             console.warn(`Failed to fetch leagues for ${country.name}:`, error);
//             return null;
//           }
//         })
//       )
//     ).filter(
//       (country): country is NonNullable<typeof country> =>
//         country !== null &&
//         country.leagues.length > 0 &&
//         country.hasActiveLeagues
//     );

//     const finalResult = {
//       ...result,
//       response: countriesWithLeagues,
//       results: countriesWithLeagues.length,
//     };

//     await client.set(
//       "active-countries-new-sorted",
//       JSON.stringify(finalResult),
//       {
//         expiration: { type: "EX", value: 21600 },
//       }
//     );

//     return res.status(200).json(finalResult);
//   } catch (error) {
//     console.error("Failed to fetch countries:", error);
//     return res.status(500).json({ error: "Failed to fetch countries" });
//   }
// }

// export async function fetchLeagueStandings(req: Request, res: Response) {
//   try {
//     const { leagueId, season } = req.query;
//     const key = `standings-${leagueId}-${season}`;

//     //checks our chache for existing data
//     const cachedData = await client.get(key);
//     if (cachedData) {
//       const processedData = JSON.parse(cachedData) as StandingsResponse;
//       return res.status(200).json(processedData);
//     }

//     //makes api request and cache data if cache doesnt exist
//     const response = await fetchFootballData("standings", {
//       league: leagueId as string,
//       season: season as string,
//     });

//     const result = response.data;
//     await client.set(key, JSON.stringify(result), {
//       expiration: {
//         type: "EX",
//         value: 2700,
//       },
//     });
//     return res.status(200).json(result);
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function fetchFixturesRounds(req: Request, res: Response) {
//   try {
//     const { leagueId, season } = req.query;
//     const key = `rounds-${leagueId}-${season}`;
//     const cachedData = await client.get(key);
//     if (cachedData) {
//       const processedData = JSON.parse(cachedData) as StandingsResponse;
//       return res.status(200).json(processedData);
//     }
//     const response = await fetchFootballData("fixtures/rounds", {
//       league: leagueId as string,
//       season: season as string,
//     });
//     const result = response.data;
//     await client.set(key, JSON.stringify(result), {
//       expiration: {
//         type: "EX",
//         value: 86400,
//       },
//     });
//     return res.status(200).json(result);
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function fetchFixtures(req: Request, res: Response) {
//   try {
//     const { leagueId, season, round, date, status } = req.query;

//     const key = `fixtures-${leagueId}-${season}`;
//     const cachedData = await client.get(key);

//     if (cachedData) {
//       const processedData = JSON.parse(cachedData) as StandingsResponse;
//       return res.status(200).json(processedData);
//     }

//     // Build query object conditionally
//     const query: Record<string, string> = {
//       league: leagueId as string,
//       season: season as string,
//     };

//     if (round) {
//       query.round = round as string;
//     }

//     if (date) {
//       query.date = date as string;
//     }

//     if (status) {
//       query.status = status as string;
//     }

//     const response = await fetchFootballData("fixtures", query);
//     const result = response.data;

//     await client.set(key, JSON.stringify(result), {
//       expiration: {
//         type: "EX",
//         value: 86400,
//       },
//     });

//     return res.status(200).json(result);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to fetch fixtures" });
//   }
// }

// export async function fetchLiveFixtures(req: Request, res: Response) {
//   try {
//     let { leagueId, season } = req.query;

//     if (leagueId === "undefined" || leagueId === "null" || !leagueId) {
//       leagueId = undefined;
//     }

//     if (season === "undefined" || season === "null" || !season) {
//       season = undefined;
//     }

//     const query: Record<string, string> = {
//       live: "all",
//     };

//     const key = `livefixtures-${leagueId || "all"}`;

//     const cachedData = await client.get(key);
//     if (cachedData) {
//       const processedData = JSON.parse(cachedData) as FixturesResponse;
//       return res.status(200).json(processedData);
//     }

//     if (leagueId) {
//       query.league = leagueId as string;
//     }

//     if (season) {
//       query.season = season as string;
//     }

//     const fixtures = await fetchFootballData<League[]>("fixtures", query);
//     const result = fixtures.data;
//     await client.set(key, JSON.stringify(result), {
//       expiration: {
//         type: "EX",
//         value: 60,
//       },
//     });
//     return res.status(200).json(result);
//   } catch (error) {
//     return res.status(500).json({ error: "Failed to fetch live fixtures" });
//   }
// }

// export async function fetchDailyFixtures(req: Request, res: Response) {
//   try {
//     let { leagueId, date, season } = req.query;

//     if (leagueId === "undefined" || leagueId === "null" || !leagueId) {
//       leagueId = undefined;
//     }

//     if (season === "undefined" || season === "null" || !season) {
//       season = undefined;
//     }

//     const query: Record<string, string> = {
//       date: date as string,
//     };
//     const key = `dailyfixtures-${leagueId || "all"}-${date}-${season || ""}`;

//     const cachedData = await client.get(key);
//     if (cachedData) {
//       const processedData = JSON.parse(cachedData) as StandingsResponse;
//       return res.status(200).json(processedData);
//     }

//     if (leagueId) {
//       query.league = leagueId as string;
//     }

//     if (season) {
//       query.season = season as string;
//     }

//     const response = await fetchFootballData("fixtures", query);
//     const result = response.data;
//     await client.set(key, JSON.stringify(result), {
//       expiration: {
//         type: "EX",
//         value: 900,
//       },
//     });
//     return res.status(200).json(result);
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function fetchLineUps(req: Request, res: Response) {
//   try {
//     const { fixtureId, isConfirmationTime } = req.query;
//     const key = `lineups-${fixtureId}`;

//     const isConfirmed = isConfirmationTime === "true";

//     //checks wheather lineups are confirmed
//     if (isConfirmed) {
//       const key = `lineups-${fixtureId}-confirmed`;
//       const cachedData = await client.get(key);
//       if (cachedData) {
//         const processedData = JSON.parse(cachedData) as any;
//         return res.status(200).json(processedData);
//       }
//       const response = await fetchFootballData("fixtures/lineups", {
//         fixture: fixtureId as string,
//       });
//       const result = response.data;
//       await client.set(key, JSON.stringify(result), {
//         expiration: {
//           type: "EX",
//           value: 900,
//         },
//       });
//       return res.status(200).json(result);
//     }

//     const cachedData = await client.get(key);
//     if (cachedData) {
//       const processedData = JSON.parse(cachedData) as any;
//       return res.status(200).json(processedData);
//     }
//     const response = await fetchFootballData("fixtures/lineups", {
//       fixture: fixtureId as string,
//     });
//     const result = response.data;
//     await client.set(key, JSON.stringify(result), {
//       expiration: {
//         type: "EX",
//         value: 27000,
//       },
//     });
//     return res.status(200).json(result);
//   } catch (error) {}
// }

// export async function fetchFixtureEvents(req: Request, res: Response) {
//   try {
//     const { id } = req.params;

//     const key = `fixture-event-${id}`;
//     const cachedData = await client.get(key);

//     if (cachedData) {
//       const processedData = JSON.parse(cachedData) as any;
//       return res.status(200).json(processedData);
//     }

//     const response = await fetchFootballData("fixtures/events", {
//       fixture: id as string,
//     });
//     const result = response.data;

//     await client.set(key, JSON.stringify(result), {
//       expiration: {
//         type: "EX",
//         value: 60,
//       },
//     });

//     return res.status(200).json(result);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to fetch fixtures" });
//   }
// }

import { Country, FootballApiResponse, LeagueResponse, League } from "./types";
import { fetchFootballData } from "./utils";
import { Request, Response } from "express";

type CountriesResponse = FootballApiResponse<Country>;
type LeaguesResponse = FootballApiResponse<LeagueResponse>;

const POPULAR_LEAGUE_COUNTRIES = [
  "England",
  "Spain",
  "Germany",
  "Italy",
  "France",
  "Portugal",
  "Netherlands",
  "Belgium",
  "Scotland",
  "Turkey",
];

export async function fetchAllCountries(req: Request, res: Response) {
  try {
    // 👇 Correct generic: <Country>, not <Country[]>
    const response = await fetchFootballData<Country>("countries");
    const result: CountriesResponse = response.data;

    // Sort: popular first, then alphabetically
    const sortedCountries = [...result.response].sort((a, b) => {
      const aPopular = POPULAR_LEAGUE_COUNTRIES.includes(a.name);
      const bPopular = POPULAR_LEAGUE_COUNTRIES.includes(b.name);

      if (aPopular && bPopular) {
        return (
          POPULAR_LEAGUE_COUNTRIES.indexOf(a.name) -
          POPULAR_LEAGUE_COUNTRIES.indexOf(b.name)
        );
      }
      if (aPopular) return -1;
      if (bPopular) return 1;

      return a.name.localeCompare(b.name);
    });

    return res.status(200).json({
      ...result,
      response: sortedCountries,
      results: sortedCountries.length,
    });
  } catch (error) {
    console.error("❌ Failed to fetch countries:", error);
    return res.status(500).json({ error: "Failed to fetch countries" });
  }
}

// Fetch Leagues by Country or League ID
export async function fetchLeagues(req: Request, res: Response) {
  try {
    const { country } = req.query;

    if (!country) {
      return res
        .status(400)
        .json({ error: "Missing required query param: country" });
    }

    // 👇 Correct generic: <LeagueResponse>, not <League[]>
    const leaguesResponse = await fetchFootballData<LeagueResponse>("leagues", {
      country: country as string,
      current: "true",
    });

    const result: LeaguesResponse = leaguesResponse.data;

    // Sort leagues by league.id
    const sortedLeagues = [...result.response].sort(
      (a, b) => a.league.id - b.league.id
    );

    return res.status(200).json({
      ...result,
      response: sortedLeagues,
    });
  } catch (error) {
    console.error("Failed to fetch leagues:", error);
    return res.status(500).json({ error: "Failed to fetch leagues" });
  }
}

// Fetch league standings
export async function fetchLeagueStandings(req: Request, res: Response) {
  try {
    const { leagueId, season } = req.query;

    const response = await fetchFootballData("standings", {
      league: leagueId as string,
      season: season as string,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch standings:", error);
    return res.status(500).json({ error: "Failed to fetch standings" });
  }
}

// Fetch fixtures rounds
export async function fetchFixturesRounds(req: Request, res: Response) {
  try {
    const { leagueId, season } = req.query;

    const response = await fetchFootballData("fixtures/rounds", {
      league: leagueId as string,
      season: season as string,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch fixture rounds:", error);
    return res.status(500).json({ error: "Failed to fetch fixture rounds" });
  }
}

// Fetch fixtures
export async function fetchFixtures(req: Request, res: Response) {
  try {
    const { leagueId, season, round, date, status, from, to } = req.query;

    const query: Record<string, string> = {
      league: leagueId as string,
      season: season as string,
    };

    if (round) query.round = round as string;
    if (date) query.date = date as string;
    if (status) query.status = status as string;
    if (from) query.from = from as string;
    if (to) query.to = to as string;

    const response = await fetchFootballData("fixtures", query);

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch fixtures:", error);
    return res.status(500).json({ error: "Failed to fetch fixtures" });
  }
}

// Fetch live fixtures
export async function fetchLiveFixtures(req: Request, res: Response) {
  try {
    let { leagueId, season } = req.query;

    if (leagueId === "undefined" || leagueId === "null" || !leagueId) {
      leagueId = undefined;
    }
    if (season === "undefined" || season === "null" || !season) {
      season = undefined;
    }

    const query: Record<string, string> = { live: "all" };
    if (leagueId) query.league = leagueId as string;
    if (season) query.season = season as string;

    const response = await fetchFootballData<League[]>("fixtures", query);

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch live fixtures:", error);
    return res.status(500).json({ error: "Failed to fetch live fixtures" });
  }
}

// Fetch daily fixtures
export async function fetchDailyFixtures(req: Request, res: Response) {
  try {
    let { leagueId, date, season, timezone } = req.query;

    if (leagueId === "undefined" || leagueId === "null" || !leagueId) {
      leagueId = undefined;
    }
    if (season === "undefined" || season === "null" || !season) {
      season = undefined;
    }

    const query: Record<string, string> = {
      date: date as string,
      timezone: timezone as string,
    };
    if (leagueId) query.league = leagueId as string;
    if (season) query.season = season as string;

    const response = await fetchFootballData("fixtures", query);

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch daily fixtures:", error);
    return res.status(500).json({ error: "Failed to fetch daily fixtures" });
  }
}

// Fetch lineups
export async function fetchLineUps(req: Request, res: Response) {
  try {
    const { fixtureId } = req.query;

    const response = await fetchFootballData("fixtures/lineups", {
      fixture: fixtureId as string,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch lineups:", error);
    return res.status(500).json({ error: "Failed to fetch lineups" });
  }
}

// Fetch fixture events
export async function fetchFixtureEvents(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const response = await fetchFootballData("fixtures/events", {
      fixture: id as string,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch fixture events:", error);
    return res.status(500).json({ error: "Failed to fetch fixture events" });
  }
}

//fetch current rounds of matches by league
export async function fetchCurrentFixtureRounds(req: Request, res: Response) {
  try {
    const { leagueId, season } = req.query;

    const response = await fetchFootballData("fixtures/rounds", {
      league: leagueId as string,
      season: season as string,
      current: "true",
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch fixture rounds:", error);
    return res.status(500).json({ error: "Failed to fetch fixture rounds" });
  }
}

//Fetch H2H data
export async function fetchFixtureH2H(req: Request, res: Response) {
  try {
    const { homeId, awayId } = req.query;

    const response = await fetchFootballData("fixtures/headtohead", {
      h2h: `${homeId}-${awayId}`,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch fixture head to head:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch fixture head to head" });
  }
}

//Fetch match statistics data
export async function fetchFixtureStatistics(req: Request, res: Response) {
  try {
    const { fixtureId } = req.query;

    const response = await fetchFootballData("fixtures/statistics", {
      fixture: fixtureId as string,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch fixture statistics:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch fixture statistics" });
  }
}

// fetch topscores for a league
export async function fetchTopScorers(req: Request, res: Response) {
  const { leagueId, season } = req.query;
  try {
    const response = await fetchFootballData("players/topscorers", {
      season: season as string,
      league: leagueId as string,
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch fixture statistics:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch fixture statistics" });
  }
}

//fetch top assisters for a league
export async function fetchTopAssisters(req: Request, res: Response) {
  const { leagueId, season } = req.query;
  try {
    const response = await fetchFootballData("players/topassists", {
      season: season as string,
      league: leagueId as string,
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch fixture statistics:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch fixture statistics" });
  }
}

//fetch top yellow carded players for a league
export async function fetchTopYellowCards(req: Request, res: Response) {
  const { leagueId, season } = req.query;
  try {
    const response = await fetchFootballData("players/topyellowcards", {
      season: season as string,
      league: leagueId as string,
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch fixture statistics:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch fixture statistics" });
  }
}

//fetch top red carded players for a league
export async function fetchTopRedCards(req: Request, res: Response) {
  const { leagueId, season } = req.query;
  try {
    const response = await fetchFootballData("players/topredcards", {
      season: season as string,
      league: leagueId as string,
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to fetch fixture statistics:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch fixture statistics" });
  }
}
