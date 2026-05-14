import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import collaborationRoutes from "./routes/collaborationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/collaborations", collaborationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to VoyageVerse API");
});

export default app;