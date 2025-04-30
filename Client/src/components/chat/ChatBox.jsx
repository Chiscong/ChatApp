import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { useFetchRecipientUser } from './../../hooks/useFetchRecipient';
import { Stack, Form, Button } from 'react-bootstrap';
import './ChatBox.css';

const ChatBox = () => { 
    const { user } = useContext(AuthContext);
    const { currentChat, messages, isMessagesLoading, sendMessage } = useContext(ChatContext);
    const { recipientUser, isLoading } = useFetchRecipientUser(currentChat, user);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };

    // Debug logs
    console.log("Current User ID:", user?._id);
    console.log("Messages:", messages);
    console.log("Current Chat:", currentChat);

    if (isLoading || isMessagesLoading) {
        return <p>Loading chat...</p>;
    }

    if (!currentChat) {
        return (
            <p style={{ textAlign: "center", width: "100%" }}>
                No conversation selected yet...
            </p>
        );
    }

    if (!recipientUser) {
        return (
            <p style={{ textAlign: "center", width: "100%" }}>
                Unable to load recipient information.
            </p>
        );
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await sendMessage(newMessage, currentChat._id, user._id);
            setNewMessage("");
            scrollToBottom();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{recipientUser?.name}</strong>
            </div>
            <div className="messages">
                {messages && messages.length > 0 ? (
                    messages.map((message, index) => {
                        const isCurrentUserMessage = message.senderID === user?._id;
                        
                        console.log(`Message ${index}:`, {
                            messageId: message._id,
                            senderID: message.senderID,
                            currentUserId: user?._id,
                            isCurrentUserMessage,
                            text: message.text,
                            messageData: message
                        });
                        
                        return (
                            <div 
                                key={message._id || index} 
                                className={`message-wrapper ${isCurrentUserMessage ? 'sent' : 'received'}`}
                            >
                                <div className="message-content">
                                    <p>{message.text}</p>
                                    <span className="message-time">
                                        {formatTime(message.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p style={{ textAlign: "center", width: "100%" }}>
                        No messages yet.
                    </p>
                )}
                <div ref={messagesEndRef} />
            </div>
            <Form onSubmit={handleSendMessage} className="chat-input">
                <Stack direction="horizontal" gap={2}>
                    <Form.Control
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" className="send-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                        </svg>
                    </Button>
                </Stack>
            </Form>
        </Stack>
    );
};

export default ChatBox;
