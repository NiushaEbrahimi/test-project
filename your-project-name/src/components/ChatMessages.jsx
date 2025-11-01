import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { useEffect,useState } from "react";
import axios from "axios";

function ChatMessages({chatId}){

    const [messages, setMessages] = useState([]);
    const API_BASE = "http://localhost:5000";

    useEffect(() => {
        if (!chatId) return;
        axios
            .get(`${API_BASE}/chats/${chatId}/messages`)
            .then((res) => {
                setMessages(res.data.messages);
            })
            .catch((err) => {
                console.error("Error fetching messages:", err);
            });
    }, [messages,chatId]);

    return(
        <>
            <div className="chat-messages-container">
                {messages.map((message, index) =>{
                    return(
                            <div key={index} className={message.role === "user" ? "chat-message-container chat-message-user" : "chat-message-container chat-message-container chat-message-bot"}>
                                <div>
                                    <FontAwesomeIcon icon={message.role === "user" ? faUser : faRobot} color={message.role === "user" ? "black" : "white"}/>
                                </div>
                                <p>
                                    {message.content}
                                </p>
                            </div>
                        )
                })}
            </div>
        </>
    )
};

export default ChatMessages;