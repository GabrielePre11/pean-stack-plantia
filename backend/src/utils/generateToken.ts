import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (
  res: Response,
  id: number,
  role: "USER" | "ADMIN"
) => {
  if (!process.env.JWT_SECRET || !process.env.NODE_ENV) {
    throw new Error("JWT_SECRET or NODE_ENV is not defined in .env file.");
  }

  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true, // It prevents XSS attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // It prevents CSRF attacks
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
  });

  return token;
};
