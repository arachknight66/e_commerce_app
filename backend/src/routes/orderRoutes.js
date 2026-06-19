import express from "express";
import {
    placeOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── All order routes are protected ────────────────────────────────────────────
router.use(protect);

router.post("/", placeOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);
router.patch("/:id/cancel", cancelOrder);

export default router;