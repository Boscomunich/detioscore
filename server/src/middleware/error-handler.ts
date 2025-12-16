import { Request, Response, NextFunction } from "express";
import AppError from "./error";
import { logger } from "../logger";

interface MongooseValidationError extends Error {
  errors?: Record<string, { message: string }>;
}

interface MongooseDuplicateKeyError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

// This handler will catch both AppError and raw errors
export const globalErrorHandler = (
  err: AppError | MongooseValidationError | MongooseDuplicateKeyError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // For AppError instances, use their properties directly
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      statusCode: err.statusCode,
      isOperational: err.isOperational,
    });
  }

  let statusCode = 500;
  let status = "error";
  let message = err.message || "Something went wrong";

  if (err.name === "ValidationError" && "errors" in err) {
    statusCode = 400;
    message = Object.values(err.errors!)
      .map((el) => el.message)
      .join(". ");
    status = "fail";
  }

  if ("code" in err && err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value: ${JSON.stringify(err.keyValue)}`;
    status = "fail";
  }

  logger.error({
    message: err.message,
    statusCode,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  res.status(statusCode).json({
    status,
    message,
    statusCode,
  });
};
