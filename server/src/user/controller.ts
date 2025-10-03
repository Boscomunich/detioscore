import { AuthenticatedRequest } from "../middleware/session";
import User from "../models/user";
import { Response, NextFunction } from "express";

export async function fetchUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user.id;
  try {
    const users = await User.find({ _id: userId });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export async function updateUsername(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user.id;
  const { username } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}
