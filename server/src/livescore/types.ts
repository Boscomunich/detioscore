interface Paging {
  current: number;
  total: number;
}

export interface FootballApiResponse<T> {
  get: string;
  parameters: any[];
  errors: any[];
  results: number;
  paging: Paging;
  response: T[];
}

// Country and League types
export interface Country {
  name: string;
  code: string;
  flag: string;
  leagues: League[];
}

export interface League {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string;
    flag: string;
  };
  seasons: any[];
}

// Standings types
export interface TeamStanding {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: MatchStats;
  home: MatchStats;
  away: MatchStats;
  update: string;
}

interface MatchStats {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: {
    for: number;
    against: number;
  };
}

export interface LeagueStanding {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    standings: TeamStanding[][];
  };
}

export interface StandingsResponse {
  get: string;
  parameters: {
    league: string;
    season: string;
  };
  errors: any[];
  results: number;
  paging: Paging;
  response: LeagueStanding[];
}

// Rounds types
export interface RoundsResponse {
  get: string;
  parameters: {
    league: string;
    season: string;
  };
  errors: any[];
  results: number;
  paging: Paging;
  response: string[]; // Array of round names
}

// Fixtures types
export interface Fixture {
  fixture: {
    id: number;
    date: string;
    timestamp: number;
    status: {
      short: string;
      elapsed?: number;
    };
  };
  teams: {
    home: TeamInfo;
    away: TeamInfo;
  };
  goals: {
    home: number;
    away: number;
  };
}

interface TeamInfo {
  id: number;
  name: string;
  logo: string;
  winner?: boolean;
}

export interface FixturesResponse {
  get: string;
  parameters: {
    league: string;
    season: string;
    round?: string;
  };
  errors: any[];
  results: number;
  paging: Paging;
  response: Fixture[];
}

// types.ts

export interface LeagueInfo {
  id: number;
  name: string;
  type: string;
  logo: string;
}

export interface LeagueCountry {
  name: string;
  code: string | null;
  flag: string | null;
}

export interface LeagueSeasonCoverage {
  fixtures: {
    events: boolean;
    lineups: boolean;
    statistics_fixtures: boolean;
    statistics_players: boolean;
  };
  standings: boolean;
  players: boolean;
  top_scorers: boolean;
  top_assists: boolean;
  top_cards: boolean;
  injuries: boolean;
  predictions: boolean;
  odds: boolean;
}

export interface LeagueSeason {
  year: number;
  start: string;
  end: string;
  current: boolean;
  coverage: LeagueSeasonCoverage;
}

export interface LeagueResponse {
  league: LeagueInfo;
  country: LeagueCountry;
  seasons: LeagueSeason[];
}
