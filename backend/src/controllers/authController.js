import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendResponse } from "../utils/sendResponse.js";

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // ── Validate required fields ─────────────────────────────────────────────
        if (!name || !email || !password) {
            return sendResponse(res, 400, false, "Please provide name, email and password");
        }

        // ── Check if user already exists ─────────────────────────────────────────
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendResponse(res, 400, false, "Email already registered");
        }

        // ── Create user ──────────────────────────────────────────────────────────
        const user = await User.create({ name, email, password });

        // ── Generate token ───────────────────────────────────────────────────────
        const token = generateToken(user._id);

        return sendResponse(res, 201, true, "Account created successfully", {
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // ── Validate required fields ─────────────────────────────────────────────
        if (!email || !password) {
            return sendResponse(res, 400, false, "Please provide email and password");
        }

        // ── Find user (include password for comparison) ──────────────────────────
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return sendResponse(res, 401, false, "Invalid email or password");
        }

        // ── Compare password ─────────────────────────────────────────────────────
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return sendResponse(res, 401, false, "Invalid email or password");
        }

        // ── Generate token ───────────────────────────────────────────────────────
        const token = generateToken(user._id);

        return sendResponse(res, 200, true, "Login successful", {
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Forgot password (mock — returns reset token in response)
// @route   POST /api/auth/forgot-password
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return sendResponse(res, 400, false, "Please provide your email");
        }

        const user = await User.findOne({ email });

        // ── Always return success to prevent email enumeration ───────────────────
        if (!user) {
            return sendResponse(
                res,
                200,
                true,
                "If that email exists, a reset link has been sent"
            );
        }

        // ── Mock reset token (no email service needed for assessment) ────────────
        const resetToken = generateToken(user._id);

        return sendResponse(
            res,
            200,
            true,
            "If that email exists, a reset link has been sent",
            {
                // Only expose in development for testing
                ...(process.env.NODE_ENV === "development" && { resetToken }),
            }
        );
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        return sendResponse(res, 200, true, "User profile fetched", {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                address: user.address,
            },
        });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
export const updateProfile = async (req, res, next) => {
    try {
        const { name, avatar, address } = req.body;

        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (avatar) user.avatar = avatar;
        if (address) user.address = { ...user.address, ...address };

        const updatedUser = await user.save();

        return sendResponse(res, 200, true, "Profile updated successfully", {
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                address: updatedUser.address,
            },
        });
    } catch (error) {
        next(error);
    }
};