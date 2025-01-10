import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null); // State to store socket connection

  // Initialize the socket connection when component mounts
  useEffect(() => {
    const newSocket = io("http://localhost:9000"); // Connect to backend server
    setSocket(newSocket);

    // Listen for incoming messages from the server
    newSocket.on("new-message", (incomingMessage) => {
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    });

    // Clean up socket connection on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle sending messages
  const handleSendMessage = () => {
    if (message.trim() && socket) {
      socket.emit("user-message", message); // Send message to server
      setMessage(""); // Clear input field
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }} className="mt-16">
      <h1>Chat App</h1>

      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          style={{
            padding: "10px",
            width: "60%",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>

      <div
        id="messages"
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          width: "80%",
          margin: "0 auto",
          textAlign: "left",
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        {messages.length ? (
          messages.map((msg, index) => (
            <p key={index} style={{ margin: "10px 0" }}>
              {msg}
            </p>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
