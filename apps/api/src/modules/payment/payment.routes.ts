import { Router } from "express";
import { charge_controller } from "./payment.controller";
import { auth_middleware } from "../auth/auth.middleware";

const router = Router();

router.post("/recharge", auth_middleware, charge_controller);

export default router;
