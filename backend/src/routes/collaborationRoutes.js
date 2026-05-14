import express from "express";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/offers", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: "ofr_01",
        brand: "Aurora Luggage",
        title: "30s hero spot — Alps winter",
        budget: "$8k–$12k",
        status: "pending",
      },
      {
        id: "ofr_02",
        brand: "Nomad Coffee Co.",
        title: "Creator residency + UGC bundle",
        budget: "$5k",
        status: "accepted",
      },
    ],
  });
});

router.post("/offers/:id/respond", requireRole("Creator"), (req, res) => {
  const { decision } = req.body;
  res.json({
    success: true,
    message: `Offer ${req.params.id} marked as ${decision || "reviewed"}`,
  });
});

router.get("/discover", requireRole("Brand", "Admin"), (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: "cr_1",
        handle: "@linatrails",
        niche: "Solo hiking + film",
        matchScore: 0.91,
      },
      {
        id: "cr_2",
        handle: "@kai.drone",
        niche: "Luxury travel + aerial",
        matchScore: 0.88,
      },
    ],
  });
});

export default router;
