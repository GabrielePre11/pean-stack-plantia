import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
};
