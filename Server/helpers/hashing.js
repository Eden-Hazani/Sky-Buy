const crypto = require("crypto");

const salt = "SkYHoTeLs"

function hash(password) {
    return crypto.createHmac("sha512", salt).update(password).digest('hex');
}

module.exports = hash