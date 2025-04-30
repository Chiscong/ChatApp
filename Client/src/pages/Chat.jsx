import { useContext } from "react";
import { Container, Stack } from 'react-bootstrap';
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import ChatBox from "../components/chat/ChatBox";
import PotentialChats from '../components/chat/PotentialChats';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);

  if (!user) {
    return <div>Please login to access chat</div>;
  }

  return (
    <Container>
      <PotentialChats />
      {userChats?.length < 1 ? (
        <div>No chats available</div>
      ) : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isUserChatsLoading && <p>Loading chats...</p>}
            {userChats?.map((chat, index) => (
              <div
                key={index}
                onClick={() => updateCurrentChat(chat)}
                style={{ cursor: 'pointer' }}
              >
                <UserChat chat={chat} user={user} />
              </div>
            ))}
          </Stack>
          <ChatBox />
        </Stack>
      )}
    </Container>
  );
};

export default Chat;