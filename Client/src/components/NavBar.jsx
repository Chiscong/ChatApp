import { Container, Nav, Navbar, Stack, Dropdown, Badge } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { BsBell } from "react-icons/bs";

const NavBar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const { notifications, updateCurrentChat, allUser, userChats } = useContext(ChatContext);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleNotificationClick = (notification) => {
        // Tìm người gửi từ allUser
        const sender = allUser.find(u => u._id === notification.senderID);
        
        // Tìm chat hiện có trong userChats
        const existingChat = userChats?.find(chat => chat._id === notification.chatID);
        
        if (existingChat) {
            // Nếu chat đã tồn tại, sử dụng chat đó
            updateCurrentChat(existingChat);
        } else {
            // Nếu chat chưa tồn tại, tạo chat mới
            const newChat = {
                _id: notification.chatID,
                members: [
                    { _id: notification.senderID, name: sender?.name || 'Unknown User' },
                    { _id: user._id, name: user.name }
                ]
            };
            updateCurrentChat(newChat);
        }
    };

    return (
        <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
            <Container>
                <h2>
                    <Link to="/" className="link-light text-decoration-none">Chatapp</Link>
                </h2>
                {user && (
                    <span className="text-warning">
                        Đăng nhập với tên : {user?.name}
                    </span>
                )}
                <Nav>
                    <Stack direction="horizontal" gap={3}>
                        {user && (
                            <>
                                <Dropdown>
                                    <Dropdown.Toggle variant="dark" id="dropdown-notifications">
                                        <BsBell className="text-light" />
                                        {unreadCount > 0 && (
                                            <Badge bg="danger" className="notification-badge">
                                                {unreadCount}
                                            </Badge>
                                        )}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {notifications.length > 0 ? (
                                            notifications.map((notification, index) => {
                                                const sender = allUser.find(u => u._id === notification.senderID);
                                                return (
                                                    <Dropdown.Item 
                                                        key={index} 
                                                        className={!notification.isRead ? "unread" : ""}
                                                        onClick={() => handleNotificationClick(notification)}
                                                    >
                                                        <div className="d-flex flex-column">
                                                            <span>Tin nhắn mới từ {sender?.name || 'Unknown User'}</span>
                                                            <small className="text-muted">{notification.text}</small>
                                                        </div>
                                                    </Dropdown.Item>
                                                );
                                            })
                                        ) : (
                                            <Dropdown.Item>Không có thông báo mới</Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Link onClick={() => logoutUser()} to="/login" className="link-light text-decoration-none">
                                    Đăng Xuất
                                </Link>
                            </>
                        )}
                        {!user && (
                            <>
                                <Link to="/login" className="link-light text-decoration-none">Đăng Nhập</Link>
                                <Link to="/register" className="link-light text-decoration-none">Đăng ký</Link>
                            </>
                        )}
                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavBar; 