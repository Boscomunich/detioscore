interface CountryRank {
  position: number;
  country: string;
  trend: "up" | "down" | "stable";
}

interface WorldRank {
  position: number;
  country: string;
  trend: "up" | "down" | "stable";
}

interface TopScoreRank {
  worldRank: WorldRank;
  countryRank: CountryRank;
  points: number;
}

interface ManGoSetRank {
  worldRank: WorldRank;
  countryRank: CountryRank;
  points: number;
}

interface LeagueRank {
  worldRank: WorldRank;
  countryRank: CountryRank;
  points: number;
}

export interface Rank {
  user: {
    _id: string;
    image?: string;
    country?: string;
    username: string;
  };
  _id: string;
  countryRank: CountryRank;
  worldRank: WorldRank;
  topScoreRank: TopScoreRank;
  manGoSetRank: ManGoSetRank;
  leagueRank: LeagueRank;
  points: number;
  manGoSetWin: number;
  topScoreWin: number;
  leagueWin: number;
  firstWin: boolean;
  manGoSetWinningStreak: number;
  topScoreWinningStreak: number;
  leagueWinningStreak: number;
  winningStreak: number;
  totalWins: number;
  createdAt?: Date;
  updatedAt?: Date;
}
