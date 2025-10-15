import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    setMessages([...messages, { type: "user", text: prompt }]);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/chat",
        new URLSearchParams({ prompt }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      setMessages((prev) => [...prev, { type: "bot", text: res.data.reply }]);
      setPrompt(""); // clear input
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { type: "bot", text: "Error replying." }]);
    }
  };

  return (
    <div className="chat-bot">
      <h2>Chat Bot</h2>
      <div className="chat-window" style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "scroll" }}>
        {messages.map((msg, i) => (
          <p key={i} style={{ textAlign: msg.type === "user" ? "right" : "left" }}>
            <strong>{msg.type === "user" ? "You: " : "Bot: "}</strong>{msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatBot;
