import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
} from "@/controllers/cart.controller";
import { tokenMiddleare } from "@/middlewares/token.middleware";
import express from "express";

const router = express.Router();

router.get("/", tokenMiddleare, getCart);
router.put("/clear", tokenMiddleare, clearCart);

router.post("/:slug", tokenMiddleare, addToCart);
router.delete("/:slug", tokenMiddleare, removeFromCart);

export default router;
