import { Link} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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
  }, [userId]);

  return (
    <div>
      <h3>All Chats</h3>
          <Link to={`/`}>
            <button> + Create New Chat</button>
          </Link>
      <ul>
        {chats.map((chat) => (
          <li key={chat._id}>
            <Link to={`/chat/${chat._id}`}>{chat.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllChats;
