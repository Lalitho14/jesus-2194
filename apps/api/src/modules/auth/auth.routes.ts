import { Router } from "express";
import {
  login_controller,
  me_controller,
  refresh_controller,
  register_controller,
} from "./auth.controller";
import { auth_middleware } from "./auth.middleware";

const router = Router();

router.post("/register", register_controller);
router.post("/login", login_controller);
router.get("/me", auth_middleware, me_controller);
router.get("/refresh", refresh_controller);

export default router;
