import {
  Clock,
  Bell,
  Archive,
  Trash2,
  AlertCircle,
  MessageSquare,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "react-router";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApiClient } from "@/api-config";

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

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "alert":
      return "bg-red-50 text-red-700 border border-red-200";
    case "message":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "update":
      return "bg-green-50 text-green-700 border border-green-200";
    case "info":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    default:
      return "bg-secondary text-foreground";
  }
};

export default function NotificationDetail() {
  const state = useLocation();
  const notification = state.state.notification as Notification;

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await authApiClient.patch(
        `/notification/${notification._id}`
      );
      return res.data;
    },
  });

  useEffect(() => {
    if (!notification.status || notification.status === "unread") {
      mutation.mutate();
    }
  }, []);

  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now.getTime() - then.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Notification Card */}
      <Card className="overflow-hidden shadow-sm">
        {/* Type Badge and Sender */}
        <div className="bg-card p-6 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getTypeBadgeColor(
                notification.type
              )}`}
            >
              {getIcon(notification.type)}
              <span className="capitalize">{notification.type}</span>
            </div>
          </div>

          {/* Timestamp */}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{timeAgo(notification.createdAt)}</span>
            <span className="text-xs">
              • {new Date(notification.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-background">
          <h1 className="text-2xl font-bold text-foreground mb-4 text-balance">
            {notification.title}
          </h1>
          <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
            {notification.message}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border bg-background flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{notification.status}</p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
