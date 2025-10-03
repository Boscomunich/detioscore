import express from "express";
import {
  deleteNotification,
  fetchUserNotifications,
  markNotificationAsRead,
} from "./controller";

const router = express.Router();

router.get("/get", fetchUserNotifications);
router.patch("/:notificationId", markNotificationAsRead);
router.delete("/:notificationId", deleteNotification);

export const notificationRouter = router;
