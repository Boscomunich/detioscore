import { NextFunction, Request, Response } from "express";
import User from "../../models/user";
import AppError from "../../middleware/error";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 50;
  const skip = (page - 1) * limit;
  try {
    const [users, totalUsers] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function suspendUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { reason } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { suspended: true, suspensionReason: reason },
      { new: true }
    );

    if (!user) throw new AppError("User not found", 404);

    res.status(200).json({ message: "User suspended successfully", user });
  } catch (error) {
    next(error);
  }
}

export async function unsuspendUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { suspended: false, suspensionReason: null },
      { new: true }
    );

    if (!user) throw new AppError("User not found", 404);

    res.status(200).json({ message: "User unsuspended successfully", user });
  } catch (error) {
    console.error("Error unsuspending user:", error);
    next(error);
  }
}

export async function banUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { reason, expires } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        banned: true,
        banReason: reason,
        banExpires: expires || null,
      },
      { new: true }
    );

    if (!user) throw new AppError("User not found", 404);

    res.status(200).json({ message: "User banned successfully", user });
  } catch (error) {
    next(error);
  }
}

export async function unbanUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { banned: false, banReason: null, banExpires: null },
      { new: true }
    );

    if (!user) throw new AppError("User not found", 404);

    res.status(200).json({ message: "User unbanned successfully", user });
  } catch (error) {
    next(error);
  }
}
