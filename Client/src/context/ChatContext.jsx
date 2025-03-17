import {createContext, useState, useEffect, useCallback} from "react";
import PropTypes from 'prop-types';
import {baseUrl, getRequest, postRequest} from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    const [userChats , setUserChats] = useState(null);
    const [isUserChatsLoading , setIsUserChatsLoading] = useState(false);
    const [UserChatsError , setUserChatsError] = useState(null);
    const [potentialChats , setPotentialChats] = useState([]);
    const [currentChat , setCurrentChat] = useState(null);
    const [messages , setMessages] = useState(null);
    const [isMessagesLoading , setIsMessagesLoading] = useState(false);
    const [messagesError , setMessagesError] = useState(null);
    console.log("messages", messages);

    useEffect(()=>
    {
        const getUser = async ()=>
            {
                const response = await getRequest(`${baseUrl}/users`);
                if (response.error) {
                    return   console.error("Error fetching users:", response);
                  
                }
             const pChats = response?.filter ((u) =>    
                {
                    let isChatCreated = false;

                    if (user?._id === u._id) return false;

                    if (userChats) {
                      isChatCreated =  userChats?.some((chat) =>{
                            return chat.members[0] === u._id || chat.members[1] === u._id;
                        })
                    }
                    return !isChatCreated;
                });
                setPotentialChats(pChats);
            };
         
        getUser();
    },[userChats]);

    useEffect(()=>{
        const getUserChats = async ()=>{
            if (user?._id){
                setIsUserChatsLoading(true);
                setUserChatsError(null);

                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
                console.log("API response for chats:", response);
                setIsUserChatsLoading(false);

                if (response.error) {
                  
                    return setUserChatsError(response);
                }
               setUserChats(response);
                
            }
        };
        getUserChats();
    },[user]);
    useEffect(() => {
        console.log("CurrentChat:", currentChat);
        if (currentChat === null) {
          console.log("CurrentChat là null");
        } else {
          console.log("CurrentChat đã được cập nhật");
        }
      }, [currentChat]);
    useEffect(() => {
        const getMessages = async () => {
            if (!currentChat?._id) return; // Tránh gọi API nếu chưa có chat
    
            setIsMessagesLoading(true);
            setMessagesError(null);
    
            const response = await getRequest(`${baseUrl}/messages/${currentChat._id}`);
    
            setIsMessagesLoading(false);
    
            if (response.error) {
                return setMessagesError(response);
            }
            setMessages(response);
        };
        getMessages();
    }, [currentChat]);
    

const updateCurrentChat = useCallback((chat)=>{
    console.log("Updating currentChat:", chat);
    setCurrentChat(chat);
},[])

    const createChat = useCallback(async(firstID , secondID)=>
{
    const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({firstID ,secondID}));
if (response.error) {
    return   console.error("Error creating chat:", response.error)
}
setUserChats((prev)=>[...prev , response]);
},[]);


    return <ChatContext.Provider value={{
        userChats,
        isUserChatsLoading ,
        UserChatsError ,
        potentialChats,
        createChat, updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
    }}
    >
        {children}
        </ChatContext.Provider>
};

ChatContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
    }).isRequired,
};
