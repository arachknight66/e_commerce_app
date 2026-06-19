import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
            min: [1, "Quantity must be at least 1"],
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { _id: true }
);

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ─── Virtual: total price ─────────────────────────────────────────────────────
cartSchema.virtual("totalPrice").get(function () {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

// ─── Virtual: total items count ───────────────────────────────────────────────
cartSchema.virtual("totalItems").get(function () {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;