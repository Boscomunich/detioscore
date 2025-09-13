import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, BellIcon as Whistle, Star } from "lucide-react";
import { useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import LineupView from "./line-up";
import { LazyLoadImage } from "react-lazy-load-image-component";
import H2HCard from "./h2h";
import MatchEventsTimeline from "./event";
import Stats from "./stats";

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const FixtureStatusDisplay = ({ fixture }: { fixture: any }) => {
  const status = fixture.fixture.status;
  const date = fixture.fixture.date;

  const getStatusDisplay = () => {
    switch (status.short) {
      case "1H":
        return (
          <div className="flex items-center gap-1 text-[10px]">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>{status.elapsed}'</span>
            <span>1st Half</span>
          </div>
        );
      case "HT":
        return <div className="text-[10px]">HT</div>;
      case "2H":
        return (
          <div className="flex items-center gap-1 text-[10px]">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>{status.elapsed}'</span>
            <span>2nd Half</span>
          </div>
        );
      case "ET":
        return (
          <div className="flex items-center gap-1 text-[10px]">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>{status.elapsed}'</span>
            <span>ET</span>
          </div>
        );
      case "BT":
        return <div className="text-[10px]">Break Time</div>;
      case "P":
        return <div className="text-[10px]">PEN</div>;
      case "LIVE":
        return (
          <div className="flex items-center gap-1 text-[10px]">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>LIVE</span>
          </div>
        );
      case "FT":
        return <div className="text-[10px]">FT</div>;
      case "AET":
        return <div className="text-[10px]">AET</div>;
      case "SUSP":
        return <div className="text-[10px]">Suspended</div>;
      case "INT":
        return <div className="text-[10px]">Interrupted</div>;
      case "TBD":
        return <div className="text-[10px] italic">TBD</div>;
      case "NS":
        return (
          <div className="text-[10px]">{format(new Date(date), "HH:mm")}</div>
        );
      case "PST":
        return <div className="text-[10px]">Postponed</div>;
      case "CANC":
        return <div className="text-[10px] line-through">Cancelled</div>;
      case "ABD":
        return <div className="text-[10px]">Abandoned</div>;
      case "AWD":
        return <div className="text-[10px]">Tech. Win</div>;
      case "WO":
        return <div className="text-[10px]">Walkover</div>;
      default:
        return (
          <div className="text-[10px]">{format(new Date(date), "HH:mm")}</div>
        );
    }
  };

  return (
    <div
      className={cn("font-medium text-[10px]", {
        "text-green-500": ["1H", "2H", "ET", "P", "LIVE"].includes(
          status.short
        ),
        "text-orange-500": ["HT", "BT", "PST"].includes(status.short),
        "text-red-500": ["SUSP", "CANC", "ABD"].includes(status.short),
        "text-yellow-500": status.short === "INT",
        "text-muted-foreground": [
          "NS",
          "FT",
          "AET",
          "PEN",
          "TBD",
          "AWD",
          "WO",
        ].includes(status.short),
      })}
    >
      {getStatusDisplay()}
    </div>
  );
};

export default function FixtureDetailsPage() {
  const [activeTab, setActiveTab] = useState("Info");
  const { state } = useLocation();
  const fixture = state.fixture;

  const home = fixture.teams.home;
  const away = fixture.teams.away;
  const league = fixture.league;

  const matchDate = new Date(fixture.fixture.date);
  const now = new Date();
  const hasStarted = now >= matchDate;

  const homeScore = fixture.goals?.home ?? 0;
  const awayScore = fixture.goals?.away ?? 0;

  return (
    <div className="max-w-3xl px-4 border rounded-sm my-2 w-full pb-6">
      {/* League Header */}
      <div className="flex sticky top-0 w-full items-center justify-between p-4 border-b border-border z-10 text-sm">
        <div className="flex items-center gap-2">
          <LazyLoadImage
            src={league.logo}
            alt={league.name}
            className="size-10"
          />
          <div>
            <h1 className="font-semibold text-[12px]">{league.name}</h1>
            <p className="font-medium text-sm text-foreground flex items-center gap-1 text-[10px]">
              <LazyLoadImage
                src={league.flag || "/assets/world.png"}
                alt={league.country}
                className="w-3 h-3"
              />
              {league.country} • {league.round}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Match Header */}
      <div className="p-4 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center overflow-hidden">
            <img
              src={home.logo}
              alt={home.name}
              className="w-12 h-12 rounded-full mb-1"
            />
            <h3 className="font-semibold text-center">{home.name}</h3>
          </div>

          <div className="flex flex-col items-center shrink-0">
            {hasStarted ? (
              <div className="text-2xl font-bold mb-1">
                {homeScore} - {awayScore}
              </div>
            ) : (
              <div className="text-2xl font-bold mb-1">
                {formatTime(fixture.fixture.date)}
              </div>
            )}
            <FixtureStatusDisplay fixture={fixture} />
          </div>

          <div className="flex flex-col items-center overflow-hidden">
            <img
              src={away.logo}
              alt={away.name}
              className="w-12 h-12 rounded-full mb-1"
            />
            <h3 className="font-semibold text-center">{away.name}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border text-sm">
        {["Info", "Events", "Line-ups", "H2H", "Stats"].map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            className={`rounded-none ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {activeTab === "Line-ups" ? (
        <LineupView fixture={fixture.fixture} />
      ) : activeTab === "H2H" ? (
        <H2HCard
          homeId={fixture.teams.home.id}
          awayId={fixture.teams.away.id}
        />
      ) : activeTab === "Events" ? (
        <MatchEventsTimeline fixture={fixture} />
      ) : activeTab === "Stats" ? (
        <Stats fixture={fixture} />
      ) : (
        <div className="p-2 text-sm">
          <h3 className="font-semibold mb-2 text-muted-foreground">
            MATCH INFO
          </h3>
          <Card className="bg-card border-border">
            <CardContent className="p-2 space-y-2 text-[12px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(fixture.fixture.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Whistle className="h-4 w-4 text-muted-foreground" />
                <span>{fixture.fixture.referee || "TBD"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {fixture.fixture.venue.name} - {fixture.fixture.venue.city}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
