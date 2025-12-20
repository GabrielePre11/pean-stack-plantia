import { prisma } from "@/lib/prisma";
import { SignInBody, SignUpBody } from "@/types/auth.type";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "@/utils/generateToken";

export const signUp = async (
  req: Request<{}, {}, SignUpBody>,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const alreadyExistingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (alreadyExistingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    generateToken(res, user.id, user.role);

    return res
      .status(201)
      .json({ user: user.email, message: "User created successfully." });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request<{}, {}, SignInBody>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    generateToken(res, user.id, user.role);

    return res
      .status(200)
      .json({ user: user.email, message: "Login successful." });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful." });
};

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized. You must be logged in." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({
      select: { email: true },
    });

    return res.status(200).json({ users, totalUsers: users.length });
  } catch (error) {
    next(error);
  }
};

export const getAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { email: true },
    });

    return res.status(200).json({ admins, totalAdmins: admins.length });
  } catch (error) {
    next(error);
  }
};
