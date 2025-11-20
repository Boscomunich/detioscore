import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
  jwtToken?: string;
}

function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return null;
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

function buildFetchHeaders(req: Request): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => headers.append(key, v));
    } else {
      headers.append(key, value as string);
    }
  }
  return headers;
}

export const tokenAuthMiddleware = (auth: any) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = extractBearerToken(req);
      if (!token) {
        return res.status(401).json({ error: "Missing Bearer token" });
      }

      req.jwtToken = token;

      const fetchHeaders = buildFetchHeaders(req);

      const session = await auth.api.getSession({ headers: fetchHeaders });
      if (!session) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      req.user = session.user;
      next();
    } catch (err) {
      console.error("Token validation failed:", err);
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
};

export const adminTokenAuthMiddleware = (auth: any) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = extractBearerToken(req);
      if (!token) {
        return res.status(401).json({ error: "Missing Bearer token" });
      }

      req.jwtToken = token;

      const fetchHeaders = buildFetchHeaders(req);

      const session = await auth.api.getSession({ headers: fetchHeaders });
      if (!session) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      if (session.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Forbidden: Admin access required" });
      }

      req.user = session.user;
      next();
    } catch (err) {
      console.error("Admin token validation failed:", err);
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
};
