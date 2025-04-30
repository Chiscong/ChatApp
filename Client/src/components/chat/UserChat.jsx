import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import avatar from "../../assets/avatar.svg";
import PropTypes from 'prop-types';

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers } = useContext(ChatContext);
  const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id);
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
         12/12/2021
        </div>
        <div className="this-user-notifications">2</div>
        <span className={isOnline ?"user-online":""}></span>
      </div>
    </Stack>
  );
};
UserChat.propTypes = {
  chat: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};


export default UserChat;
