import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api-config";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Square, Replace, ShieldAlert, Loader2 } from "lucide-react";
import type { FixtureResponse } from "@/types/football";

const MatchEventsTimeline = ({ fixture }: { fixture: FixtureResponse }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["fixtures-events", fixture.fixture.id],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/fixture-event/${fixture.fixture.id}`
      );
      return response.data.response;
    },
  });

  const events = data || [];

  console.log("Fetched events:", events);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-sm">
        No match events available
      </div>
    );
  }

  // Helper: choose event icon
  const getEventIcon = (event: any) => {
    if (event.type === "Goal" && event.detail === "Missed Penalty") {
      return <img src="/assets/miss.png" className="w-6 h-6" />;
    }
    switch (event.type) {
      case "Goal":
        return <img src="/assets/goal.png" className="w-6 h-6" />;
      case "Card":
        return (
          <Square
            className={`w-4 h-4 ${
              event.detail?.includes("Yellow")
                ? "text-yellow-500 bg-yellow-500"
                : "text-red-600 bg-red-600"
            }`}
          />
        );
      case "subst":
        return <Replace className="w-4 h-4 text-blue-500" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="p-4 space-y-4 text-[10px]">
      <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
        <img src="/assets/whistle.png" className="h-4 w-4 text-primary" />
        <span className="font-semibold text-[10px]">Match Events</span>
      </div>

      <Timeline>
        {events.map((event: any, index: number) => (
          <TimelineItem
            key={index}
            side={event.team.id === fixture.teams.home.id ? "home" : "away"}
            icon={getEventIcon(event)}
            time={`${event.time?.elapsed || 0}'`}
          >
            <div className="text-[10px]">
              <div className="flex items-center gap-1">
                {event.team?.logo && (
                  <img
                    src={event.team.logo}
                    alt={event.team.name}
                    className="w-4 h-4"
                  />
                )}
                <span className="font-medium">{event.type}</span>
              </div>

              {event.detail && (
                <div className="text-muted-foreground">{event.detail}</div>
              )}

              {event.player?.name && (
                <div>
                  <span className="font-medium">Player:</span>{" "}
                  {event.player.name}
                </div>
              )}

              {event.assist?.name && (
                <div>
                  <span className="font-medium">
                    {event.type === "subst" ? "Replaced:" : "Assist:"}
                  </span>{" "}
                  {event.assist.name}
                </div>
              )}
            </div>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

export default MatchEventsTimeline;
