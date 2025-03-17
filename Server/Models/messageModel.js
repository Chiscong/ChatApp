const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatID: String, 
    senderID: String,
    text: String,
},
{
    timestamps: true 
});
const messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;