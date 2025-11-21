import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Target, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Rank } from "@/types/rank";
import { authApiClient } from "@/api-config";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

type TabType = "overall" | "topscore" | "mangoset" | "league";

function RankCard({
  title,
  position,
  country,
  points,
  wins,
  streak,
  variant,
}: {
  title: string;
  position: number;
  country: string;
  points: number;
  wins: number;
  streak: number;
  variant: "world" | "country";
}) {
  const isWorld = variant === "world";

  return (
    <Card
      className={cn(
        "rounded-2xl border border-border shadow-sm p-5 flex flex-col justify-between transition hover:shadow-md",
        isWorld ? "bg-primary/5" : "bg-accent/5"
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3
            className={cn(
              "text-sm font-medium mb-1",
              isWorld ? "text-primary" : "text-brand"
            )}
          >
            {title}
          </h3>
          <p className="text-3xl font-bold tracking-tight">
            #{position?.toLocaleString() ?? "-"}
          </p>
          <p className="text-xs text-muted-foreground">
            Rank in {country ?? "-"}
          </p>
        </div>

        <div
          className={cn(
            "rounded-full text-xs font-semibold px-3 py-1",
            isWorld ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
          )}
        >
          {country ?? "-"}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-md border border-border p-2 text-center">
          <p className="text-xs text-muted-foreground mb-1">Points</p>
          <p className="text-sm font-semibold flex items-center justify-center gap-1">
            <Target className="h-3 w-3" />
            {points?.toLocaleString() ?? 0}
          </p>
        </div>
        <div className="rounded-md border border-border p-2 text-center">
          <p className="text-xs text-muted-foreground mb-1">Wins</p>
          <p className="text-sm font-semibold flex items-center justify-center gap-1">
            <Trophy className="h-3 w-3" />
            {wins ?? 0}
          </p>
        </div>
        <div className="rounded-md border border-border p-2 text-center">
          <p className="text-xs text-muted-foreground mb-1">Streak</p>
          <p className="text-sm font-semibold flex items-center justify-center gap-1">
            <Zap className="h-3 w-3" />
            {streak ?? 0}
          </p>
        </div>
      </div>
    </Card>
  );
}

function RankTabs({ rank }: { rank: Rank }) {
  const [activeTab, setActiveTab] = useState<TabType>("overall");

  const tabs = [
    { label: "Overall", id: "overall" },
    { label: "Top Score", id: "topscore" },
    { label: "Man Go Set", id: "mangoset" },
    { label: "League", id: "league" },
  ];

  const renderRankPair = (
    worldRank: { position: number; country: string },
    countryRank: { position: number; country: string },
    points: number,
    wins: number,
    streak: number
  ) => (
    <div className="grid gap-4 sm:grid-cols-2">
      <RankCard
        title="🌍 World Rank"
        position={worldRank.position}
        country={worldRank.country}
        points={points}
        wins={wins}
        streak={streak}
        variant="world"
      />
      <RankCard
        title="🏁 Country Rank"
        position={countryRank.position}
        country={countryRank.country}
        points={points}
        wins={wins}
        streak={streak}
        variant="country"
      />
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overall":
        return renderRankPair(
          rank.worldRank,
          rank.countryRank,
          rank.points,
          rank.totalWins,
          rank.winningStreak
        );
      case "topscore":
        return renderRankPair(
          rank.topScoreRank.worldRank,
          rank.topScoreRank.countryRank,
          rank.topScoreRank.points ?? 0,
          rank.topScoreWin,
          rank.topScoreWinningStreak
        );
      case "mangoset":
        return renderRankPair(
          rank.manGoSetRank.worldRank,
          rank.manGoSetRank.countryRank,
          rank.manGoSetRank.points ?? 0,
          rank.manGoSetWin,
          rank.manGoSetWinningStreak
        );
      case "league":
        return renderRankPair(
          rank.leagueRank.worldRank,
          rank.leagueRank.countryRank,
          rank.leagueRank.points ?? 0,
          rank.leagueWin,
          rank.leagueWinningStreak
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "border-b-2 border-lime-500"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
}

export default function UserRank() {
  async function fetchData() {
    const response = await authApiClient.get(`/rankings/user`);
    return response.data;
  }

  const navigate = useNavigate();

  const { data: rank, isLoading } = useQuery({
    queryKey: ["user rank"],
    queryFn: fetchData,
  });

  if (isLoading) {
    return <Skeleton className="w-full h-72" />;
  }

  return (
    <main className="bg-background/50 px-2">
      <div className="container mx-auto px-4 py-8">
        <RankTabs rank={rank as Rank} />
      </div>
      <Button className="w-full" onClick={() => navigate("/leaderboard")}>
        View Leaderboard
      </Button>
    </main>
  );
}
