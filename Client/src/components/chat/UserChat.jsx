import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import avatar from "../../assets/avatar.svg";
import PropTypes from 'prop-types';


const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers, notifications = [] } = useContext(ChatContext);
  const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id);
  
  const unreadCount = notifications.filter(n => !n.isRead && n.chatID === chat._id).length;

  const formatDate = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    // Nếu là ngày hôm nay
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
    
    // Nếu là ngày trong tuần này
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Chủ nhật'];
      return days[messageDate.getDay()];
    }
    
    // Nếu là ngày khác
    return messageDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} height="35px" alt="User Avatar" />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">Text Message</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">
          {formatDate(chat.updatedAt)}
        </div>
        {unreadCount > 0 && (
          <div className="this-user-notifications">{unreadCount}</div>
        )}
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

UserChat.propTypes = {
  chat: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default UserChat;
