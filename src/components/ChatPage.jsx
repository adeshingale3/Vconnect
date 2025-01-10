import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { auth } from '../firebase';

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const setupChat = async () => {
      try {
        if (!auth.currentUser) {
          navigate('/login');
          return;
        }

        const token = await auth.currentUser.getIdToken();
        const newSocket = io("http://localhost:9000", {
          auth: {
            token
          }
        });

        newSocket.on('connect_error', (err) => {
          setError(err.message);
          setTimeout(() => setError(null), 5000);
        });

        newSocket.on("new-message", (messageData) => {
          setMessages((prevMessages) => [...prevMessages, messageData]);
        });

        newSocket.on("error", (error) => {
          setError(error.message);
          setTimeout(() => setError(null), 5000);
        });

        newSocket.on("user-joined", (data) => {
          setMessages((prevMessages) => [...prevMessages, data]);
        });

        newSocket.on("user-left", (data) => {
          setMessages((prevMessages) => [...prevMessages, data]);
        });

        setSocket(newSocket);
        newSocket.emit("join-event-chat", { eventId });
        setLoading(false);
      } catch (error) {
        setError("Failed to connect to chat");
        setLoading(false);
      }
    };

    setupChat();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [eventId, navigate]);

  const handleSendMessage = async () => {
    if (!message.trim() || !socket) return;

    try {
      socket.emit("event-message", { 
        eventId,
        message: message.trim() 
      });
      setMessage("");
    } catch (error) {
      setError("Failed to send message");
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-16 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Event Chat</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-4 mb-4 h-[60vh] overflow-y-auto">
        {messages.length ? (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-2 p-2 rounded ${
                msg.system 
                  ? 'bg-gray-100 text-gray-600 text-sm italic' 
                  : msg.userId === auth.currentUser?.uid
                    ? 'bg-blue-100 ml-auto'
                    : 'bg-gray-100'
              } max-w-[80%]`}
            >
              {msg.system ? (
                <p>{msg.message}</p>
              ) : (
                <>
                  <p className="font-bold text-sm">{msg.userName}</p>
                  <p>{msg.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
