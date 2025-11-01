import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import Chat from './Chat.jsx';
 
function ChatLayout({userId}){
    return(
        <main>
            <div className="chat-container">
                <header>
                    <Link to="/all-chats">
                        <FontAwesomeIcon icon={faCommentDots} color="black"/>
                    </Link>
                    <h4>پشتیبان آنلاین</h4>
                </header>
                <div className="chat-section">
                    <Chat userId={userId} />
                </div>
            </div>
        </main>
    )
}

export default ChatLayout;