// import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import ChatMessages from "./ChatMessages.jsx";
function Chat({userId}){
    const [value,setValue] = useState("")
    const API_BASE = "http://localhost:5000";

    async function createChat(userId, title) {
        const res = await fetch(`${API_BASE}/chats`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, title }),
        });
        return res.json();
    }

    function handleSend(e){
        e.preventDefault()
        // this takes the title of the conversation
        // so it should happen only once
        createChat(userId,value)
        setValue("")
        console.log("it's working")
    }
    return(
        <>
           <div className="chat-display">
                <ChatMessages/>
           </div>
           <div className="input-container">
                <form onSubmit={(e)=>handleSend(e)}>
                    <button type="submit"><FontAwesomeIcon icon={faPaperPlane} /></button>
                    <input type="text" placeholder='سوالت را بپرس ...' value={value} onChange={(e)=>{
                        setValue(e.target.value)
                    }}/>
                </form>
           </div>
        </>
    )
};

export default Chat;