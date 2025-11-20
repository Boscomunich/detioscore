import { NextFunction, Request, Response } from "express";
import {
  startOfMonth,
  startOfWeek,
  startOfDay,
  subMonths,
  subWeeks,
  subDays,
} from "date-fns";
import Transaction from "../../models/transaction";
import User from "../../models/user";

export const getMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const now = new Date();

    const monthStart = startOfMonth(now);
    const prevMonthStart = startOfMonth(subMonths(now, 1));

    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const prevWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

    const dayStart = startOfDay(now);
    const prevDayStart = startOfDay(subDays(now, 1));

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return null;
      return ((current - previous) / previous) * 100;
    };

    const aggregateVolume = async (start?: Date, end?: Date) => {
      const match: any = {};

      if (start || end) {
        match.createdAt = {};
        if (start) match.createdAt.$gte = start;
        if (end) match.createdAt.$lt = end;
      }

      const agg = await Transaction.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      return agg[0]?.total || 0;
    };

    const totalVolume = await aggregateVolume();
    const monthlyVolume = await aggregateVolume(monthStart);
    const prevMonthlyVolume = await aggregateVolume(prevMonthStart, monthStart);
    const monthlyChange = calculateChange(monthlyVolume, prevMonthlyVolume);

    const weeklyVolume = await aggregateVolume(weekStart);
    const prevWeeklyVolume = await aggregateVolume(prevWeekStart, weekStart);
    const weeklyChange = calculateChange(weeklyVolume, prevWeeklyVolume);

    const dailyVolume = await aggregateVolume(dayStart);
    const prevDailyVolume = await aggregateVolume(prevDayStart, dayStart);
    const dailyChange = calculateChange(dailyVolume, prevDailyVolume);

    const aggregateUsers = async (start?: Date, end?: Date) => {
      const query: any = {};

      if (start || end) {
        query.createdAt = {};
        if (start) query.createdAt.$gte = start;
        if (end) query.createdAt.$lt = end;
      }

      return User.countDocuments(query);
    };

    const totalUsers = await User.countDocuments();
    const monthlyNewUsers = await aggregateUsers(monthStart);
    const prevMonthlyNewUsers = await aggregateUsers(
      prevMonthStart,
      monthStart
    );
    const monthlyUserChange = calculateChange(
      monthlyNewUsers,
      prevMonthlyNewUsers
    );

    const weeklyNewUsers = await aggregateUsers(weekStart);
    const prevWeeklyNewUsers = await aggregateUsers(prevWeekStart, weekStart);
    const weeklyUserChange = calculateChange(
      weeklyNewUsers,
      prevWeeklyNewUsers
    );

    const dailyNewUsers = await aggregateUsers(dayStart);
    const prevDailyNewUsers = await aggregateUsers(prevDayStart, dayStart);
    const dailyUserChange = calculateChange(dailyNewUsers, prevDailyNewUsers);

    return res.json({
      totalVolume,
      monthlyVolume,
      monthlyChange,
      weeklyVolume,
      weeklyChange,
      dailyVolume,
      dailyChange,
      totalUsers,
      monthlyNewUsers,
      monthlyUserChange,
      weeklyNewUsers,
      weeklyUserChange,
      dailyNewUsers,
      dailyUserChange,
    });
  } catch (error) {
    next(error);
  }
};
