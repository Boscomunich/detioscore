import { apiClient } from "@/api-config";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { StatsResponse } from "../type";

export default function Stats({ fixture }: { fixture: any }) {
  const { data, isLoading } = useQuery<StatsResponse>({
    queryKey: ["fixture-stats", fixture.fixture.id],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/get-fixture-statistics?fixtureId=${fixture.fixture.id}`
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-lg">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!data?.response || data.response.length < 2) {
    return (
      <div className="rounded-lg p-6 text-center">No statistics available</div>
    );
  }

  const [homeTeam, awayTeam] = data.response;

  // Create a map of statistics for easier lookup
  const homeStats = new Map(
    homeTeam.statistics.map((stat) => [stat.type, stat.value])
  );
  const awayStats = new Map(
    awayTeam.statistics.map((stat) => [stat.type, stat.value])
  );

  // Define the stats we want to display in order
  const statsToShow = [
    "Shots on Goal",
    "Shots off Goal",
    "Blocked Shots",
    "Ball Possession",
    "Corner Kicks",
    "Offsides",
    "Fouls",
    "Total passes",
    "Yellow Cards",
    "Red Cards",
    "Goalkeeper Saves",
  ];

  const getStatValue = (value: string | number | null): number => {
    if (value === null) return 0;
    if (typeof value === "string") {
      // Handle percentage values
      if (value.includes("%")) {
        return Number.parseInt(value.replace("%", ""));
      }
      return Number.parseInt(value) || 0;
    }
    return value;
  };

  const getDisplayValue = (value: string | number | null): string => {
    if (value === null) return "0";
    return value.toString();
  };

  const calculateBarWidth = (
    homeVal: number,
    awayVal: number,
    isHome: boolean
  ): number => {
    const total = homeVal + awayVal;
    if (total === 0) return 0;
    const percentage = isHome
      ? (homeVal / total) * 100
      : (awayVal / total) * 100;
    return Math.max(percentage, 5); // Minimum 5% width for visibility
  };

  // Determine which team should have the primary color for each stat
  const getTeamColors = (
    statType: string,
    homeNum: number,
    awayNum: number
  ) => {
    // For most stats, higher is better (possession, shots, corners, passes, saves)
    const isHigherBetter = [
      "Shots on Goal",
      "Shots off Goal",
      "Blocked Shots",
      "Ball Possession",
      "Corner Kicks",
      "Total passes",
      "Goalkeeper Saves",
    ].includes(statType);

    // For these stats, lower is better (cards, fouls, offsides)
    const isLowerBetter = [
      "Yellow Cards",
      "Red Cards",
      "Fouls",
      "Offsides",
    ].includes(statType);

    let homeIsPrimary = false;
    let awayIsPrimary = false;

    if (isHigherBetter) {
      homeIsPrimary = homeNum > awayNum;
      awayIsPrimary = awayNum > homeNum;
    } else if (isLowerBetter) {
      homeIsPrimary = homeNum < awayNum;
      awayIsPrimary = awayNum < homeNum;
    }

    // If both teams have the same value, use muted colors for both
    if (homeNum === awayNum) {
      return {
        homeColor: "bg-muted-foreground",
        awayColor: "bg-muted-foreground",
      };
    }

    return {
      homeColor: homeIsPrimary ? "bg-primary" : "bg-muted-foreground",
      awayColor: awayIsPrimary ? "bg-primary" : "bg-muted-foreground",
    };
  };

  return (
    <div className="rounded-lg p-6 space-y-4">
      {statsToShow.map((statType) => {
        const homeValue = homeStats.get(statType);
        const awayValue = awayStats.get(statType);

        if (homeValue === undefined || awayValue === undefined) return null;

        const homeNum = getStatValue(homeValue);
        const awayNum = getStatValue(awayValue);
        const homeWidth = calculateBarWidth(homeNum, awayNum, true);
        const awayWidth = calculateBarWidth(homeNum, awayNum, false);

        const { homeColor, awayColor } = getTeamColors(
          statType,
          homeNum,
          awayNum
        );

        return (
          <div key={statType} className="flex items-center">
            {/* Home team value */}
            <div className="md:w-8 w-auto text-right font-medium">
              {getDisplayValue(homeValue)}
            </div>

            {/* Progress bars */}
            <div className="flex-1 mx-4 flex items-center">
              {/* Home team bar (left side) */}
              <div className="flex-1 flex justify-end">
                <div
                  className={`h-3 rounded-l ${homeColor}`}
                  style={{ width: `${homeWidth}%` }}
                ></div>
              </div>

              {/* Stat label in center */}
              <div className="px-4 text-center min-w-0">
                <span className="text-sm whitespace-nowrap">
                  {statType === "Ball Possession" ? "Possession (%)" : statType}
                </span>
              </div>

              {/* Away team bar (right side) */}
              <div className="flex-1">
                <div
                  className={`h-3 rounded-r ${awayColor}`}
                  style={{ width: `${awayWidth}%` }}
                ></div>
              </div>
            </div>

            {/* Away team value */}
            <div className="md:w-8 w-auto text-left font-medium">
              {getDisplayValue(awayValue)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
