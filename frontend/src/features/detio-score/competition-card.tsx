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
  if (session?.user.id === competition.createdBy) {
    userStatus = "owner";
    path = "details";
  } else {
    const participant = competition.participants.find(
      (p) => p.user.toString() === session?.user.id
    );

    path = competition._id;

    if (!participant) {
      userStatus = "guest";
    } else {
      userStatus = participant.status;
    }
  }
  return (
    <div
      key={competition._id}
      className="flex flex-col border rounded-lg shadow hover:shadow-lg transition-shadow p-2 w-full mb-4"
      onClick={() => {
        navigate(`topscore/${path}`, {
          state: { competition, userStatus, path },
        });
      }}
    >
      {/* Header */}
      <div className="flex justify-between gap-2">
        <h2 className="md:text-lg text-sm font-semibold text-balance leading-tight">
          {competition.name}
        </h2>
        <div>
          <span
            className={cn(
              "px-1 py-0.5 text-[10px] font-medium rounded bg-primary/30 mx-3 text-primary"
            )}
          >
            {userStatus === "owner"
              ? "Owner"
              : userStatus === "pending"
              ? "Select teams"
              : userStatus === "joined"
              ? "View"
              : ""}
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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground mb-3 gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Created {formatDate(competition.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
