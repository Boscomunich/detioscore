import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  Users,
  Shield,
  CheckCircle2,
  XCircle,
  Star,
  MapPin,
  Clock,
  AlertCircle,
  Loader,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Participant, TeamData } from "@/types/competition";
import { cn, formatDate } from "@/lib/utils";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ParticipantSection({
  participants,
}: {
  participants: Participant[];
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await authApiClient.patch(
        `/admin/participant/${data.path}`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({
        queryKey: ["competition", participants[0].teamData.competition],
      });
    },
    onError: (error) => {
      toast.error("Something went wrong while updating the transaction.");
      console.error(error);
    },
  });

  const winnerMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await authApiClient.patch(`/admin/competition/winner`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({
        queryKey: ["competition", participants[0].teamData.competition],
      });
    },
    onError: (error) => {
      toast.error("Something went wrong while updating the transaction.");
      console.error(error);
    },
  });

  return (
    <Card className="bg-card p-6">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <Users className="h-5 w-5 text-primary" />
        Participants ({participants.length})
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {participants.map((participant: Participant, index: number) => (
          <AccordionItem key={index} value={`participant-${index}`}>
            <AccordionTrigger className="hover:no-underline items-center">
              <div className="flex w-full items-center justify-between pr-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={``} />
                    <AvatarFallback>
                      {participant.user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold text-sm">
                      {participant.user.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      participant.status === "joined" ? "default" : "secondary"
                    }
                  >
                    {participant.status}
                  </Badge>
                  {participant.teamData?.rank && (
                    <Badge className="bg-warning text-black">
                      Rank #{participant.teamData.rank}
                    </Badge>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                {/* User Info */}
                <div className="rounded-lg bg-secondary/50 p-4">
                  <h4 className="mb-2 font-semibold">User Details</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID</span>
                      <code className="font-mono text-xs">
                        {participant.user._id}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role</span>
                      <Badge variant="outline">{participant.user.role}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Joined At</span>
                      <span>{formatDate(participant.joinedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Team Data */}
                {participant.teamData && (
                  <>
                    {/* Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="rounded-lg bg-secondary/50 p-4">
                        <p className="text-sm text-muted-foreground">
                          Total Points
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {participant.teamData.totalPoints}
                        </p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-4">
                        <p className="text-sm text-muted-foreground">Rank</p>
                        <p className="text-2xl font-bold">
                          {participant.teamData.rank || "N/A"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-4">
                        <p className="text-sm text-muted-foreground">
                          Staked Amount
                        </p>
                        <p className="text-2xl font-bold">
                          ${participant.teamData.stakedAmount}
                        </p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-4">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="flex gap-2">
                          {participant.teamData.stepsVerified ? (
                            <Badge className="bg-success text-white">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="mr-1 h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                          {participant.teamData.isDisqualified && (
                            <Badge variant="destructive">
                              <XCircle className="mr-1 h-3 w-3" />
                              Disqualified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selected Teams */}
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <h4 className="mb-3 flex items-center gap-2 font-semibold">
                        <Trophy className="h-4 w-4" />
                        Selected Teams ({participant.teamData.teams.length})
                      </h4>

                      <div className="grid md:grid-cols-2 gap-3">
                        {participant.teamData.teams.map((team: TeamData) => {
                          // Find the matching fixture's teamPoints
                          const teamPoint =
                            participant.teamData.teamPoints?.find(
                              (tp: any) =>
                                String(tp.fixtureId) === String(team.fixtureId)
                            );

                          const homeScore = teamPoint?.score?.home ?? null;
                          const awayScore = teamPoint?.score?.away ?? null;
                          const isLive = teamPoint?.isLive ?? false;
                          const isFT = teamPoint?.isFT ?? false;
                          const points = teamPoint?.points ?? 0;

                          return (
                            <div
                              key={team.fixtureId}
                              className={cn(
                                "flex flex-col items-center justify-center p-3 rounded border relative transition-all bg-card",
                                participant.teamData.starTeam ===
                                  team.fixtureId && "ring-2 ring-yellow-500"
                              )}
                            >
                              {/* Teams */}
                              <div className="flex items-center justify-center gap-3">
                                {/* Home */}
                                <div className="flex flex-col items-center">
                                  <LazyLoadImage
                                    src={team.selectedTeam.logo}
                                    alt={team.selectedTeam.name}
                                    className="size-7 sm:size-8 rounded-full object-cover"
                                  />
                                  <span
                                    className="text-[11px] text-muted-foreground mt-1 truncate max-w-[80px] text-center"
                                    title={team.selectedTeam.name}
                                  >
                                    {team.selectedTeam.name}
                                  </span>
                                </div>

                                {/* Score */}
                                <div className="flex flex-col items-center mx-1">
                                  <p className="text-xs font-bold">
                                    {homeScore != null && awayScore != null
                                      ? `${homeScore} - ${awayScore}`
                                      : "vs"}
                                  </p>
                                  {isLive && (
                                    <span className="text-[10px] text-red-500 font-semibold animate-pulse">
                                      LIVE
                                    </span>
                                  )}
                                  {!isLive && isFT && (
                                    <span className="text-[10px] text-gray-500 font-medium">
                                      FT
                                    </span>
                                  )}
                                </div>

                                {/* Away */}
                                <div className="flex flex-col items-center">
                                  <LazyLoadImage
                                    src={team.opponentTeam.logo}
                                    alt={team.opponentTeam.name}
                                    className="size-7 sm:size-8 rounded-full object-cover"
                                  />
                                  <span
                                    className="text-[11px] text-muted-foreground mt-1 truncate max-w-[80px] text-center"
                                    title={team.opponentTeam.name}
                                  >
                                    {team.opponentTeam.name}
                                  </span>
                                </div>
                              </div>

                              {/* Venue */}
                              <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground truncate">
                                <MapPin className="h-3 w-3 shrink-0" />
                                <span
                                  className="truncate max-w-[100px]"
                                  title={team.matchVenue}
                                >
                                  {team.matchVenue}
                                </span>
                              </div>

                              {/* Points Display */}
                              <div className="mt-2 text-center">
                                <span className="text-xs text-muted-foreground">
                                  Points:
                                </span>{" "}
                                <span className="text-sm font-bold text-primary">
                                  {points}
                                </span>
                              </div>

                              {participant.teamData.starTeam ===
                                team.fixtureId && (
                                <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-current" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Proofs */}
                    {participant.teamData.proofs.length > 0 && (
                      <div className="rounded-lg bg-secondary/50 p-4">
                        <h4 className="mb-3 flex items-center gap-2 font-semibold">
                          <Shield className="h-4 w-4" />
                          Verification Proofs (
                          {participant.teamData.proofs.length})
                        </h4>
                        <div className="space-y-2">
                          {participant.teamData.proofs.map(
                            (proof: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between rounded-lg bg-card p-3"
                              >
                                <div className="flex items-center gap-3">
                                  {proof.verified ? (
                                    <CheckCircle2 className="h-5 w-5 text-success" />
                                  ) : (
                                    <AlertCircle className="h-5 w-5 text-warning" />
                                  )}
                                  <div>
                                    <p className="font-semibold">
                                      Step {proof.step}
                                    </p>
                                    <a
                                      href={proof.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary hover:underline"
                                    >
                                      View Proof
                                    </a>
                                  </div>
                                </div>
                                <Badge
                                  variant={
                                    proof.verified ? "default" : "secondary"
                                  }
                                  className={
                                    proof.verified
                                      ? "bg-success text-white"
                                      : ""
                                  }
                                >
                                  {proof.verified ? "Verified" : "Pending"}
                                </Badge>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/*Action Buttons */}
                    <div className="flex justify-start items-center gap-4">
                      {participant.teamData.isDisqualified ? (
                        <Button
                          onClick={() => {
                            mutation.mutate({
                              teamId: participant.teamData._id,
                              path: "requalify",
                            });
                          }}
                        >
                          {mutation.isPending ? "Requalifying..." : "Requalify"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            mutation.mutate({
                              teamId: participant.teamData._id,
                              path: "disqualify",
                            });
                          }}
                        >
                          {mutation.isPending
                            ? "Disqualifying..."
                            : "Disqualify"}
                        </Button>
                      )}

                      <Button
                        onClick={() => {
                          winnerMutation.mutate({
                            competitionId: participant.teamData.competition,
                            userId: participant.user._id,
                          });
                        }}
                      >
                        {winnerMutation.isPending ? (
                          <div className="flex justify-center items-center">
                            <Loader className="animate-spin size-5" />
                          </div>
                        ) : (
                          "Declare Winner"
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
