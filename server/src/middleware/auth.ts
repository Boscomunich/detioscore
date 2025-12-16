import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user";
import AppError from "./error";
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
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const token = extractBearerToken(req);
      if (!token) {
        throw new AppError("Missing Bearer token", 401);
      }

      req.jwtToken = token;

      const fetchHeaders = buildFetchHeaders(req);
      const session = await auth.api.getSession({ headers: fetchHeaders });

      if (!session) {
        throw new AppError("Invalid or expired token", 401);
      }

      req.user = session.user;
      next();
    } catch (err: any) {
      next(err instanceof AppError ? err : new AppError("Unauthorized", 401));
    }
  };
};

export const adminTokenAuthMiddleware = (auth: any) => {
  return async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const token = extractBearerToken(req);
      if (!token) {
        throw new AppError("Missing Bearer token", 401);
      }

      req.jwtToken = token;

      const fetchHeaders = buildFetchHeaders(req);
      const session = await auth.api.getSession({ headers: fetchHeaders });

      if (!session) {
        throw new AppError("Invalid or expired token", 401);
      }

      if (session.user.role !== "admin") {
        throw new AppError("Forbidden: Admin access required", 403);
      }

      req.user = session.user;
      next();
    } catch (err: any) {
      next(err instanceof AppError ? err : new AppError("Unauthorized", 401));
    }
  };
};
