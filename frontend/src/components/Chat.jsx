import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import ChatMessages from "./ChatMessages.jsx";
import { useParams } from "react-router-dom";
import getBotReply from "../assets/js/getBotReply.js";

function Chat({ userId }) {
    const { chatId } = useParams();
    const [value, setValue] = useState("");
    const [chatIdURL, setChatIdURL] = useState(chatId || "");

    const API_BASE = "http://localhost:5000";

    async function createChat(userId, title) {
        try {
            const res = await axios.post(`${API_BASE}/chats`, { userId, title });
            setChatIdURL(res.data._id);
            return res.data;
        } catch (err) {
            console.error("Error creating chat:", err);
        }
    }

    async function addMessage(chatId, role, content) {
        try {
            await axios.post(`${API_BASE}/chats/${chatId}/messages`, { role, content });
        } catch (err) {
            console.error("Error adding message:", err);
        }
    }

    async function handleSend(e) {
        e.preventDefault();
        if (!value.trim()) return;

        let currentChatId = chatId || chatIdURL;

        if (!currentChatId) {
            const chatData = await createChat(userId, value);
            currentChatId = chatData?._id;
            if (!currentChatId) return;
        }

        await addMessage(currentChatId, "user", value);

        const botReply = getBotReply(value);
        await addMessage(currentChatId, "assistant", botReply);

        setValue("");
    }

    return (
        <>
            <div className="chat-display">
                <ChatMessages chatId={chatIdURL} userId={userId} addMessage={addMessage} createChat={createChat}/>
            </div>
            <div className="input-container">
                <form onSubmit={handleSend}>
                    <button
                        type="submit"
                        // this is for test automation
                        id="send-button"
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                    <input
                        // this is for test automation
                        id="chat-input"
                        type="text"
                        placeholder="سوالت را بپرس ..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </form>
            </div>
        </>
    );
}

export default Chat;