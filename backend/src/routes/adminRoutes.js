import express from "express";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware, requireRole("Admin"));

router.get("/stats", (req, res) => {
  res.json({
    success: true,
    data: {
      activeUsers: 18420,
      flaggedContent: 3,
      aiTokens24h: 1.2e6,
      mrrUsd: 48200,
    },
  });
});

router.get("/users", (req, res) => {
  res.json({
    success: true,
    data: [
      { uid: "u1", email: "creator@vv.app", role: "Creator", status: "active" },
      { uid: "u2", email: "brand@vv.app", role: "Brand", status: "active" },
    ],
  });
});

export default router;
