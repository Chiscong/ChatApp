import {createContext, useState, useEffect, useCallback} from "react";
import PropTypes from 'prop-types';
import {baseUrl, getRequest, postRequest} from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [UserChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [allUser, setAllUser] = useState([]);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    // Handle online users
    useEffect(() => {
        if (socket === null) return;
        
        socket.emit("addNewUser", user?._id);
        
        socket.on("getOnlineUsers", (res) => {
            console.log("Online users updated:", res);
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket, user]);

    // Handle sending messages
    useEffect(() => {
        if (socket === null || !newMessage) return;
        
        const recipientId = currentChat?.members?.find((id) => id !== user?._id);
        if (!recipientId) return;

        console.log("Sending message via socket:", {
            ...newMessage,
            recipientId
        });
        
        socket.emit("sendMessage", {
            ...newMessage,
            recipientId
        });
    }, [newMessage, socket, currentChat, user]);

    // Handle receiving messages and notifications
    useEffect(() => {
        if (socket === null) return;

        socket.on("getMessage", (res) => {
            console.log("Received message:", res);
            if (currentChat?._id === res.chatID) {
                setMessages((prev) => [...prev, res]);
            }
        });

        socket.on("getNotification", (res) => {
            console.log("Received notification:", res);
            
            setNotifications((prev) => {
                // Check if notification already exists
                const exists = prev.some(n => 
                    n.senderID === res.senderID && 
                    n.chatID === res.chatID && 
                    new Date(n.date).getTime() === new Date(res.date).getTime()
                );
                
                if (exists) return prev;

                const newNotification = {
                    ...res,
                    isRead: currentChat?._id === res.chatID
                };
                
                console.log("Adding new notification:", newNotification);
                return [newNotification, ...prev];
            });
        });

        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        };
    }, [socket, currentChat]);

    // Fetch potential chats and users
    useEffect(() => {
        const getUser = async () => {
            const response = await getRequest(`${baseUrl}/users`);
            if (response.error) {
                console.error("Error fetching users:", response);
                return;
            }

            const pChats = response?.filter((u) => {
                if (user?._id === u._id) return false;

                let isChatCreated = false;
                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    });
                }
                return !isChatCreated;
            });

            setPotentialChats(pChats);
            setAllUser(response);
        };

        getUser();
    }, [userChats, user]);

    // Fetch user chats
    useEffect(() => {
        const getUserChats = async () => {
            if (!user?._id) return;

            setIsUserChatsLoading(true);
            setUserChatsError(null);

            try {
                const response = await getRequest(`${baseUrl}/chats/${user._id}`);
                console.log("Fetched user chats:", response);
                setUserChats(response);
            } catch (error) {
                console.error("Error fetching chats:", error);
                setUserChatsError(error);
            } finally {
                setIsUserChatsLoading(false);
            }
        };

        getUserChats();
    }, [user]);

    // Fetch messages for current chat
    useEffect(() => {
        const getMessages = async () => {
            if (!currentChat?._id) return;

            setIsMessagesLoading(true);
            setMessagesError(null);

            try {
                const response = await getRequest(`${baseUrl}/messages/${currentChat._id}`);
                console.log("Fetched messages:", response);
                setMessages(response);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setMessagesError(error);
            } finally {
                setIsMessagesLoading(false);
            }
        };

        getMessages();
    }, [currentChat]);

    const updateCurrentChat = useCallback((chat) => {
        console.log("Updating current chat:", chat);
        setCurrentChat(chat);
    }, []);

    const createChat = useCallback(async (firstID, secondID) => {
        try {
            const response = await postRequest(
                `${baseUrl}/chats`,
                JSON.stringify({ firstID, secondID })
            );
            
            if (response.error) {
                console.error("Error creating chat:", response.error);
                return;
            }

            setUserChats((prev) => [...prev, response]);
            return response;
        } catch (error) {
            console.error("Error creating chat:", error);
            throw error;
        }
    }, []);

    const sendMessage = async (text, chatId, senderId) => {
        try {
            const response = await postRequest(
                `${baseUrl}/messages`,
                JSON.stringify({
                    chatID: chatId,
                    senderID: senderId,
                    text: text
                })
            );

            if (response.error) {
                throw new Error(response.error);
            }

            console.log("Message sent successfully:", response);
            setMessages(prevMessages => [...prevMessages, response]);
            setNewMessage(response);
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    };

    return (
        <ChatContext.Provider value={{
            userChats,
            isUserChatsLoading,
            UserChatsError,
            potentialChats,
            createChat,
            updateCurrentChat,
            messages,
            isMessagesLoading,
            messagesError,
            currentChat,
            sendMessage,
            onlineUsers,
            notifications,
            allUser,
            setNotifications
        }}>
            {children}
        </ChatContext.Provider>
    );
};

ChatContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
    }).isRequired,
};
