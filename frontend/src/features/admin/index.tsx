// import { cn } from "@/lib/utils";

// import { Card } from "@/components/ui/card";
// import {
//   ArrowUpRight,
//   ArrowDownRight,
//   DollarSign,
//   Users,
//   Trophy,
//   TrendingUp,
// } from "lucide-react";

// const stats = [
//   {
//     name: "Total Revenue",
//     value: "$45,231.89",
//     change: "+20.1%",
//     trend: "up",
//     icon: DollarSign,
//   },
//   {
//     name: "Active Users",
//     value: "2,350",
//     change: "+15.3%",
//     trend: "up",
//     icon: Users,
//   },
//   {
//     name: "Pending Transactions",
//     value: "127",
//     change: "-5.2%",
//     trend: "down",
//     icon: TrendingUp,
//   },
//   {
//     name: "Active Competitions",
//     value: "12",
//     change: "+8.0%",
//     trend: "up",
//     icon: Trophy,
//   },
// ];

// const recentActivity = [
//   {
//     id: 1,
//     user: "john@example.com",
//     action: "New transaction",
//     time: "2 minutes ago",
//   },
//   {
//     id: 2,
//     user: "sarah@example.com",
//     action: "Joined competition",
//     time: "15 minutes ago",
//   },
//   {
//     id: 3,
//     user: "mike@example.com",
//     action: "Account suspended",
//     time: "1 hour ago",
//   },
//   {
//     id: 4,
//     user: "emma@example.com",
//     action: "Transaction completed",
//     time: "2 hours ago",
//   },
// ];

export function Admin() {
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
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  stat.trend === "up" ? "text-chart-2" : "text-destructive"
                )}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {stat.change}
              </div>
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
      </div> */}

      {/* Recent Activity */}
      {/* <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {activity.user}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.action}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </Card> */}
    </div>
  );
}
