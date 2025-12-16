import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertCircle, MessageSquare, Award } from "lucide-react";
import { authApiClient } from "@/api-config";
import { useQuery } from "@tanstack/react-query";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router";

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

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: string;
}

interface NotificationCardProps {
  notification: Notification;
  navigate: ReturnType<typeof useNavigate>;
}

export function NotificationsPage() {
  const navigate = useNavigate();

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["user notifications"],
    queryFn: async () => {
      const response = await authApiClient.get("/notification");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full max-w-2xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-primary mb-4">
          Notifications
        </h1>
        <div className="space-y-3 sm:space-y-4">
          {[...Array(5)].map((_, idx) => (
            <NotificationSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-primary mb-4">
        Notifications
      </h1>
      <div className="space-y-3 sm:space-y-4">
        {notifications && notifications.length === 0 && <Empty />}
        {notifications?.map((n) => (
          <NotificationCard key={n._id} notification={n} navigate={navigate} />
        ))}
      </div>
    </div>
  );
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

function NotificationCard({ notification, navigate }: NotificationCardProps) {
  const { _id, title, message, type, status, createdAt } = notification;

  // Define badge colors
  const badgeClasses =
    status === "unread"
      ? "bg-blue-600 text-white border-blue-700"
      : "bg-gray-100 text-gray-800 border-gray-200";

  // Optional: subtle card background for unread
  const cardClasses =
    status === "unread"
      ? "border-2 border-blue-600 hover:border-blue-700 transition-colors cursor-pointer bg-blue-50"
      : "border-2 hover:border-primary/30 transition-colors cursor-pointer";

  return (
    <Card
      className={cardClasses}
      onClick={() => navigate(`${_id}`, { state: { notification } })}
    >
      <CardContent className="flex gap-2">
        <div className="flex items-start">{getIcon(type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm sm:text-base truncate">
              {title}
            </h3>
            <Badge className={`text-[10px] sm:text-xs ${badgeClasses}`}>
              {status === "unread" ? "New" : "Read"}
            </Badge>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground truncate w-full">
            {message}
          </p>

          <p className="text-[10px] sm:text-xs text-gray-500">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationSkeleton() {
  return (
    <Card className="border-2">
      <CardContent className="flex gap-2 p-4">
        <Skeleton className="h-5 w-5 rounded-md" />

        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-10 rounded-full" />
          </div>

          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-2/5" />

          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
