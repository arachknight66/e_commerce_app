import Product from "../models/Product.js";
import { sendResponse } from "../utils/sendResponse.js";

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all products (with search, filter, pagination)
// @route   GET /api/products
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const getProducts = async (req, res, next) => {
    try {
        const {
            search,
            category,
            page = 1,
            limit = 10,
            minPrice,
            maxPrice,
            sort = "-createdAt",
        } = req.query;

        const query = {};

        // ── Search by text ────────────────────────────────────────────────────────
        if (search) {
            query.$text = { $search: search };
        }

        // ── Filter by category ────────────────────────────────────────────────────
        if (category) {
            query.category = { $regex: new RegExp(category, "i") };
        }

        // ── Filter by price range ─────────────────────────────────────────────────
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(50, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [products, total] = await Promise.all([
            Product.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limitNum),
            Product.countDocuments(query),
        ]);

        return sendResponse(res, 200, true, "Products fetched successfully", {
            products,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
                hasMore: pageNum * limitNum < total,
            },
        });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return sendResponse(res, 404, false, "Product not found");
        }

        return sendResponse(res, 200, true, "Product fetched successfully", {
            product,
        });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get featured products (for Home screen hero section)
// @route   GET /api/products/featured
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const getFeaturedProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ isFeatured: true }).limit(8);

        return sendResponse(res, 200, true, "Featured products fetched", {
            products,
        });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all unique categories
// @route   GET /api/products/categories
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const getCategories = async (req, res, next) => {
    try {
        const categories = await Product.distinct("category");

        return sendResponse(res, 200, true, "Categories fetched", {
            categories,
        });
    } catch (error) {
        next(error);
    }
};