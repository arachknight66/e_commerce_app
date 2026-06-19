import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { sendResponse } from "../utils/sendResponse.js";

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
export const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate(
            "items.product",
            "name images price stock"
        );

        if (!cart) {
            return sendResponse(res, 200, true, "Cart is empty", {
                cart: { items: [], totalPrice: 0, totalItems: 0 },
            });
        }

        return sendResponse(res, 200, true, "Cart fetched successfully", { cart });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return sendResponse(res, 400, false, "Product ID is required");
        }

        // ── Validate product exists and is in stock ───────────────────────────────
        const product = await Product.findById(productId);
        if (!product) {
            return sendResponse(res, 404, false, "Product not found");
        }
        if (product.stock < 1) {
            return sendResponse(res, 400, false, "Product is out of stock");
        }

        // ── Find or create cart ───────────────────────────────────────────────────
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // ── Check if product already in cart ─────────────────────────────────────
        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            // ── Validate stock for updated quantity ─────────────────────────────────
            const newQty = existingItem.quantity + Number(quantity);
            if (newQty > product.stock) {
                return sendResponse(
                    res,
                    400,
                    false,
                    `Only ${product.stock} units available`
                );
            }
            existingItem.quantity = newQty;
        } else {
            cart.items.push({
                product: productId,
                quantity: Number(quantity),
                price: product.price,
            });
        }

        await cart.save();

        // ── Return populated cart ─────────────────────────────────────────────────
        const updatedCart = await Cart.findById(cart._id).populate(
            "items.product",
            "name images price stock"
        );

        return sendResponse(res, 200, true, "Item added to cart", {
            cart: updatedCart,
        });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update item quantity in cart
// @route   PATCH /api/cart/update/:itemId
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
export const updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const { itemId } = req.params;

        if (!quantity || quantity < 1) {
            return sendResponse(res, 400, false, "Quantity must be at least 1");
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return sendResponse(res, 404, false, "Cart not found");
        }

        // ── Find item in cart ─────────────────────────────────────────────────────
        const item = cart.items.id(itemId);
        if (!item) {
            return sendResponse(res, 404, false, "Item not found in cart");
        }

        // ── Validate stock ────────────────────────────────────────────────────────
        const product = await Product.findById(item.product);
        if (Number(quantity) > product.stock) {
            return sendResponse(
                res,
                400,
                false,
                `Only ${product.stock} units available`
            );
        }

        item.quantity = Number(quantity);
        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate(
            "items.product",
            "name images price stock"
        );

        return sendResponse(res, 200, true, "Cart updated successfully", {
            cart: updatedCart,
        });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
export const removeFromCart = async (req, res, next) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return sendResponse(res, 404, false, "Cart not found");
        }

        // ── Remove item by subdocument ID ─────────────────────────────────────────
        cart.items = cart.items.filter(
            (item) => item._id.toString() !== itemId
        );

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate(
            "items.product",
            "name images price stock"
        );

        return sendResponse(res, 200, true, "Item removed from cart", {
            cart: updatedCart,
        });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
export const clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return sendResponse(res, 200, true, "Cart is already empty", {
                cart: { items: [], totalPrice: 0, totalItems: 0 },
            });
        }

        cart.items = [];
        await cart.save();

        return sendResponse(res, 200, true, "Cart cleared successfully", {
            cart: { items: [], totalPrice: 0, totalItems: 0 },
        });
    } catch (error) {
        next(error);
    }
};