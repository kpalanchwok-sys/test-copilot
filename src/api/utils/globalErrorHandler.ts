import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    const message = err.issues[0]?.message || "Validation error";

    const formattedErrors = err.issues.reduce(
      (acc: Record<string, string>, issue) => {
        const field = issue.path.join(".");
        acc[field] = issue.message;
        return acc;
      },
      {},
    );

    return res.status(400).json({
      success: false,
      message, // user-friendly first error
      errors: formattedErrors,
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
