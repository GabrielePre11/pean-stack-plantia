import { prisma } from "@/lib/prisma";
import { NextFunction, Request, Response } from "express";
import slugify from "slugify";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.category.findMany();

    if (categories.length === 0) {
      return res.status(200).json({ categories: [] });
    }

    return res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (
  req: Request<{ slug: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const plants = await prisma.plant.findMany({
      where: { categoryId: category.id },
      include: { category: true },
    });

    return res.status(200).json({ categoryPlants: plants });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request<{}, {}, { name: string }>,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "The name field is required." });
    }

    const categorySlug = slugify(name, { lower: true, strict: true });

    const existingCategory = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists." });
    }

    const category = await prisma.category.create({
      data: { name, slug: categorySlug },
    });

    return res
      .status(201)
      .json({ category, message: "Category created successfully." });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request<{ slug: string }, {}, { name: string }>,
  res: Response,
  next: NextFunction
) => {
  const name = req.body.name;

  try {
    if (!name) {
      return res.status(400).json({ message: "The name field is required." });
    }

    const categorySlug = slugify(name, { lower: true, strict: true });

    const existingCategory = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists." });
    }

    const category = await prisma.category.update({
      where: { slug: req.params.slug },
      data: { name, slug: categorySlug },
    });

    return res
      .status(200)
      .json({ category, message: "Category updated successfully." });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request<{ slug: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await prisma.category.delete({
      where: { slug: req.params.slug },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res
      .status(200)
      .json({ category, message: "Category deleted successfully." });
  } catch (error) {
    next(error);
  }
};
