import Chat from "./components/Chat.jsx";
import AllChats from "./components/AllChats.jsx";

import "./assets/css/main.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatLayout from "./components/ChatLayout.jsx";

function App() {
  
// TODO: implement this with apis
// const [userId, setUserId] = useState("");
  const userId = "123"

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={
          <ChatLayout userId={userId}/>
        }/>
        <Route path="/all-chats" element={
            <AllChats userId={userId}/>
          } />
        <Route path="/chat/:chatId" element={
          <ChatLayout userId={userId}/>
        } />
      </Routes>
    </Router>
      
    </>
  );
}

export default App;
