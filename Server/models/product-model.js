const mongoose = require('mongoose');
const Category = require('./product-category-model')


const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: [true, "name is required"],
        minlength: [2, "Name to short"]
    },

    productDescription: {
        type: String,
        required: [true, "desc is required"],
        minlength: [20, "desc to short"]
    },

    productPrice: {
        type: Number,
        required: [true, "price is required"],
        validate: {
            validator: value => value >= 0,
            message: "price cannot be negative"
        }
    },

    productImg: String,

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "category is required"],
    },


}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
})

productSchema.virtual("category", {
    ref: "Category",
    localField: "categoryId",
    foreignField: "_id",
    justOne: true
})



const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product