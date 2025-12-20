import { prisma } from "@/lib/prisma";
import { NextFunction, Request, Response } from "express";
import Decimal from "decimal.js";

export const getCart = async (
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

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            plant: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    return res.status(200).json({
      items: cart.items,
      totalItems: cart.items.length,
      totalAmount: cart.items.reduce(
        (acc, item) => acc.plus(item.plant.price.times(item.quantity)),
        new Decimal(0)
      ),
      totalQuantity: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (
  req: Request<{ slug: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
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

    await prisma.$transaction(async (prisma) => {
      const cart = await prisma.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      const existingCartItem = await prisma.cartItem.findUnique({
        where: {
          cartId_plantId: {
            cartId: cart.id,
            plantId: plant.id,
          },
        },
      });

      if (existingCartItem) {
        await prisma.cartItem.update({
          where: { cartId_plantId: { cartId: cart.id, plantId: plant.id } },
          data: { quantity: existingCartItem.quantity + 1 },
          include: { plant: true },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            plantId: plant.id,
            quantity: 1,
          },
          include: { plant: true },
        });
      }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { plant: { include: { category: true } } } },
      },
    });

    return res.status(200).json({ cart: updatedCart });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (
  req: Request<{ slug: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
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

    await prisma.$transaction(async (prisma) => {
      const cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        return;
      }

      const cartItem = await prisma.cartItem.findUnique({
        where: {
          cartId_plantId: {
            cartId: cart.id,
            plantId: plant.id,
          },
        },
      });

      if (!cartItem) {
        return;
      }

      if (cartItem.quantity > 1) {
        await prisma.cartItem.update({
          where: {
            cartId_plantId: {
              cartId: cart.id,
              plantId: plant.id,
            },
          },
          data: {
            quantity: cartItem.quantity - 1,
          },
        });
      } else {
        await prisma.cartItem.delete({
          where: {
            cartId_plantId: {
              cartId: cart.id,
              plantId: plant.id,
            },
          },
        });
      }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { plant: { include: { category: true } } },
        },
      },
    });

    return res.status(200).json({ cart: updatedCart });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. You must be logged in." });
    }

    const cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      return res.status(200).json({ message: "Cart is already empty." });
    }

    await prisma.cart.update({
      where: { userId },
      data: { items: { deleteMany: {} } },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    return res
      .status(200)
      .json({ cart: updatedCart, message: "Cart cleared successfully." });
  } catch (error) {
    next(error);
  }
};
