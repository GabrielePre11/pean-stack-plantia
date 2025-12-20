import { getWishlist, toggleWishlist } from "@/controllers/wishlist.controller";
import { tokenMiddleare } from "@/middlewares/token.middleware";
import express from "express";

const router = express.Router();

router.get("/", tokenMiddleare, getWishlist);
router.post("/:slug", tokenMiddleare, toggleWishlist);

export default router;
