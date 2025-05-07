const { Server } = require("socket.io");

const io = new Server({ cors: { origin: "http://localhost:5173" } });
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

io.listen(3000);