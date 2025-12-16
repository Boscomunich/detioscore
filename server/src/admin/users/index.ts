import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../../models/user";
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
    const filter: any = {};

    if (req.query.username) {
      filter.username = {
        $regex: new RegExp(req.query.username as string, "i"),
      };
    }

    if (req.query.email) {
      filter.email = { $regex: new RegExp(req.query.email as string, "i") };
    }

    if (req.query.role) {
      filter.role = req.query.role;
    }

    if (req.query.country) {
      filter.country = req.query.country;
    }

    if (req.query.banned) {
      filter.banned = req.query.banned === "true";
    }

    if (req.query.suspended) {
      filter.suspended = req.query.suspended === "true";
    }

    const sortField = (req.query.sortBy as string) || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ [sortField]: sortOrder }),
      User.countDocuments(filter),
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

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError("User not found", 404);

    res.status(200).json({ message: "User banned successfully", user });
  } catch (error) {
    next(error);
  }
}

export async function changeUserRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const role = req.body.role as IUser["role"];

    if (!role) {
      throw new AppError("Role is required", 400);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserByIdOrEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // read query from query string
    const query = req.query.query as string;

    if (!query) {
      throw new AppError("Query parameter is required", 400);
    }

    let user: typeof User | null = null;

    // Check if query is a valid MongoDB ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(query)) {
      user = await User.findById(query);
    }

    // If not found by ID, check by email
    if (!user) {
      user = await User.findOne({ email: query });
    }

    if (!user) throw new AppError("User not found", 404);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}
