import express from "express";
import {
  deleteNotification,
  fetchUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
} from "./controller";

const router = express.Router();

router.get("/", fetchUserNotifications);
router.get("/count", getUnreadNotificationCount);
router.patch("/:notificationId", markNotificationAsRead);
router.delete("/:notificationId", deleteNotification);

export const notificationRouter = router;
