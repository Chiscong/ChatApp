const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlenght : 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlenght : 200
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlenght : 1024
    }
}, {
    timestamps: true
});

const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;