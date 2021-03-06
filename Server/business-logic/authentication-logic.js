const User = require('../models/user-model');
const hash = require("../helpers/hashing");
const uuid = require('uuid');


function validateRegister(userName) {
    return User.findOne({ usernameEmail: { $eq: userName } });
}

function register(user) {
    user.uuid = uuid.v4();
    user.password = hash(user.password)
    user.isAdmin = hash('notAdmin');
    return user.save();
}

function login(credentials) {
    credentials.password = hash(credentials.password);
    const user = User.findOne({ usernameEmail: { $eq: credentials.usernameEmail }, password: { $eq: credentials.password } });
    return user
}

async function changeUserInfo(userToUpdate) {
    if (userToUpdate.password) {
        userToUpdate.password = hash(userToUpdate.password);
    }
    const info = await User.updateOne({ _id: userToUpdate._id }, userToUpdate).exec();
    return info.n ? userToUpdate : null;
}






module.exports = {
    validateRegister,
    register,
    login,
    changeUserInfo
}