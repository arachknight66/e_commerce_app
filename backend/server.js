import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import { PORT } from "./src/config/config.js";

// Route imports (uncomment as you build each module)
import authRoutes from "./src/routes/authRoutes.js";
// import productRoutes from "./src/routes/productRoutes.js";
// import cartRoutes from "./src/routes/cartRoutes.js";
// import orderRoutes from "./src/routes/orderRoutes.js";

import { errorHandler } from "./src/middleware/errorMiddleware.js";

const app = express();

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ message: "E-Commerce API is running ✓", status: "ok" });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/cart",     cartRoutes);
// app.use("/api/orders",   orderRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res, next) => {
    const error = new Error(`Route not found — ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});

export default app;