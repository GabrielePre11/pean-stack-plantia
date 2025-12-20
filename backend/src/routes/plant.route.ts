import {
  createPlant,
  deletePlant,
  getPlant,
  getPlants,
  updatePlant,
} from "@/controllers/plant.controller";
import { roleMiddlware } from "@/middlewares/role.middleware";
import { tokenMiddleare } from "@/middlewares/token.middleware";
import express from "express";

const router = express.Router();

router.get("/", getPlants);
router.get("/:slug", getPlant);

router.post("/create", tokenMiddleare, roleMiddlware, createPlant);
router.put("/update/:slug", tokenMiddleare, roleMiddlware, updatePlant);
router.delete("/delete/:slug", tokenMiddleare, roleMiddlware, deletePlant);

export default router;
