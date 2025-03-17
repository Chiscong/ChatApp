const express = require("express");
const {creatChat, findUserChats, findChat} = require("../Controllers/chatController")

const router = express.Router();

router.post("/", creatChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstID/:secondID", findChat);

module.exports = router;