const mongoose = require('mongoose');

const shoppingCartItemSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: [true, "amount is required"],
        validate: {
            validator: value => value >= 0,
            message: "amount cannot be negative"
        }
    },

    totalPrice: {
        type: Number,
        required: [true, "total price is required"],
        validate: {
            validator: value => value >= 0,
            message: "price cannot be negative"
        }
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "productId is required"]
    },

    shoppingCartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShoppingCart",
        required: [true, "shoppingCartId is required"]

    },

}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
})

shoppingCartItemSchema.virtual("products", {
    ref: "Product",
    localField: "productId",
    foreignField: "_id",
    justOne: true
})

shoppingCartItemSchema.virtual("shoppingCarts", {
    ref: "ShoppingCart",
    localField: "shoppingCartId",
    foreignField: "_id",
    justOne: true
})



const ShoppingCartItem = mongoose.model("ShoppingCartItem", shoppingCartItemSchema, "shoppingCartItems");

module.exports = ShoppingCartItem