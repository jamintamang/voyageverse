import express from "express";
import * as aiController from "../controllers/aiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { aiLimiter } from "../middleware/aiRateLimit.js";

const router = express.Router();

router.use(authMiddleware, aiLimiter);

router.post("/caption", aiController.caption);
router.post("/hashtags", aiController.hashtags);
router.post("/bio", aiController.bio);
router.post("/story", aiController.story);
router.post("/embed", aiController.embed);

export default router;
