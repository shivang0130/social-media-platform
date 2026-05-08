import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);

router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed",
  });
});

export default router;