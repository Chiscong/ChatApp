import { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unReadNotificationsFunc } from "../../utils/unReadnatifications";
import moment from 'moment';

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {user} = useContext(AuthContext);
    const {notifications = [], userChats, allUser, setNotifications} = useContext(ChatContext);
    
    useEffect(() => {
        console.log("Current notifications:", notifications);
    }, [notifications]);
    
    const unReadNotifications = unReadNotificationsFunc(notifications, userChats, allUser);
    
    const modifiedNotifications = (notifications || []).map((n) => {
        const sender = allUser?.find(user => user._id === n.senderID);
        return {
            ...n,
            senderName: sender?.name || 'Unknown User',
        };
    });

    const markAllAsRead = () => {
        if (!setNotifications) return;
        setNotifications(prev => prev.map(notification => ({
            ...notification,
            isRead: true
        })));
    };

    return (
        <div className="notifications">
            <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-text-fill" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z"/>
                </svg>
                {unReadNotifications?.length > 0 && (
                    <span className="notifications-count">
                        {unReadNotifications.length}
                    </span>
                )}
            </div>
            {isOpen && (
                <div className="notifications-box">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        <div className="mark-as-read" onClick={markAllAsRead}>Mark all as read</div>
                    </div>
                    {modifiedNotifications.length === 0 ? (
                        <span className="notification">No notification yet..</span>
                    ) : (
                        modifiedNotifications.map((n, index) => (
                            <div
                                key={index}
                                className={n.isRead ? "notification" : "notification not-read"}
                            >
                                <span>{`${n.senderName} sent you a new message`}</span>
                                <span className="notification-time">
                                    {moment(n.date).calendar()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;