import { apiClient } from "@/api-config";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { FootballLineupProps, Player, TeamData } from "@/types/football";

// Parse formation string to get grid structure
function parseFormation(formation: string | null) {
  if (!formation) return [1]; // Default to just goalkeeper if no formation

  const parts = formation.split("-").map(Number);
  const rows = [1, ...parts]; // Always start with 1 for goalkeeper
  return rows;
}

// Get player position in grid based on formation
function getPlayerGridPosition(player: Player) {
  if (!player.grid) return { row: 0, col: 0 };

  const [row, col] = player.grid.split(":").map(Number);
  return { row: row - 1, col: col - 1 }; // Convert to 0-based indexing
}

// Create formation grid
function createFormationGrid(
  players: { player: Player }[],
  formation: string | null
) {
  const formationRows = parseFormation(formation);
  const grid: (Player | null)[][] = [];

  // Initialize grid
  formationRows.forEach((cols, rowIndex) => {
    grid[rowIndex] = new Array(cols).fill(null);
  });

  // Place players in grid (mirrored horizontally)
  players.forEach(({ player }) => {
    const { row, col } = getPlayerGridPosition(player);
    if (row < grid.length && col < grid[row].length) {
      // Mirror the column position by subtracting from the row length
      const mirroredCol = grid[row].length - 1 - col;
      grid[row][mirroredCol] = player;
    }
  });

  return grid;
}

function PlayerCard({
  player,
  teamColor,
}: {
  player: Player;
  teamColor: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="size-8 md:size-12 rounded-full flex items-center justify-center text-white font-bold text-[10px] md:text-sm  border md:border-2 border-white shadow-lg"
        style={{ backgroundColor: `#${teamColor}` }}
      >
        {player.number}
      </div>
      <div className="mt-1 text-center">
        <div className="text-white text-[10px] md:text-xs drop-shadow-lg">
          {player.name}
        </div>
      </div>
    </div>
  );
}

function TeamLineup({
  teamData,
  isHome,
}: {
  teamData: TeamData;
  isHome: boolean;
}) {
  // Check if we have formation data
  const hasFormation =
    teamData.formation !== null &&
    teamData.startXI.some((player) => player.player.grid !== null);

  if (!hasFormation) {
    // Render simple list of players when no formation data is available
    return (
      <div
        className={cn(
          "flex-1",
          isHome ? "order-1" : "order-2",
          "flex flex-col items-center"
        )}
      >
        <div className={cn("text-center mb-4")}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <img
              src={teamData.team.logo || "/placeholder.svg"}
              alt={teamData.team.name}
              className="w-8 h-8"
            />
            <h2 className="text-white font-bold text-lg drop-shadow-lg">
              {teamData.team.name.toUpperCase()}
            </h2>
          </div>
          <div className="text-white text-sm font-semibold drop-shadow-lg">
            {teamData.formation || "Formation not available"}
          </div>
        </div>

        <div className="w-full">
          <h3 className="text-white font-semibold mb-3 text-center">
            STARTING XI
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {teamData.startXI.map(({ player }) => (
              <div
                key={player.id || player.name}
                className="flex items-center gap-2 text-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white border border-gray-500">
                  {player.number}
                </div>
                <span className="text-gray-300">{player.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  //render formation grid
  const grid = createFormationGrid(teamData.startXI, teamData.formation);

  return (
    <div
      className={cn(
        "flex-1 relative",
        isHome ? "order-1" : "order-2 transform rotate-180",
        "flex flex-col items-center"
      )}
    >
      <div
        className={cn("text-center mb-4", !isHome && "transform rotate-180")}
      >
        <div
          className={cn(
            "absolute -top-14 left-1/2 transform -translate-x-1/2 w-full",
            !isHome && "top-14"
          )}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <img
              src={teamData.team.logo || "/placeholder.svg"}
              alt={teamData.team.name}
              className="w-5 h-5"
            />
            <h2 className="text-white font-semibold text-sm drop-shadow-lg">
              {teamData.team.name.toUpperCase()}
            </h2>
          </div>
        </div>
        <div className="text-white text-sm font-semibold drop-shadow-lg">
          {teamData.formation}
        </div>
      </div>
      <div className={cn("space-y-8")}>
        {grid.map((row, rowIndex) => {
          // For away team, we'll reverse both the rows and the players within each row
          const displayRow = isHome ? row : [...row].reverse();

          return (
            <div
              key={rowIndex}
              className={cn(
                "flex justify-center items-center",
                !isHome && "transform rotate-180" // Rotate each row back to normal orientation
              )}
              style={{
                gridTemplateColumns: `repeat(${displayRow.length}, 1fr)`,
                gap: "2rem",
              }}
            >
              <div
                className="grid gap-8"
                style={{
                  gridTemplateColumns: `repeat(${displayRow.length}, 1fr)`,
                }}
              >
                {displayRow.map((player, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="flex justify-center"
                  >
                    {player && (
                      <PlayerCard
                        player={player}
                        teamColor={
                          teamData.team.colors?.player.primary || "666666"
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubstitutePlayersSection({ teamData }: { teamData: TeamData }) {
  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-3 text-white">SUBSTITUTE PLAYERS</h4>
      <div className="grid grid-cols-2 gap-3">
        {teamData.substitutes.map(({ player }) => (
          <div
            key={player.id || player.name}
            className="flex items-center gap-2 text-sm"
          >
            <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white border border-gray-500">
              {player.number}
            </div>
            <span className="text-gray-300">{player.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LineupView({ fixture }: { fixture: any }) {
  const [isConfirmationTime, setIsConfirmationTime] = useState(false);

  const { data, isLoading, error } = useQuery<FootballLineupProps | null>({
    queryKey: ["fixtures-lineups", fixture.id],
    queryFn: async () => {
      const response = await apiClient.get(
        `/livescore/lineups?fixtureId=${fixture.id}&isConfirmationTime=${isConfirmationTime}`
      );
      return response.data;
    },
  });

  useEffect(() => {
    const checkConfirmationTime = () => {
      const fixtureDate = new Date(fixture.date);
      const now = new Date();
      const oneHourBefore = new Date(fixtureDate.getTime() - 60 * 60 * 1000);
      setIsConfirmationTime(now >= oneHourBefore && now < fixtureDate);
    };

    checkConfirmationTime();
    const interval = setInterval(checkConfirmationTime, 60000);
    return () => clearInterval(interval);
  }, [fixture.date]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-lg">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 text-lg">
        {error.message}
      </div>
    );
  }

  if (!data || data.response.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-sm">
        No lineup available for this fixture.
      </div>
    );
  }

  const [homeTeam, awayTeam] = data.response;

  // Check if both teams have formation data
  const homeHasFormation =
    homeTeam.formation !== null &&
    homeTeam.startXI.some((player) => player.player.grid !== null);
  const awayHasFormation =
    awayTeam.formation !== null &&
    awayTeam.startXI.some((player) => player.player.grid !== null);

  const bothHaveFormation = homeHasFormation && awayHasFormation;

  return (
    <div className="space-y-8">
      {/* Pitch Card - Only show if both teams have formation data */}
      {bothHaveFormation ? (
        <Card className="relative overflow-hidden bg-green-700">
          <div
            className="relative min-h-[800px] p-8"
            style={{
              background:
                "linear-gradient(to bottom, #2d5016 0%, #4a7c2a 100%)",
            }}
          >
            {/* Pitch markings with white lines */}
            <div className="absolute inset-0 border-4 border-white rounded-none">
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[17.4%] pb-[17.4%] rounded-full border-2 border-white"></div>

              {/* Center spot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>

              {/* Halfway line */}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-0.5 bg-white"></div>

              {/* Penalty areas */}
              <div className="absolute top-0 left-[20%] w-[60%] h-[16%] border-2 border-white border-t-0"></div>
              <div className="absolute bottom-0 left-[20%] w-[60%] h-[16%] border-2 border-white border-b-0"></div>

              {/* Six-yard boxes */}
              <div className="absolute top-0 left-[37%] w-[26%] h-[5.24%] border-2 border-white border-t-0"></div>
              <div className="absolute bottom-0 left-[37%] w-[26%] h-[5.24%] border-2 border-white border-b-0"></div>

              {/* Penalty spots */}
              <div className="absolute top-[10.48%] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute bottom-[10.48%] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>

              {/* Corner arcs */}
              <div className="absolute top-0 left-0 size-8 border-b-2 border-r-2 border-white rounded-br-full"></div>
              <div className="absolute top-0 right-0 size-8 border-b-2 border-l-2 border-white rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 size-8 border-t-2 border-r-2 border-white rounded-tr-full"></div>
              <div className="absolute bottom-0 right-0 size-8 border-t-2 border-l-2 border-white rounded-tl-full"></div>
            </div>

            {/* Team Lineups */}
            <div className="relative z-10 h-full flex flex-col justify-between gap-6">
              <TeamLineup teamData={homeTeam} isHome={true} />
              <TeamLineup teamData={awayTeam} isHome={false} />
            </div>
          </div>
        </Card>
      ) : (
        // Simple list view when formation data is missing
        <Card className="p-6 bg-gray-800 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TeamLineup teamData={homeTeam} isHome={true} />
            <TeamLineup teamData={awayTeam} isHome={false} />
          </div>
        </Card>
      )}

      {/* Team Information Cards */}
      <div className="bg-gray-900 text-white p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.response.map((teamData) => (
            <div key={teamData.team.id} className="space-y-6">
              {/* Coach Section */}
              <div className="flex items-center gap-4">
                {teamData.coach.photo && (
                  <img
                    src={teamData.coach.photo || "/placeholder.svg"}
                    alt={teamData.coach.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                  />
                )}
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {teamData.team.name}
                  </h3>
                  <p className="text-sm text-gray-300">
                    Coach: {teamData.coach.name || "Not available"}
                  </p>
                  <p className="text-sm font-semibold text-gray-200">
                    Formation: {teamData.formation || "Not available"}
                  </p>
                </div>
              </div>

              <SubstitutePlayersSection teamData={teamData} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
