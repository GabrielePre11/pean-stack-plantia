import { JWT_PayLoad_Type } from "../types/auth.type";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const tokenMiddleare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. You must be logged in." });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env file.");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JWT_PayLoad_Type;

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};
