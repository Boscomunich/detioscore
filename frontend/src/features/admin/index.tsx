import { cn } from "@/lib/utils";
import { authApiClient } from "@/api-config";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";

export function Admin() {
  async function fetchData() {
    const response = await authApiClient.get(`/admin/metric`);
    return response.data;
  }

  const { data } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: fetchData,
  });

  console.log(data);

  if (!data) {
    return <p>Loading...</p>;
  }

  // Helper function to determine trend
  const getTrend = (change: number | null) => {
    if (change === null) return null;
    return change >= 0 ? "up" : "down";
  };

  const stats = [
    // Total stats
    {
      name: "Total Volume",
      value: `$${data.totalVolume.toLocaleString()}`,
      change: null,
      trend: null,
      icon: DollarSign,
    },
    {
      name: "Total Users",
      value: data.totalUsers.toLocaleString(),
      change: null,
      trend: null,
      icon: Users,
    },

    // Daily stats
    {
      name: "Daily Volume",
      value: `$${data.dailyVolume.toLocaleString()}`,
      change: data.dailyChange !== null ? `${data.dailyChange}%` : "—",
      trend: getTrend(data.dailyChange),
      icon: TrendingUp,
    },
    {
      name: "Daily New Users",
      value: data.dailyNewUsers.toLocaleString(),
      change: data.dailyUserChange !== null ? `${data.dailyUserChange}%` : "—",
      trend: getTrend(data.dailyUserChange),
      icon: Users,
    },

    // Weekly stats
    {
      name: "Weekly Volume",
      value: `$${data.weeklyVolume.toLocaleString()}`,
      change: data.weeklyChange !== null ? `${data.weeklyChange}%` : "—",
      trend: getTrend(data.weeklyChange),
      icon: TrendingUp,
    },
    {
      name: "Weekly New Users",
      value: data.weeklyNewUsers.toLocaleString(),
      change:
        data.weeklyUserChange !== null ? `${data.weeklyUserChange}%` : "—",
      trend: getTrend(data.weeklyUserChange),
      icon: Users,
    },

    // Monthly stats
    {
      name: "Monthly Volume",
      value: `$${data.monthlyVolume.toLocaleString()}`,
      change: data.monthlyChange !== null ? `${data.monthlyChange}%` : "—",
      trend: getTrend(data.monthlyChange),
      icon: TrendingUp,
    },
    {
      name: "Monthly New Users",
      value: data.monthlyNewUsers.toLocaleString(),
      change:
        data.monthlyUserChange !== null ? `${data.monthlyUserChange}%` : "—",
      trend: getTrend(data.monthlyUserChange),
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Overview
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor your platform's key metrics and activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              {stat.change && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    stat.trend === "up" ? "text-chart-2" : "text-destructive"
                  )}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : stat.trend === "down" ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : null}
                  {stat.change}
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
