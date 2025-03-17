const messageModel = require("../Models/messageModel");
 
// Create Message 
const createMessage = async (req, res) => {
  const {chatID , senderID, text} = req.body;
  const message = new messageModel({chatID, senderID, text});
    try {
      const response =   await message.save();
        res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
        }
};

// get messages 
const getMessages = async (req, res) => {
  const {chatID} = req.params;
  try {
    const messages = await messageModel.find({chatID});
    res.status(200).json(messages);
    } catch (error) {
    console.log(error);
    res.status(500).json(error);
    }
}
module.exports = {createMessage, getMessages};