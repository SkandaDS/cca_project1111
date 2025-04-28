// src/Chatbot.js
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Get messages from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, []);

  // Function to determine chatbot's response based on input
  const getBotResponse = (message) => {
    const msg = message.toLowerCase().trim();

    if (msg.includes("hello") || msg.includes("hi")) {
      return "Hi there! How can I help you today?";
    } else if (msg.includes("how are you")) {
      return "I'm just a bot, but I'm doing great! Thanks for asking.";
    } else if (msg.includes("your name")) {
      return "I'm your chatbot assistant. Nice to meet you!";
    } else if (msg.includes("services")) {
      return "We offer various home repair services like plumbing, electrical work, carpentry, and more!";
    } else if (msg.includes("bye")) {
      return "Goodbye! Have a wonderful day!";
    } else if (msg.includes("help")) {
      return "You can ask about our services, booking a repair, or say 'hi' to start a conversation.";
    } else if (msg.includes("joke")) {
      return "Why did the computer go to the doctor? Because it had a virus! 🤖";
    } else if (msg.includes("time")) {
      return `The current time is ${new Date().toLocaleTimeString()}`;
    } else {
      return "I'm not sure how to respond to that. Try saying 'help' or ask about our services.";
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    const botReply = getBotResponse(input);
    const botMessage = { text: botReply, sender: "bot" };

    // Immediately update local state with the messages
    setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
    setInput("");

    // Store user message in Firestore
    await addDoc(collection(db, "messages"), {
      ...userMessage,
      timestamp: serverTimestamp(),
    });

    // Store bot response in Firestore
    await addDoc(collection(db, "messages"), {
      ...botMessage,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Smart Chatbot</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <div
              style={{
                backgroundColor: msg.sender === "user" ? "#cce5ff" : "#f1f1f1",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "5px",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "8px", width: "70%" }}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage} style={{ padding: "8px 16px", marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
}

export default Chatbot;
