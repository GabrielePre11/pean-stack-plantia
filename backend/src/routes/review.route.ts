import {
  createReview,
  deleteReview,
  getHomeReviews,
  getReviews,
  updateReview,
} from "@/controllers/review.controller";
import { tokenMiddleare } from "@/middlewares/token.middleware";
import express from "express";

const router = express.Router();

router.get("/", getHomeReviews);
router.get("/:id", getReviews);

router.post("/create/:id", tokenMiddleare, createReview);
router.put("/update/:id", tokenMiddleare, updateReview);
router.delete("/delete/:id", tokenMiddleare, deleteReview);

export default router;
