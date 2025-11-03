import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import axios from "axios";
import chatbot_db from "../../public/data/chatbot_db.json";

function ChatMessages({ chatId , addMessage }) {
  const [messages, setMessages] = useState([]);
  const [isNewChat, setIsNewChat] = useState(true);
  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    if (!chatId) return;

    axios
      .get(`${API_BASE}/chats/${chatId}/messages`)
      .then((res) => {
        const msgs = res.data.messages || [];
        setMessages(msgs);
        setIsNewChat(msgs.length === 0);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
      });
  }, [chatId , messages]);

  async function handleAdd(role, content) {
    if (!chatId) return;
    await addMessage(chatId, role, content);
  }

  return (
    <div className="chat-messages-container">
      {isNewChat ? (
        <div className="predefined-questions-container">
          {Object.keys(chatbot_db.exact_replies).map((question, i) => (
            <div key={i} className="predefined-questions">
              <button onClick={()=>{
                handleAdd("user", question);
                console.log("done")
              }}>{question}</button>
            </div>
          ))}
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "chat-message-container chat-message-user"
                : "chat-message-container chat-message-bot"
            }
          >
            <div>
              <FontAwesomeIcon
                icon={message.role === "user" ? faUser : faRobot}
                color={message.role === "user" ? "black" : "white"}
              />
            </div>
            <p className="chat-output">{message.content}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ChatMessages;
