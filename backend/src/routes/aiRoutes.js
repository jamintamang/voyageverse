import express from "express";

const router = express.Router();

router.post("/caption", async (req, res) => {
  try {
    res.json({
      message: "AI caption route working",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
