import type { User } from "./user";

export interface Rule {
  description: string;
  step: number;
  stepVerification: boolean;
  _id: string;
}

export interface Participants {
  user: string;
  status: string;
  joinedAt: Date;
}

export interface Competition {
  _id: string;
  name: string;
  invitationCode: string;
  type: "TopScore" | "ManGoSet" | "League";
  entryFee: number;
  prizePool: number;
  participantCap: number;
  requiredTeams: number;
  participants: Participants[];
  rules: Rule[];
  minParticipants: number;
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  createdBy: string;
  leagueConfig?: {
    durationDays: number;
    matchRequirement: number;
  };
  startDate: string;
  endDate: string;
  winner: string | null;
  hostContribution: number;
}

export interface UploadedImage {
  file: File;
  preview: string;
  stepId: string;
}

export interface ImageUploadStepProps {
  stepId: string;
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  required?: boolean;
}

export interface TeamWithOpponent {
  fixtureId: number;
  team: SelectedTeam;
  opponent: SelectedTeam;
  isStarred: boolean;
  matchDate: string;
  league: string;
  leagueLogo: string;
  matchVenue?: string;
}

export interface TeamData {
  fixtureId: string;
  selectedTeam: SelectedTeam;
  opponentTeam: SelectedTeam;
  matchVenue?: string;
}

export interface SelectedTeam {
  id: number;
  name: string;
  logo: string;
}

export interface TeamPoints {
  teamId: number;
  points: number;
  score?: {
    home: number;
    away: number;
  };
  isLive?: boolean;
  isFT?: boolean;
}

export interface Proof {
  step: string;
  url: string;
  verified: boolean;
}

export interface TeamSelection {
  _id: string;
  competition: string;
  user: string;
  stakedAmount: number;
  teams: TeamData[];
  starTeam: string | null;
  teamPoints: TeamPoints[];
  totalPoints: number;
  rank: number | null;
  stepsVerified: boolean;
  isDisqualified: boolean;
  proofs: Proof[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a participant in a competition.
 */
export interface Participant {
  _id: string;
  user: User;
  joinedAt: string;
  status: "joined" | "left" | "disqualified";
  teamData: TeamSelection;
}

export interface FixtureEntry {
  fixtureId: string;
  matchVenue: string;
  home: {
    teamId: number;
    name: string;
    logo?: string;
  };
  away: {
    teamId: number;
    name: string;
    logo?: string;
  };
}

export interface TeamPoints {
  fixtureId: string;
  points: number;
  score?: {
    home: number | null;
    away: number | null;
  };
  isLive?: boolean;
  isFT?: boolean;
}

export interface RankingEntry {
  _id: string;
  rank: number;
  user: {
    username: string;
    avatar?: string;
  };
  teamPoints: TeamPoints[];
  teams: FixtureEntry[];
  starFixture?: string | null;
  teamPoints: TeamPoints[];
  totalPoints: number;
  stakedAmount: number;
  joinedAt: string;
}

export interface TeamRankingsTableProps {
  rankings: RankingEntry[];
  competitionType: string;
  className?: string;
}

export interface AdminCompetition {
  _id: string;
  name: string;
  invitationCode: string;
  type: "TopScore" | "ManGoSet" | "League";
  entryFee: number;
  prizePool: number;
  participantCap: number;
  requiredTeams: number;
  participants: Participants[];
  rules: Rule[];
  minParticipants: number;
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  createdBy: User;
  leagueConfig?: {
    durationDays: number;
    matchRequirement: number;
  };
  startDate: string;
  endDate: string;
  winner: User[];
  hostContribution: number;
}

export {};
