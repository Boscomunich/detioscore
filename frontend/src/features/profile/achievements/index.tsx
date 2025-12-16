import { format } from "date-fns";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";
import { Empty } from "@/components/ui/empty";

interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  iconUrl: string;
  unlockedAt?: Date;
}

interface AchievementCardProps {
  achievement: Achievement;
}

interface Achievement {
  id: string;
  name: string;
  points: number;
  unlockedAt?: Date;
}

export default function AchievementStats() {
  const { data } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const res = await authApiClient.get(`/user/achievements/`);
      return res.data;
    },
  });

  return (
    <div className="grid gap-4 sm:grid-cols-3 px-4">
      {data && data.achievements.length === 0 && <Empty />}
      {data?.achievements.map((achievement: Achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </div>
  );
}
function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col">
        {/* Icon and Points */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
            {/* Fallback icon if image fails to load */}
            <Star className="h-8 w-8 text-primary" />
          </div>
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
            <Star className="h-4 w-4 text-primary" />
            <span className="font-bold text-primary">{achievement.points}</span>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-foreground">
          {achievement.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {achievement.description}
        </p>

        {/* Unlock Date */}
        {achievement.unlockedAt && (
          <div className="mt-4 flex items-center gap-2 pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">Unlocked</span>
            <span className="text-xs font-medium text-foreground">
              {format(achievement.unlockedAt, "MMM d, yyyy")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
