const express = require("express");
const authLogic = require('../business-logic/authentication-logic')
const jwt = require('jsonwebtoken');
const router = express.Router();
const errorHandler = require("../helpers/error-handler");
const User = require('../models/user-model');
const checkAdmin = require('../middleware/admin-middleware');
const verifyLogged = require('../middleware/verify-logged-in');
const { json } = require("express");



router.post("/register", async(request, response) => {
    try {
        const newUserDetails = new User(request.body);
        const error = await newUserDetails.validate();
        if (error) {
            response.status(400).send(error.message);
            return;
        }
        const validation = await authLogic.validateRegister(newUserDetails.usernameEmail);
        if (validation) {
            response.status(403).send('User Already exists in system!')
            return
        }
        const user = await authLogic.register(newUserDetails);
        const token = jwt.sign({ user }, config.jwt.secretKey, { expiresIn: "50h" })
        response.status(201).json({ user, token });
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

router.get("/validateInfo/:userName", async(request, response) => {
    try {
        userName = request.params.userName;
        const validation = await authLogic.validateRegister(userName);
        if (validation) {
            response.status(403).send('User Already exists in system!')
            return;
        }
        response.json(true);
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})


router.post("/login", async(request, response) => {
    try {
        const credentials = new User(request.body);
        const user = await authLogic.login(credentials);
        if (!user) {
            response.status(401).send("Incorrect username or password");
            return;
        }
        const token = jwt.sign({ user }, config.jwt.secretKey, { expiresIn: "50h" })
        response.json({ user, token });
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

router.get('/is-admin', checkAdmin, async(request, response) => {
    try {
        response.json(true)
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));

    }
})
router.get('/is-loggedIn', verifyLogged, async(request, response) => {
    try {
        response.json(true)
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));

    }
})


module.exports = router;