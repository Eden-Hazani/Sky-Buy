let origin;
let fileOrigin;
if (process.env.PORT) {
    origin = 'https://sky-buy.azurewebsites.net';
    global.config = require("./config.prod.json");
    fileOrigin = "./_front-end";
} else {
    origin = 'http://localhost:4200';
    global.config = require("./config.dev.json");
    fileOrigin = "./"
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
server.use(express.static(path.join(__dirname, fileOrigin)));

server.use(express.json());
server.use('/api/auth', authController);
server.use('/api/admin', adminController);
server.use('/api/user', userController);
server.use("*", (request, response) => {
    response.sendFile(path.join(__dirname, "./_front-end/index.html"));
});
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));