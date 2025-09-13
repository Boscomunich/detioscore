import { Request, Response, NextFunction } from "express";
import { auth } from "../../utils/auth";
import { Multer } from "multer";

export interface AuthenticatedRequest extends Request {
  user?: any;
  jwtToken?: string;
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;
}

export async function sessionMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const fetchHeaders = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => fetchHeaders.append(key, v));
        } else {
          fetchHeaders.append(key, value);
        }
      }
    }

    const sessionData = await auth.api.getSession({
      headers: fetchHeaders,
    });

    if (!sessionData) {
      return res.status(401).json({ error: "No active session" });
    }

    req.user = sessionData.user;

    next();
  } catch (err: any) {
    console.error("Session validation failed:", err);
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}
