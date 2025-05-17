const { Server } = require("socket.io");
require("dotenv").config();

const io = new Server({ 
  cors: { 
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  } 
});
let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    // Add new user
    socket.on("addNewUser", (userID) => {
        if (!onlineUsers.some(user => user.userId === userID)) {
            onlineUsers.push({
                userId: userID,
                socketId: socket.id
            });
            console.log("Online users:", onlineUsers);
            io.emit("getOnlineUsers", onlineUsers);
        }
    });

    // Handle messages
    socket.on("sendMessage", (message) => {
        console.log("Received message:", message);
        const recipient = onlineUsers.find(user => user.userId === message.recipientId);
        
        if (recipient) {
            console.log("Sending message to:", recipient.socketId);
            io.to(recipient.socketId).emit("getMessage", message);
            
            // Send notification
            const notification = {
                senderID: message.senderID,
                isRead: false,
                date: new Date(),
                chatID: message.chatID
            };
            console.log("Sending notification:", notification);
            io.to(recipient.socketId).emit("getNotification", notification);
        } else {
            console.log("Recipient not found:", message.recipientId);
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        console.log("User disconnected. Remaining users:", onlineUsers);
        io.emit("getOnlineUsers", onlineUsers);
    });
});

const PORT = process.env.SOCKET_PORT || 3000;
io.listen(PORT);
console.log(`Socket.io server running on port ${PORT}`);