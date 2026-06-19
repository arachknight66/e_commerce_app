import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { sendResponse } from "../utils/sendResponse.js";

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Place a new order
// @route   POST /api/orders
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
export const placeOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod = "COD" } = req.body;

        // ── Validate shipping address ─────────────────────────────────────────────
        if (!shippingAddress?.city || !shippingAddress?.country) {
            return sendResponse(
                res,
                400,
                false,
                "Please provide city and country in shipping address"
            );
        }

        // ── Fetch user's cart ─────────────────────────────────────────────────────
        const cart = await Cart.findOne({ user: req.user._id }).populate(
            "items.product",
            "name images price stock"
        );

        if (!cart || cart.items.length === 0) {
            return sendResponse(res, 400, false, "Your cart is empty");
        }

        // ── Validate stock for all items before placing order ─────────────────────
        for (const item of cart.items) {
            if (!item.product) {
                return sendResponse(res, 400, false, "One or more products no longer exist");
            }
            if (item.product.stock < item.quantity) {
                return sendResponse(
                    res,
                    400,
                    false,
                    `Insufficient stock for ${item.product.name}. Only ${item.product.stock} left.`
                );
            }
        }

        // ── Snapshot order items from cart ────────────────────────────────────────
        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            price: item.price,               // Snapshot price at time of order
            quantity: item.quantity,
            image: item.product.images?.[0] || "",
        }));

        // ── Calculate total ───────────────────────────────────────────────────────
        const totalPrice = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // ── Create order ──────────────────────────────────────────────────────────
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
        });

        // ── Decrement stock for each product ──────────────────────────────────────
        await Promise.all(
            cart.items.map((item) =>
                Product.findByIdAndUpdate(item.product._id, {
                    $inc: { stock: -item.quantity },
                })
            )
        );

        // ── Clear cart after successful order ─────────────────────────────────────
        cart.items = [];
        await cart.save();

        return sendResponse(res, 201, true, "Order placed successfully", { order });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all orders for logged-in user
// @route   GET /api/orders
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort("-placedAt")
            .select("-__v");

        return sendResponse(res, 200, true, "Orders fetched successfully", {
            orders,
            total: orders.length,
        });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return sendResponse(res, 404, false, "Order not found");
        }

        // ── Ensure order belongs to requesting user ───────────────────────────────
        if (order.user.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "Not authorized to view this order");
        }

        return sendResponse(res, 200, true, "Order fetched successfully", { order });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Cancel an order
// @route   PATCH /api/orders/:id/cancel
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
export const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return sendResponse(res, 404, false, "Order not found");
        }

        // ── Ensure order belongs to requesting user ───────────────────────────────
        if (order.user.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, false, "Not authorized to cancel this order");
        }

        // ── Only pending or processing orders can be cancelled ────────────────────
        if (!["pending", "processing"].includes(order.status)) {
            return sendResponse(
                res,
                400,
                false,
                `Order cannot be cancelled — current status is ${order.status}`
            );
        }

        // ── Restore stock ─────────────────────────────────────────────────────────
        await Promise.all(
            order.items.map((item) =>
                Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity },
                })
            )
        );

        order.status = "cancelled";
        await order.save();

        return sendResponse(res, 200, true, "Order cancelled successfully", { order });
    } catch (error) {
        next(error);
    }
};