const Product = require('../models/product-model');
const Category = require('../models/product-category-model');
const hash = require("../helpers/hashing");
const uuid = require('uuid');



function addProductToStore(product) {
    return product.save();
}

async function updateProduct(productToUpdate) {
    const info = await Product.updateOne({ _id: productToUpdate._id }, productToUpdate).exec();
    return info.n ? productToUpdate : null;
}

function deleteProduct(_id) {
    return Product.deleteOne({ _id }).exec();
}

function getCategories() {
    return Category.find().exec();
}

function getOneItem(_id) {
    return Product.findOne({ _id: { $eq: _id } }).exec();
}

function addCategory(category) {
    return category.save();
}


module.exports = {
    addProductToStore,
    updateProduct,
    deleteProduct,
    getCategories,
    getOneItem,
    addCategory
}