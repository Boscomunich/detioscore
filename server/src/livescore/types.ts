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
export interface MatchStats {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: {
    for: number;
    against: number;
  };
}

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

export interface StandingsResponse extends FootballApiResponse<LeagueStanding> {
  parameters: {
    league: string;
    season: string;
  };
}

// Rounds types
export interface RoundsResponse extends FootballApiResponse<string> {
  parameters: {
    league: string;
    season: string;
  };
}

// Fixtures types
export interface TeamInfo {
  id: number;
  name: string;
  logo: string;
  winner?: boolean;
}

export interface ScoreResult {
  home: number | null;
  away: number | null;
}

export interface Fixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number | null;
      name: string;
      city: string;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
      extra: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: TeamInfo;
    away: TeamInfo;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: ScoreResult;
    fulltime: ScoreResult;
    extratime: ScoreResult;
    penalty: ScoreResult;
  };
}

export interface FixturesResponse extends FootballApiResponse<Fixture> {
  parameters: {
    league: string;
    season: string;
    round?: string;
  };
}

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

export interface Paging {
  current: number;
  total: number;
}

export interface FootballApiResponse<T> {
  get: string;
  parameters: Record<string, any>;
  errors: any[];
  results: number;
  paging: Paging;
  response: T[];
}
