import { prisma } from "@/lib/prisma";
import { ReviewBody } from "@/types/review.type";
import { NextFunction, Request, Response } from "express";

export const getHomeReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await prisma.review.findMany({
      include: { user: { select: { name: true } } },
    });

    if (reviews.length === 0) {
      return res
        .status(200)
        .json({ reviews: [], message: "There are no reviews yet." });
    }

    return res.status(200).json({ reviews });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const plantId = Number(req.params.id);

    const reviews = await prisma.review.findMany({
      where: { plantId },
      include: { user: { select: { email: true, name: true } } },
    });

    if (reviews.length === 0) {
      return res
        .status(200)
        .json({ reviews: [], message: "There are no reviews yet." });
    }

    const totalReviews = await prisma.review.count({ where: { plantId } });
    const lastReviewCreatedAt =
      reviews[reviews.length - 1].createdAt.toISOString();

    return res.status(200).json({ totalReviews, lastReviewCreatedAt, reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (
  req: Request<{ id: string }, {}, ReviewBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const plantId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required." });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    const review = await prisma.review.upsert({
      where: { userId_plantId: { userId, plantId } },
      update: { rating, comment },
      create: { rating, comment, userId, plantId },
      include: { user: { select: { email: true, name: true } } },
    });

    return res.status(201).json({
      review,
      message: `A new review on plant ${plantId} was created`,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: Request<{ id: string }, {}, Partial<ReviewBody>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const plantId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "There are no fields to update." });
    }

    if (updateData.rating) {
      if (updateData.rating < 1 || updateData.rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5." });
      }
    }

    const review = await prisma.review.update({
      where: { userId_plantId: { userId, plantId } },
      data: updateData,
      include: { user: { select: { email: true, name: true } } },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    return res.status(200).json({
      review,
      message: `The review on plant ${plantId} was updated successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const plantId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const review = await prisma.review.delete({
      where: { userId_plantId: { userId, plantId } },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    return res.status(200).json({
      review,
      message: `The review on plant ${plantId} was deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
