import { apiClient } from "@/api-config";
import type { StatsResponse } from "@/types/football";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function Stats({ fixture }: { fixture: any }) {
  const { data, isLoading } = useQuery<StatsResponse>({
    queryKey: ["fixture-stats", fixture.fixture.id],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/fixture-statistics?fixtureId=${fixture.fixture.id}`
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

  const homeStats = new Map(
    homeTeam.statistics.map((stat) => [stat.type, stat.value])
  );
  const awayStats = new Map(
    awayTeam.statistics.map((stat) => [stat.type, stat.value])
  );

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
    return Math.max(percentage, 5);
  };

  const getTeamColors = (
    statType: string,
    homeNum: number,
    awayNum: number
  ) => {
    const isHigherBetter = [
      "Shots on Goal",
      "Shots off Goal",
      "Blocked Shots",
      "Ball Possession",
      "Corner Kicks",
      "Total passes",
      "Goalkeeper Saves",
    ].includes(statType);

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
    <div className="rounded-lg p-4 sm:p-6 space-y-4 w-full overflow-hidden">
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
          <div
            key={statType}
            className="flex flex-col sm:flex-row sm:items-center w-full overflow-hidden"
          >
            <div className="flex justify-between items-center sm:w-full w-full">
              {/* Home value */}
              <div className="text-xs sm:text-sm font-medium w-10 text-right shrink-0">
                {getDisplayValue(homeValue)}
              </div>

              {/* Progress bars */}
              <div className="flex-1 flex items-center mx-2 sm:mx-4 w-full overflow-hidden">
                <div className="flex-1 flex justify-end">
                  <div
                    className={`h-2 sm:h-3 rounded-l ${homeColor}`}
                    style={{ width: `${homeWidth}%` }}
                  ></div>
                </div>

                <div className="px-2 sm:px-4 text-center min-w-fit text-[11px] sm:text-sm whitespace-nowrap">
                  {statType === "Ball Possession" ? "Possession (%)" : statType}
                </div>

                <div className="flex-1">
                  <div
                    className={`h-2 sm:h-3 rounded-r ${awayColor}`}
                    style={{ width: `${awayWidth}%` }}
                  ></div>
                </div>
              </div>

              {/* Away value */}
              <div className="text-xs sm:text-sm font-medium w-10 text-left shrink-0">
                {getDisplayValue(awayValue)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
