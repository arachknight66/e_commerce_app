import express from "express";
import {
    getProducts,
    getProductById,
    getFeaturedProducts,
    getCategories,
} from "../controllers/productController.js";

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

export default router;