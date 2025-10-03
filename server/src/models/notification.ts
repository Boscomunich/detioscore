import { Schema, model, Document, Types } from "mongoose";

export enum NotificationType {
  SYSTEM = "system",
  MESSAGE = "message",
  ALERT = "alert",
  WARNING = "warning",
  DISQUALIFICATION = "disqualification",
  ACHIEVEMENT = "achievement",
  REMINDER = "reminder",
  UPDATE = "update",
}

export enum NotificationStatus {
  UNREAD = "unread",
  READ = "read",
  ARCHIVED = "archived",
}

export interface INotification extends Document {
  recipient: Types.ObjectId;
  sender?: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  status: NotificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.SYSTEM,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.UNREAD,
    },
  },
  { timestamps: true }
);

/**
 * Indexing for performance (useful for queries)
 */
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });

/**
 * Example static method (optional)
 */
notificationSchema.statics.getUnreadCount = async function (
  userId: string
): Promise<number> {
  return this.countDocuments({
    recipient: userId,
    status: NotificationStatus.UNREAD,
  });
};

const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;
