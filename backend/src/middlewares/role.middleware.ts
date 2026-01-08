import { prisma } from "../lib/prisma";
import { Request, Response, NextFunction } from "express";

export const roleMiddlware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.id) {
    return res
      .status(401)
      .json({ message: "Unauthorized. You must be logged in." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized. You must be logged in." });
    }

    if (user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Forbidden. You are not an admin." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};
