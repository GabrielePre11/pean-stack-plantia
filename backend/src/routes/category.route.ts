import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "@/controllers/category.controller";
import { roleMiddlware } from "@/middlewares/role.middleware";
import { tokenMiddleare } from "@/middlewares/token.middleware";
import express from "express";

const router = express.Router();

router.post("/create", tokenMiddleare, roleMiddlware, createCategory);
router.put("/update/:slug", tokenMiddleare, roleMiddlware, updateCategory);
router.delete("/delete/:slug", tokenMiddleare, roleMiddlware, deleteCategory);

router.get("/", getCategories);
router.get("/:slug", getCategory);

export default router;
