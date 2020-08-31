const Product = require("../models/product-model");
const ShoppingCart = require("../models/shopping-cart-model");
const Order = require("../models/order-model");
const ShoppingCartItem = require("../models/shopping-cart-item-model");
const Category = require("../models/product-category-model");


function getAllProducts() {
    return Product.find().populate("categoryId").exec();
}

function startShoppingCart(shoppingCart) {
    return shoppingCart.save();
}

//make an array on client side. the user adds products to array and with each addition a request is send with the new array to replace the old one in the database 
async function addItemToCart(item) {
    return item.save().then(item => item.populate("productId").execPopulate());
    // return ShoppingCartItem.find({ shoppingCartId: { $eq: item.shoppingCartId } }).populate("productId").exec()
}

async function removeItemFromCart(item_id) {
    return ShoppingCartItem.deleteOne({ _id: { $eq: item_id } }).exec()
}

function clearCart(_id) {
    return ShoppingCart.deleteOne({ _id }).exec().then(() => {
        ShoppingCartItem.deleteMany({ shoppingCartId: { $eq: _id } }).exec()
    });
}

async function completeShoppingCart(cart) {
    const info = await ShoppingCart.updateOne({ _id: cart._id }, cart).exec();
    return info.n ? cart : null;
}

function createOrder(order) {
    return order.save();
}

function getOrdersOfUser(user_id) {
    return Order.find({ userId: { $eq: user_id } }).exec();
}

function getAllItemsInCart(cart_id) {
    return ShoppingCartItem.find({ shoppingCartId: { $eq: cart_id } }).populate("productId").exec()
}

function getCart(user_id) {
    return ShoppingCart.findOne({ userId: { $eq: user_id }, payedAndCompleted: { $eq: false } })
}

function searchProducts(text) {
    return Product.find({ productName: { $regex: text, $options: "i" } }).exec();
}

async function searchFilteredProduct(text, categoryArray) {
    let products = []
    for (let category of categoryArray) {
        let product = await Product.find({
            productName: { $regex: text, $options: "i" },
            categoryId: { $eq: category }
        }).exec();
        for (let item of product) {
            products.push(item);
        }
    }
    return products
}

async function getProductsByCategory(categoryArray) {
    let products = []
    for (let category of categoryArray) {
        let product = await Product.find({ categoryId: { $eq: category } }).exec()
        for (let item of product) {
            products.push(item);
        }
    }
    return products
}

module.exports = {
    getAllProducts,
    startShoppingCart,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    createOrder,
    getAllItemsInCart,
    getCart,
    searchProducts,
    getProductsByCategory,
    searchFilteredProduct,
    completeShoppingCart,
    getOrdersOfUser
}