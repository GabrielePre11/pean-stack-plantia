import { prisma } from "@/lib/prisma";
import { NextFunction, Request, Response } from "express";
import { updateCategory } from "./category.controller";

export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // The ID of the user who's logged in.
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. You must be logged in." });
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            plant: {
              include: {
                category: true,
                reviews: true,
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    return res.status(200).json({
      wishlistId: wishlist.id,
      items: wishlist.items.map((item) => item.plant),
      totalItems: wishlist.items.length,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (
  req: Request<{ slug: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    // The ID of the user who's logged in.
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. You must be logged in." });
    }

    const plant = await prisma.plant.findUnique({
      where: { slug: req.params.slug },
    });

    if (!plant) {
      return res.status(404).json({ message: "Plant not found." });
    }

    /**
     * @ Transaction is used to execute multiple queries in a single transaction.
     * @ It's extremely useful in scenarios like Wishlist or Cart for example.
     * @ Prisma Docs: Allows the running of a sequence of read/write operations
     * that are guaranteed to either succeed or fail as a whole.
     */

    await prisma.$transaction(async (prisma) => {
      const wishlist = await prisma.wishlist.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      const existingWishlistItem = await prisma.wishlistItem.findUnique({
        where: {
          wishlistId_plantId: {
            wishlistId: wishlist.id,
            plantId: plant.id,
          },
        },
      });

      if (existingWishlistItem) {
        await prisma.wishlistItem.delete({
          where: {
            wishlistId_plantId: {
              wishlistId: wishlist.id,
              plantId: plant.id,
            },
          },
        });
      } else {
        await prisma.wishlistItem.create({
          data: {
            wishlistId: wishlist.id,
            plantId: plant.id,
          },
          include: {
            plant: true,
          },
        });
      }
    });

    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            plant: {
              include: {
                category: true,
                reviews: true,
              },
            },
          },
        },
      },
    });

    if (!updatedWishlist) {
      return res.status(200).json({
        wishlistId: null,
        items: [],
        totalItems: 0,
      });
    }

    return res.status(200).json({
      wishlistId: updatedWishlist.id,
      items: updatedWishlist.items.map((item) => item.plant),
      totalItems: updatedWishlist.items.length,
    });
  } catch (error) {
    next(error);
  }
};
