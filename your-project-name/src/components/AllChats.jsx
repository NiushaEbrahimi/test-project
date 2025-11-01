import { Link} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';

function AllChats({ userId }) {
  const [chats, setChats] = useState([]);
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
  }, [userId,chats]);

  async function deleteChat(chatId) {
    try {
      await axios.delete(`${API_BASE}/chats/${chatId}`);
      console.log("Chat deleted successfully");
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
            <li key={chat._id}>
              <Link to={`/chat/${chat._id}`}>{chat.title}</Link>
              <span onClick={()=>deleteChat(chat._id)}>delete</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default AllChats;
