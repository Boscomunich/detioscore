import { authApiClient } from "@/api-config";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Users,
  Calendar,
  DollarSign,
  Shield,
  CheckCircle2,
  XCircle,
  Target,
  Loader2,
} from "lucide-react";
import type { AdminCompetition, Participant } from "@/types/competition";
import ParticipantSection from "./participant-section";

interface CompetitonDetails {
  competition: AdminCompetition;
  participants: Participant[];
}

const formatDate = (date: string | null) => {
  if (!date) return "Not set";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (isActive: boolean) => {
  return isActive ? (
    <Badge className="bg-success text-white">Active</Badge>
  ) : (
    <Badge variant="secondary">Inactive</Badge>
  );
};

export default function CompetitionDetails() {
  const { compId } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["competition", compId],
    queryFn: async () => {
      const res = await authApiClient.get(`/admin/competition/${compId}`);
      return res.data;
    },
    enabled: !!compId,
  });

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      TopScore: "bg-primary text-primary-foreground",
      ManGoSet: "bg-warning text-black",
      League: "bg-accent text-accent-foreground",
    };
    return <Badge className={colors[type] || ""}>{type}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Loading competition details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto mb-2 h-10 w-10 text-destructive" />
          <p className="text-lg font-semibold">Failed to load competition.</p>
          <p className="text-sm text-muted-foreground">
            Please try again later or check your connection.
          </p>
        </div>
      </div>
    );
  }

  const { competition, participants }: CompetitonDetails = data;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="font-sans text-2xl lg:text-4xl font-bold uppercase tracking-tight text-balance">
                {competition.name}
              </h1>
              {getStatusBadge(competition.isActive)}
              {getTypeBadge(competition.type)}
            </div>
            <p className="text-muted-foreground font-mono text-sm">
              ID: {competition._id}
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <p className="h-5 w-5 text-primary">DC</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prize Pool</p>
                <p className="text-2xl font-bold">DC {competition.prizePool}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Participants</p>
                <p className="text-2xl font-bold">
                  {participants.length} / {competition.participantCap}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entry Fee</p>
                <p className="text-2xl font-bold">${competition.entryFee}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Required Teams</p>
                <p className="text-2xl font-bold">
                  {competition.requiredTeams}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Competition Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card className="bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Shield className="h-5 w-5 text-primary" />
              Competition Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-semibold">{competition.type}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Visibility</span>
                <Badge variant={competition.isPublic ? "default" : "secondary"}>
                  {competition.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invitation Code</span>
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  {competition.invitationCode}
                </code>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created By</span>
                <span className="font-mono text-sm">
                  {competition.createdBy.username}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Winner</span>
                <span className="font-semibold">
                  {competition?.winner?.username || "Not determined"}
                </span>
              </div>
            </div>
          </Card>

          {/* Dates & Timeline */}
          <Card className="bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Calendar className="h-5 w-5 text-primary" />
              Timeline
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-semibold">
                  {formatDate(competition.startDate)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Date</span>
                <span className="font-semibold">
                  {formatDate(competition.endDate)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created At</span>
                <span className="font-semibold">
                  {formatDate(competition.createdAt)}
                </span>
              </div>
            </div>
          </Card>

          {/* Financial Details */}
          <Card className="bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <DollarSign className="h-5 w-5 text-primary" />
              Financial Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entry Fee</span>
                <span className="text-xl font-bold text-primary">
                  DC {competition.entryFee}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Host Contribution</span>
                <span className="text-xl font-bold text-primary">
                  DC {competition.hostContribution}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Prize Pool</span>
                <span className="text-2xl font-bold text-primary">
                  DC {competition.prizePool}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Potential from {competition.participantCap} participants
                </span>
                <span className="font-semibold">
                  DC
                  {competition.entryFee * competition.participantCap +
                    competition.hostContribution}
                </span>
              </div>
            </div>
          </Card>

          {/* Team Requirements */}
          <Card className="bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Trophy className="h-5 w-5 text-primary" />
              Team Requirements
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Required Teams</span>
                <span className="text-xl font-bold">
                  {competition.requiredTeams}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Min Participants</span>
                <span className="font-semibold">
                  {competition.minParticipants}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Participant Cap</span>
                <span className="font-semibold">
                  {competition.participantCap}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Rules */}
        {competition.rules && competition.rules.length > 0 && (
          <Card className="bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Shield className="h-5 w-5 text-primary" />
              Competition Rules
            </h2>
            <div className="space-y-3">
              {competition.rules.map((rule: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-secondary/50 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {rule.step}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{rule.description}</p>
                    {rule.stepVerification && (
                      <Badge variant="outline" className="mt-2">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Requires Verification
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <ParticipantSection participants={participants} />
      </div>
    </div>
  );
}
