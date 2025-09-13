import { NextFunction, Request, Response } from "express";
import { jwtVerify, createRemoteJWKSet, JWTPayload } from "jose";
import dotenv from "dotenv";

dotenv.config();

// Extend Express Request
interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

// Create JWKS client
const JWKS = createRemoteJWKSet(
  new URL(`${process.env.BETTER_AUTH_URL}/api/auth/jwks`)
);

export async function verifyUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Support both Authorization header and cookie
    const token = req.cookies?.["better-auth.session_data"];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.BETTER_AUTH_URL!,
      audience: process.env.BETTER_AUTH_URL!,
    });

    req.user = payload;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export async function verifyAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Support both Authorization header and cookie
    const token = req.cookies?.["better-auth.session_data"];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.BETTER_AUTH_URL!,
      audience: process.env.BETTER_AUTH_URL!,
    });

    req.user = payload as JWTPayload & { role?: string };

    if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
