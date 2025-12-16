import { Request, Response, NextFunction } from "express";
import bannedIp from "../src/models/banned-ip";

export const blockBlacklistedIP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || req.socket.remoteAddress;

  console.log("Checking IP:", ip);

  const blocked = await bannedIp.findOne({
    ipAddress: ip,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  });

  if (blocked) {
    return res.status(403).json({ message: "Your IP has been blocked." });
  }

  next();
};
