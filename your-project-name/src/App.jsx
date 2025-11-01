// import { useState } from 'react'
import Chat from "./components/Chat.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import "./assets/css/main.css";
// import { useState } from "react";

function App() {
  
// TODO: implement this with apis
// const [userId, setUserId] = useState("");
  const userId = "123"
  return (
    <>
      <main>
        <div className="chat-container">
          <header>
            <a href="all-chats">
              <FontAwesomeIcon icon={faCommentDots} color="black"/>
            </a>
            <h4>پشتیبان آنلاین</h4>
          </header>
          <div className="chat-section">
            <Chat userId={userId} />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
