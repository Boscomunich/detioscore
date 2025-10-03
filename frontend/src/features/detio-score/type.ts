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
  team: {
    id: number;
    name: string;
    logo: string;
    isStarred: boolean;
  };
  opponent: {
    id: number;
    name: string;
    logo: string;
  };
  matchDate: string;
  league: string;
  leagueLogo: string;
  matchVenue?: string;
}
