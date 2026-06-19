import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
import User from "../models/User.js";
import { sendResponse } from "../utils/sendResponse.js";

export const protect = async (req, res, next) => {
    try {
        // ── Extract token from Authorization header ──────────────────────────────
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendResponse(res, 401, false, "Not authorized — no token provided");
        }

        const token = authHeader.split(" ")[1];

        // ── Verify token ─────────────────────────────────────────────────────────
        const decoded = jwt.verify(token, JWT_SECRET);

        // ── Attach user to request (exclude password) ────────────────────────────
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return sendResponse(res, 401, false, "Not authorized — user no longer exists");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return sendResponse(res, 401, false, "Not authorized — invalid token");
        }
        if (error.name === "TokenExpiredError") {
            return sendResponse(res, 401, false, "Not authorized — token expired");
        }
        next(error);
    }
};