import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user";

export interface AuthenticatedRequest extends Request {
  user?: IUser | any;
  jwtToken?: string;
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;
}

export const sessionMiddleware = (auth: any) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const fetchHeaders = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (Array.isArray(value)) {
          value.forEach((v) => fetchHeaders.append(key, v));
        } else if (value) {
          fetchHeaders.append(key, value as string);
        }
      }

      const sessionData = await auth.api.getSession({ headers: fetchHeaders });

      if (!sessionData) {
        return res.status(401).json({ error: "No active session" });
      }

      req.user = sessionData.user;
      next();
    } catch (err: any) {
      console.error("Session validation failed:", err);
      return res.status(401).json({ error: "Invalid or expired session" });
    }
  };
};
