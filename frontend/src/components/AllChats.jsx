import { Link} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AllChats({ userId }) {
  const [chats, setChats] = useState([]);
  const [deleteChatState, setDeleteChat] = useState(1);
  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    if (!userId) return;

    const fetchChats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/chats`, {
          params: { userId },
        });
        setChats(res.data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, [userId,deleteChatState]);

  async function deleteChat(chatId) {
    try {
      await axios.delete(`${API_BASE}/chats/${chatId}`);
      setDeleteChat(deleteChatState+1);
      console.log(deleteChatState)
      console.log("deleted")
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  }

  return (
    <main className="main-all-chats">
      <h3>تمام چت ها </h3>
      <Link to={`/`} className="create-link">
        <button> + ایجاد صفحه چت جدید</button>
      </Link>
      <div className="list-container">
        <ul>
          {chats.map((chat) => (
            <li key={chat._id} className="chat-item">
              <Link to={`/chat/${chat._id}`}>{chat.title}</Link>
              <button 
                data-chatid={chat.id}
                className="delete-btn" 
                onClick={()=>deleteChat(chat._id)}  
              >
                delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default AllChats;
