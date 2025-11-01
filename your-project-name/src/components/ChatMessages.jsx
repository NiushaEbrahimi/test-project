import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

function ChatMessages(){
    const API_BASE = "http://localhost:5000";

    async function createChat(userId, title) {
        const res = await fetch(`${API_BASE}/chats`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, title }),
        });
        return res.json();
    }

    return(
        <>
            <div className="chat-messages">
                
            </div>
        </>
    )
};

export default ChatMessages;