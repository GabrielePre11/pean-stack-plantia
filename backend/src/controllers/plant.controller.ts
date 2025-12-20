import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { PlantBody, PlantQuery } from "@/types/plant.type";
import { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import Decimal from "decimal.js";

export const getPlants = async (
  req: Request<{}, {}, {}, Partial<PlantQuery>>,
  res: Response,
  next: NextFunction
) => {
  try {
    //============ Filters ============//
    const { categoryId, sort, careLevel, light, water, page, limit, search } =
      req.query;

    const where: Prisma.PlantWhereInput = {};
    const orderBy: Prisma.PlantOrderByWithRelationInput = {};

    // Filter by category
    if (categoryId) {
      // We need to convert to Number() because in a query param. everything is a string.
      if (Array.isArray(categoryId)) {
        where["categoryId"] = { in: categoryId.map((id) => Number(id)) };
      } else {
        where["categoryId"] = Number(categoryId);
      }
    }

    // Filter by sort
    if (sort === "newest") orderBy["createdAt"] = "desc";
    if (sort === "oldest") orderBy["createdAt"] = "asc";
    if (sort === "priceAsc") orderBy["price"] = "asc";
    if (sort === "priceDesc") orderBy["price"] = "desc";

    // Filter by careLevel | light | water
    if (careLevel) where["careLevel"] = careLevel;
    if (light) where["light"] = light;
    if (water) where["water"] = water;

    // Filter by search
    if (search) {
      where["OR"] = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    //============ Pagination ============//
    const pageNumber = Number(page) || 1;
    const plantsLimit = Number(limit) || 10;
    const skip = (pageNumber - 1) * plantsLimit;
    const take = plantsLimit;

    const totalPlants = await prisma.plant.count({ where });
    const totalPages = Math.ceil(totalPlants / plantsLimit);

    const plants = await prisma.plant.findMany({
      where,
      orderBy,
      include: { category: true },
      skip,
      take,
    });

    if (plants.length === 0) {
      return res.status(200).json({ plants: [] });
    }

    return res.status(200).json({
      plantsCount: plants.length,
      count: totalPlants,
      pages: totalPages,
      page: pageNumber,
      limit: plantsLimit,
      plants,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlant = async (
  req: Request<{ slug: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const plant = await prisma.plant.findUnique({
      where: { slug: req.params.slug },
      include: { category: true },
    });

    if (!plant) {
      return res.status(404).json({ message: "Plant not found." });
    }

    const reviews = await prisma.review.findMany({
      where: { plantId: plant.id },
      include: { user: { select: { email: true, name: true } } },
    });

    const totalReviews = await prisma.review.count({
      where: { plantId: plant.id },
    });

    const reviewsSum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalReviews > 0 ? reviewsSum / totalReviews : 0;

    return res
      .status(200)
      .json({ plant, totalReviews, averageRating, reviews });
  } catch (error) {
    next(error);
  }
};

export const createPlant = async (
  req: Request<{}, {}, PlantBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      image,
      additionalImages,
      categoryId,
      careLevel,
      light,
      water,
      price,
      stock,
      isActive,
    } = req.body;

    if (
      !name ||
      !description ||
      !image ||
      !careLevel ||
      !light ||
      !water ||
      price === undefined ||
      stock === undefined ||
      isActive === undefined
    ) {
      return res.status(400).json({ message: "These fields are required." });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existingPlant = await prisma.plant.findUnique({ where: { slug } });

    if (existingPlant) {
      return res.status(400).json({ message: "Plant already exists." });
    }

    if (isNaN(price) || isNaN(stock)) {
      return res
        .status(400)
        .json({ message: "Price and stock must be numbers." });
    }

    const plant = await prisma.plant.create({
      data: {
        name,
        slug,
        description,
        image,
        additionalImages: additionalImages ?? [],
        categoryId,
        careLevel,
        light,
        water,
        price: new Decimal(price),
        stock,
        isActive,
      },
    });

    return res.status(201).json({ plant });
  } catch (error) {
    next(error);
  }
};

export const updatePlant = async (
  req: Request<{ slug: string }, {}, Partial<PlantBody>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "There are no fields to update." });
    }

    const plant = await prisma.plant.update({
      where: { slug: req.params.slug },
      data: updateData,
    });

    if (!plant) {
      return res.status(404).json({ message: "Plant not found." });
    }

    return res
      .status(200)
      .json({ plant, message: "Plant updated successfully." });
  } catch (error) {
    next(error);
  }
};

export const deletePlant = async (
  req: Request<{ slug: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const plant = await prisma.plant.delete({
      where: { slug: req.params.slug },
    });

    if (!plant) {
      return res.status(404).json({ message: "Plant not found." });
    }

    return res
      .status(200)
      .json({ plant, message: "Plant deleted successfully." });
  } catch (error) {
    next(error);
  }
};
