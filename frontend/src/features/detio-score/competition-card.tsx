import { Calendar, Clock, DollarSign, Trophy } from "lucide-react";
import type { Competition } from "./type";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

type Session = typeof authClient.$Infer.Session | null;

const getTypeColor = (type: Competition["type"]) => {
  switch (type) {
    case "League":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "TopScore":
      return "bg-green-100 text-green-800 border-green-200";
    case "ManGoSet":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getUserStatusColor = (status: string) => {
  switch (status) {
    case "owner":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "joined":
      return "bg-green-100 text-green-800 border-green-200";
    case "guest":
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getVisibilityColor = (isPublic: boolean) => {
  return isPublic
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-red-100 text-red-800 border-red-200";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function CompetitionCard({
  competition,
  session,
}: {
  competition: Competition;
  session: Session;
}) {
  const navigate = useNavigate();

  let userStatus: string;
  let path: string;

  path = `${competition.type}/${competition._id}`;
  path = path.toLowerCase();

  if (session?.user.id === competition.createdBy) {
    const participant = competition.participants.find(
      (p) => p.user.toString() === session?.user.id
    );
    userStatus = "owner";
    if (participant?.status === "joined") {
      path = `${competition._id}/details`;
      path = path.toLowerCase();
    }
  } else {
    const participant = competition.participants.find(
      (p) => p.user.toString() === session?.user.id
    );

    if (!participant) {
      userStatus = "guest";
    } else if (participant.status === "joined") {
      userStatus = participant.status;
      path = `${competition._id}/details`;
      path = path.toLowerCase();
    } else {
      userStatus = participant.status;
    }
  }

  return (
    <div
      key={competition._id}
      className="flex flex-col border rounded-lg shadow hover:shadow-lg transition-shadow p-2 w-full mb-4"
      onClick={() => {
        navigate(path, {
          state: { competition, userStatus, path },
        });
      }}
    >
      {/* Header */}
      <div className="flex justify-between gap-2">
        <h2 className="md:text-lg text-sm font-semibold text-balance leading-tight">
          {competition.name}
        </h2>
        <div className="flex gap-1">
          <span
            className={cn(
              "px-1 py-0.5 text-[10px] font-medium rounded border",
              getVisibilityColor(competition.isPublic)
            )}
          >
            {competition.isPublic ? "Public" : "Private"}
          </span>
          <span
            className={cn(
              "px-1 py-0.5 text-[10px] font-medium rounded border",
              getUserStatusColor(userStatus)
            )}
          >
            {userStatus === "owner"
              ? "Owner"
              : userStatus === "pending"
              ? "Select teams"
              : userStatus === "joined"
              ? "View table"
              : "Join"}
          </span>
          <span
            className={`px-1 py-0.5 text-[10px] font-medium rounded ${getTypeColor(
              competition.type
            )}`}
          >
            {competition.type}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1">
        {/* Entry Fee */}
        <div className="flex justify-between gap-2">
          <div className="flex items-start">
            <DollarSign className="w-3 md:w-5 md:h-5 h-3 mt-1 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Entry Fee</p>
              <p className="font-semibold text-sm">{competition.entryFee} DC</p>
            </div>
          </div>

          {/* Prize Pool */}
          <div className="flex items-start">
            <Trophy className="w-3 md:w-5 md:h-5 h-3 mt-1 text-yellow-600" />
            <div>
              <p className="text-xs text-muted-foreground">Prize Pool</p>
              <p className="font-semibold text-sm">
                {competition.prizePool.toLocaleString()} DC
              </p>
            </div>
          </div>
        </div>

        {/* League Config */}
        {competition.leagueConfig && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              {competition.leagueConfig.durationDays} days /{" "}
              {competition.leagueConfig.matchRequirement} matches
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Start {formatDate(competition.startDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>End {formatDate(competition.endDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Created {formatDate(competition.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
