import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { useFetchRecipientUser } from './../../hooks/useFetchRecipient';
import { Stack, Form, Button } from 'react-bootstrap';
import './ChatBox.css';
import EmojiPicker from "./EmojiPicker";

const ChatBox = () => { 
    const { user } = useContext(AuthContext);
    const { currentChat, messages, isMessagesLoading, sendMessage } = useContext(ChatContext);
    const { recipientUser, isLoading } = useFetchRecipientUser(currentChat, user);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const scrollRef = useRef();

    // Auto scroll to bottom when messages change
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };

    if (isLoading || isMessagesLoading) {
        return <p>Loading chat...</p>;
    }

    if (!currentChat) {
        return (
            <div className="chat-box d-flex align-items-center justify-content-center">
                <p className="text-center">Open a conversation to start chatting</p>
            </div>
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
        if (e) {
            e.preventDefault();
        }
        if (!newMessage.trim()) return;

        try {
            console.log("Sending message:", {
                text: newMessage,
                chatId: currentChat._id,
                senderId: user._id
            });
            
            await sendMessage(newMessage, currentChat._id, user._id);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleEmojiSelect = (emoji) => {
        setNewMessage(prev => prev + emoji);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
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
                        return (
                            <div 
                                ref={scrollRef}
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
            <div className="chat-input-container">
                <Form onSubmit={handleSendMessage} className="chat-input">
                    <Form.Control
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </Form>
                <div className="chat-actions">
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                    <Button type="submit" className="send-btn" onClick={handleSendMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                        </svg>
                    </Button>
                </div>
            </div>
        </Stack>
    );
};

export default ChatBox;
