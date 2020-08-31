let origin;
if (process.env.NODE_ENV === "production") {
    global.config = require('./config.prod.json');
    origin = 'http://localhost:4200'
} else {
    global.config = require('./config.dev.json');
    origin = 'http://localhost:4200'
}
require("./data-access-layer/dal");
const express = require('express');
const authController = require('./controllers/authentication-controller');
const adminController = require('./controllers/admin-controller');
const userController = require('./controllers/user-controller');
const path = require("path");
const fileUpload = require("express-fileupload");
const server = express();

const cors = require('cors');
server.use(cors({
    origin: origin,
    credentials: true
}));

server.use(fileUpload());
server.use(express.static(path.join(__dirname, "./")));
server.use(express.json());
server.use('/api/auth', authController);
server.use('/api/admin', adminController);
server.use('/api/user', userController);
server.use('*', (request, response) => response.sendStatus(404));
server.listen(3000, () => console.log("Listening on http://localhost:3000"));