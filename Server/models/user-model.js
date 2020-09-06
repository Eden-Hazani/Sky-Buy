const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    usernameEmail: {
        type: String,
        required: [true, "Missing Username"],
        validate: {
            validator: value => /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value),
            message: "Incorrect Email"
        }
    },

    password: {
        type: String,
        required: [true, "Missing password"],
        validate: {
            validator: value => /^(?=.*[A-Z].*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{5,}$/i.test(value),
            message: "must be a strong password between 5 to 15 characters"
        }

    },



    firstName: {
        type: String,
        required: [true, "Missing first Name"],
    },

    lastName: {
        type: String,
        required: [true, "Missing last Name"],
    },


    IdentificationNumber: {
        type: Number,
        required: [true, "Missing Id"],
        minlength: [9, "Incorrect Id"],
        maxlength: [9, "Incorrect Id"],
    },
    address: {
        city: {
            type: String,
            required: [true, "Missing City"],
        },
        street: {
            type: String,
            required: [true, "Missing Street Name"],
        },
        zip: Number
    },

    profileImg: {
        type: String
    },

    isAdmin: String
}, {
    versionKey: false
})

userSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.password;
    return obj;
}


const User = mongoose.model("User", userSchema, "users");

module.exports = User