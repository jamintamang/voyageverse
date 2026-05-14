import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/overview", (req, res) => {
  res.json({
    success: true,
    data: {
      totalViews: 128400,
      engagementRate: 6.8,
      profileVisits: 8420,
      revenueUsd: 12400,
      brandRequests: 14,
      aiContentScore: 86,
      growthPct: 12.4,
    },
  });
});

router.get("/series", (req, res) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  res.json({
    success: true,
    data: days.map((d, i) => ({
      name: d,
      views: 4000 + i * 820 + (i % 3) * 400,
      engagement: 1200 + i * 110,
    })),
  });
});

router.get("/audience", (req, res) => {
  res.json({
    success: true,
    data: [
      { name: "18-24", value: 22 },
      { name: "25-34", value: 38 },
      { name: "35-44", value: 24 },
      { name: "45+", value: 16 },
    ],
  });
});

export default router;
