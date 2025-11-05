export interface PlayerStatsApiResponse {
  get: string;
  parameters: {
    season: string;
    league: string;
  };
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: PlayerData[];
}

export interface PlayerData {
  player: Player;
  statistics: PlayerStatistics[];
}

export interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: Birth;
  nationality: string;
  height: string;
  weight: string;
  injured: boolean;
  photo: string;
}

export interface Birth {
  date: string;
  place: string;
  country: string;
}

export interface PlayerStatistics {
  team: Team;
  league: League;
  games: Games;
  substitutes: Substitutes;
  shots: Shots;
  goals: Goals;
  passes: Passes;
  tackles: Tackles;
  duels: Duels;
  dribbles: Dribbles;
  fouls: Fouls;
  cards: Cards;
  penalty: Penalty;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
}

export interface Games {
  appearences: number;
  lineups: number;
  minutes: number;
  number: number | null;
  position: string;
  rating: string;
  captain: boolean;
}

export interface Substitutes {
  in: number;
  out: number;
  bench: number;
}

export interface Shots {
  total: number;
  on: number;
}

export interface Goals {
  total: number;
  conceded: number;
  assists: number;
  saves: number | null;
}

export interface Passes {
  total: number;
  key: number;
  accuracy: number;
}

export interface Tackles {
  total: number;
  blocks: number | null;
  interceptions: number;
}

export interface Duels {
  total: number;
  won: number;
}

export interface Dribbles {
  attempts: number;
  success: number;
  past: number | null;
}

export interface Fouls {
  drawn: number;
  committed: number;
}

export interface Cards {
  yellow: number;
  yellowred: number;
  red: number;
}

export interface Penalty {
  won: number | null;
  commited: number | null;
  scored: number;
  missed: number;
  saved: number | null;
}
