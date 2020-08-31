const mongoose = require('mongoose');
const ShoppingCartItem = require('./shopping-cart-item-model');
const User = require('./user-model');

const shoppingCartSchema = mongoose.Schema({
    creationDate: Date,


    payedAndCompleted: {
        type: Boolean,
        required: [true, "isPayed"]
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Must have user Id"]
    },


}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
})

shoppingCartSchema.virtual("users", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true
})



const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema, "shoppingCarts");

module.exports = ShoppingCart