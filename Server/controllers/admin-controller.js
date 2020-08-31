const express = require("express");
const adminLogic = require('../business-logic/admin-logic')
const jwt = require('jsonwebtoken');
const router = express.Router();
const errorHandler = require("../helpers/error-handler");
const Product = require("../models/product-model");
const fs = require("fs")
const checkAdmin = require('../middleware/admin-middleware');
const verifyLoggedIn = require('../middleware/verify-logged-in');
const Category = require("../models/product-category-model");
const uuid = require("uuid");


router.post("/postCategory", checkAdmin, async(request, response) => {
    try {
        const category = new Category(request.body);
        const newCategory = await adminLogic.addCategory(category);
        response.json({ newCategory });
    } catch (err) {
        response.status(500).send(err.message);
    }
})


router.get("/getOneProduct/:_id", checkAdmin, async(request, response) => {
    try {
        _id = request.params._id;
        const product = await adminLogic.getOneItem(_id);
        response.json({ product })
    } catch (err) {
        response.status(500).send(err.message);
    }
})


router.get("/getCategories", verifyLoggedIn, async(request, response) => {
    try {
        const categories = await adminLogic.getCategories();
        response.json({ categories })
    } catch (err) {
        response.status(500).send(err.message);
    }
})

router.delete("/deleteProduct/:_id", checkAdmin, async(request, response) => {
    try {
        const _id = request.params._id;
        const product = await adminLogic.getOneItem(_id);
        console.log(product.productImg)
        if (product.productImg != 'noImageEntered') {
            fs.unlink(`./uploads/${product.productImg}`, (err) => {
                if (err) {
                    console.error(err)
                }
                console.log(`${product.productImg} has been deleted`)
            })
        }
        await adminLogic.deleteProduct(_id);
        response.sendStatus(204);
    } catch (err) {
        response.status(500).send(err.message);
    }
})


router.post("/addProduct", checkAdmin, async(request, response) => {
    try {
        const product = new Product(JSON.parse(request.body.info));
        const error = await product.validate();
        if (!request.files.file) {
            product.productImg = 'noImageEntered'
        }
        if (request.files.file) {
            const image = request.files.file;
            const extension = image.name.substr(image.name.lastIndexOf('.'))
            const newFileName = uuid.v4() + extension;
            product.productImg = newFileName
            image.mv("./uploads/" + newFileName)
        }
        const newProduct = await adminLogic.addProductToStore(product);
        response.status(201).json({ newProduct });
        if (error) {
            response.status(400).send(error.message);
            return;
        }
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})


router.put("/update/:_id", checkAdmin, async(request, response) => {
    try {
        const product = new Product(request.body);
        product._id = request.params._id;
        if (!request.files.file) {
            product.productImg = 'noImageEntered'
        }
        if (request.files.file) {
            const image = request.files.file;
            const extension = image.name.substr(image.name.lastIndexOf('.'))
            const newFileName = uuid.v4() + extension;
            product.productImg = newFileName
            image.mv("./uploads/" + newFileName)
        }

        const updatedProduct = await adminLogic.updateProduct(product);
        if (!updatedProduct) {
            response.sendStatus(404);
            return;
        }
        console.log(updatedProduct)
        response.json(updatedProduct);
    } catch (err) {
        response.status(500).send(err.message);
    }
});


router.patch("/update/:_id", checkAdmin, async(request, response) => {
    try {
        const product = new Product(JSON.parse(request.body.info));
        product._id = request.params._id;
        if (request.files) {
            const image = request.files.file;
            const extension = image.name.substr(image.name.lastIndexOf('.'))
            const newFileName = uuid.v4() + extension;
            product.productImg = newFileName
            image.mv("./uploads/" + newFileName)
        }
        const updatedProduct = await adminLogic.updateProduct(product);
        if (!updatedProduct) {
            response.sendStatus(404);
            return;
        }
        response.json(updatedProduct);
    } catch (err) {
        response.status(500).send(err.message);
    }
});





module.exports = router;