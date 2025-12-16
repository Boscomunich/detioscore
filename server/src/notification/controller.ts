import { Response, Request, NextFunction } from "express";
import Notification, { NotificationStatus } from "../models/notification";
import AppError from "../middleware/error";
import { AuthenticatedRequest } from "../middleware/session";

export async function fetchUserNotifications(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user.id;
  const { status } = req.query;
  try {
    const notifications = await Notification.find({
      user: userId,
      ...(status ? { status } : {}),
    }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
}

export async function markNotificationAsRead(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user.id;
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new AppError("Notification not found", 404);
    }
    notification.status = NotificationStatus.READ;
    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
}

export async function deleteNotification(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user.id;
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });
    if (!notification) {
      throw new AppError("Notification not found", 404);
    }
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
}

export async function getUnreadNotificationCount(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.id;

    const count = await Notification.countDocuments({
      user: userId,
      status: "unread",
    });

    res.status(200).json({
      message: "success",
      unreadCount: count,
    });
  } catch (error) {
    next(error);
  }
}

export async function createNotification(
  recipientId: string,
  type: string,
  title: string,
  message: string,
  link?: string,
  senderId?: string
) {
  const notification = new Notification({
    recipient: recipientId,
    sender: senderId,
    type,
    title,
    message,
    link,
    status: "unread",
  });
  await notification.save();
  return notification;
}
