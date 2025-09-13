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
const globalErrorHandler = (
  err: AppError | MongooseValidationError | MongooseDuplicateKeyError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = (err as AppError).statusCode || 500;
  let status = (err as AppError).status || "error";
  let message = err.message || "Something went wrong";

  // Handle Mongoose validation errors
  if (err.name === "ValidationError" && "errors" in err) {
    statusCode = 400;
    message = Object.values(err.errors!)
      .map((el) => el.message)
      .join(". ");
    status = "fail";
  }

  // Handle Mongoose duplicate key errors
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
  });
};

export default globalErrorHandler;
