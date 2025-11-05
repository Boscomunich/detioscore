import { Calendar, Clock, DollarSign, Trophy, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import type { Competition } from "@/types/competition";

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

  // Original logic preserved
  path = `/detio-score/${competition.type}/${competition._id}`.toLowerCase();

  if (session?.user.id === competition.createdBy) {
    const participant = competition.participants.find(
      (p) => p.user.toString() === session?.user.id
    );
    userStatus = "owner";
    if (participant?.status === "joined") {
      path = `/detio-score/${competition._id}/details`.toLowerCase();
    }
  } else {
    const participant = competition.participants.find(
      (p) => p.user.toString() === session?.user.id
    );

    if (!participant) {
      userStatus = "guest";
    } else if (participant.status === "joined") {
      userStatus = participant.status;
      path = `/detio-score/${competition._id}/details`.toLowerCase();
    } else {
      userStatus = participant.status;
    }
  }

  const participantCount = competition.participants.length;
  const cap = competition.participantCap || 1;
  const percent = Math.min((participantCount / cap) * 100, 100);

  return (
    <div
      key={competition._id}
      className="group flex flex-col cursor-pointer border rounded-md shadow-sm hover:shadow-md transition-all duration-200 p-4 bg-auto w-full mb-4"
      onClick={() => {
        navigate(path, {
          state: { competition, userStatus, path },
        });
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-3">
        <h2 className="text-base md:text-xl font-semibold leading-7 font-syne">
          {competition.name}
        </h2>

        <div className="flex items-center gap-1 flex-wrap justify-end">
          <span
            className={cn(
              "px-2 py-0.5 text-[11px] font-medium rounded-full border",
              getVisibilityColor(competition.isPublic)
            )}
          >
            {competition.isPublic ? "Public" : "Private"}
          </span>
          <span
            className={cn(
              "px-2 py-0.5 text-[11px] font-medium rounded-full border",
              getUserStatusColor(userStatus)
            )}
          >
            {userStatus === "owner"
              ? "Owner"
              : userStatus === "pending"
              ? "Select Teams"
              : userStatus === "joined"
              ? "View Table"
              : "Join"}
          </span>
          <span
            className={cn(
              "px-2 py-0.5 text-[11px] font-medium rounded-full border",
              getTypeColor(competition.type)
            )}
          >
            {competition.type}
          </span>

          {/* Participant cap inline */}
          <div className="flex items-center gap-1 ml-1">
            <Users className="size-3 text-gray-700 dark:text-gray-400" />
            <span className="text-[11px] font-medium text-gray-700 dark:text-gray-400">
              {participantCount}/{cap}
            </span>
            <div className="w-10 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-2 h-px bg-gray-100" />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Entry Fee & Prize Pool */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="size-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Entry Fee</p>
              <p className="font-semibold text-sm">{competition.entryFee} DC</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-yellow-600" />
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
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>
              {competition.leagueConfig.durationDays} days •{" "}
              {competition.leagueConfig.matchRequirement} matches
            </span>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="flex flex-wrap items-center gap-3 text-[13px] text-gray-700 dark:text-gray-400 mt-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Start: {formatDate(competition.startDate)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>End: {formatDate(competition.endDate)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Created: {formatDate(competition.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
