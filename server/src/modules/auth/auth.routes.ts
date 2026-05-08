import { Router } from "express";
import {
  loginController,
  signupController,
} from "./auth.controller";
import { refreshTokenController } from "./auth.controller";
import { logoutController } from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", protect, logoutController);

export default router;