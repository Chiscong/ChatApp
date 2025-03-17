import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { useFetchRecipientUser } from './../../hooks/useFetchRecipient';
import { Stack } from 'react-bootstrap';


const ChatBox = () => { 
    const { user } = useContext(AuthContext);
    const { currentChat, messages, isMessagesLoading } = useContext(ChatContext);
    const { recipientUser, isLoading } = useFetchRecipientUser(currentChat, user);


    if (isLoading) return <p>Loading...</p>;

    if (!recipientUser) 
        return (
            <p style={{ textAlign: "center", width: "100%" }}>
                No conversation selected yet...
            </p>
        );
        if (isMessagesLoading) 
            return (
        <p style={{textAlign:"center", width:"100%"}}>Loading chat...</p>
    );
    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{recipientUser?.name}</strong>
            </div>
        <Stack gap={3} className="messages">
            {messages && messages.map((message, index) => <Stack>

                
            </Stack>)}
        </Stack>
        </Stack>
    );
   
};

export default ChatBox;
