import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import "./Notifications.css";

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const { notifications, userChats, allUser, markAllNotificationsAsRead, markNotificationAsRead } = useContext(ChatContext);
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (notifications) {
            const unread = unreadNotificationsFunc(notifications);
            console.log("Unread notifications:", unread);
            setUnreadNotifications(unread);
        }
    }, [notifications]);

    const handleNotificationClick = async (notification) => {
        console.log("Notification clicked:", notification);
        try {
            await markNotificationAsRead(notification);
            setShowNotifications(false);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead(unreadNotifications);
            setShowNotifications(false);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    return (
        <div className="notifications-container">
            <div className="notifications-icon" onClick={() => setShowNotifications(!showNotifications)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                </svg>
                {unreadNotifications?.length > 0 && (
                    <span className="notification-badge">{unreadNotifications.length}</span>
                )}
            </div>

            {showNotifications && (
                <div className="notifications-dropdown">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        {unreadNotifications?.length > 0 && (
                            <div className="mark-as-read" onClick={handleMarkAllAsRead}>
                                Mark all as read
                            </div>
                        )}
                    </div>

                    <Stack gap={2}>
                        {notifications?.length === 0 ? (
                            <span className="no-notifications">No notifications yet...</span>
                        ) : (
                            notifications?.map((notification, index) => {
                                const sender = allUser.find(user => user._id === notification.senderID);
                                const chat = userChats.find(chat => chat._id === notification.chatID);
                                
                                return (
                                    <div 
                                        key={index} 
                                        className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="notification-content">
                                            <span className="notification-sender">{sender?.name}</span>
                                            <span className="notification-text">
                                                sent you a message in {chat?.name || "chat"}
                                            </span>
                                            <span className="notification-time">
                                                {moment(notification.date).calendar()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </Stack>
                </div>
            )}
        </div>
    );
};

export default Notifications; 