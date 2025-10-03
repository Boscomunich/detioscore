import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertCircle, MessageSquare, Award } from "lucide-react";

type NotificationType =
  | "system"
  | "message"
  | "alert"
  | "warning"
  | "disqualification"
  | "achievement"
  | "reminder"
  | "update";

type NotificationStatus = "unread" | "read" | "archived";

export function NotificationsPage() {
  // Fake notifications for now
  const notifications = [
    {
      id: "1",
      title: "System Update",
      message: "Ditioscore will undergo maintenance at 2AM UTC.",
      type: "system" as NotificationType,
      status: "unread" as NotificationStatus,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Achievement Unlocked",
      message: "Congratulations! You reached 100 points this week.",
      type: "achievement" as NotificationType,
      status: "read" as NotificationStatus,
      createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "Disqualification Notice",
      message: "Your team has been disqualified from the tournament.",
      type: "disqualification" as NotificationType,
      status: "unread" as NotificationStatus,
      createdAt: new Date(Date.now() - 86400 * 1000).toISOString(),
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-primary mb-4">
        Notifications
      </h1>
      <div className="space-y-3 sm:space-y-4">
        {notifications.map((n) => (
          <NotificationCard key={n.id} {...n} />
        ))}
      </div>
    </div>
  );
}

interface NotificationCardProps {
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: string;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case "alert":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "message":
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case "achievement":
      return <Award className="h-5 w-5 text-yellow-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

function NotificationCard({
  title,
  message,
  type,
  status,
  createdAt,
}: NotificationCardProps) {
  return (
    <Card className="border-2 hover:border-primary/30 transition-colors">
      <CardContent className="flex gap-2">
        <div className="flex items-start">{getIcon(type)}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
            <Badge
              className={`text-[10px] sm:text-xs ${
                status === "unread"
                  ? "bg-blue-100 text-blue-800 border-blue-200"
                  : "bg-gray-100 text-gray-800 border-gray-200"
              }`}
            >
              {status === "unread" ? "New" : "Read"}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">{message}</p>
          <p className="text-[10px] sm:text-xs text-gray-500">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
