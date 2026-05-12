import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
  try {
    res.json({
      message: "Register route working",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
