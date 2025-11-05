export interface League {
  id: number;
  logo: string;
  name: string;
  type: string;
}

export interface season {
  year: number;
  start: string;
  end: string;
  current: boolean;
}

export interface Leagues {
  league: League;
  seasons: season[];
  country: Country;
}

export interface Country {
  name: string;
  flag: string;
  code: string;
}

export interface Response {
  response: Country[];
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
  form: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  home: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  away: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
}

export interface CalculatedTeamStanding extends TeamStanding {
  calculatedPoints?: number;
  calculatedGoalsDiff?: number;
  calculatedRank?: number;
  calculatedPlayed?: number;
  calculatedWin?: number;
  calculatedDraw?: number;
  calculatedLose?: number;
  calculatedGoalsFor?: number;
  calculatedGoalsAgainst?: number;
}

export interface FixturesApiResponse {
  get: string;
  parameters: {
    live: string;
  };
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: FixtureResponse[];
}

export interface FixtureResponse {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string; // ISO date string
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

export interface TeamInfo {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

export interface ScoreResult {
  home: number | null;
  away: number | null;
}

export interface Player {
  id: number | null;
  name: string;
  number: number;
  pos: string | null;
  grid: string | null;
}

export interface TeamData {
  team: {
    id: number;
    name: string;
    logo: string;
    colors: {
      player: {
        primary: string;
        number: string;
        border: string;
      };
    } | null;
  };
  coach: {
    id: number | null;
    name: string;
    photo: string;
  };
  formation: string | null;
  startXI: { player: Player }[];
  substitutes: { player: Player }[];
}

export interface FootballLineupProps {
  response: TeamData[];
}

export interface Statistic {
  type: string;
  value: string | number | null;
}

export interface TeamStats {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: Statistic[];
}

export interface StatsResponse {
  response: TeamStats[];
}

export {};
