import {
  checkAuth,
  getAdmins,
  getUsers,
  signIn,
  signOut,
  signUp,
} from "@/controllers/auth.controller";
import { roleMiddlware } from "@/middlewares/role.middleware";
import { tokenMiddleare } from "@/middlewares/token.middleware";
import express from "express";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);

router.get("/check-auth", tokenMiddleare, checkAuth);

// Dashboard Routes
router.get("/users", tokenMiddleare, roleMiddlware, getUsers);
router.get("/admins", tokenMiddleare, roleMiddlware, getAdmins);

export default router;
