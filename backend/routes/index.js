import express from "express";
import authRoutes from "./auth.js";
import pageRoutes from "./pages.js";
import systemRoutes from "./system.js";

const router = express.Router();

// Mount route modules
router.use("/", authRoutes);
router.use("/", pageRoutes);
router.use("/system", systemRoutes);

export default router;
