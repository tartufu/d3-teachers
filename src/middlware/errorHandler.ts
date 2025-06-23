import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || 500;

  const messages: Record<number, string> = {
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
  };

  console.error(`[${status}] ${err.message}`);
  res.status(status).json({
    error: messages[status] || "Something went wrong",
    details: err.message,
  });
};
