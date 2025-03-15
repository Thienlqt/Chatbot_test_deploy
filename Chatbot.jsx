import React, { useState, useEffect } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", sender: "bot" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState([]);

  // Function to toggle chat visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) fetchRecommendedQuestions(); // Fetch recommended questions only when opening chat
  };

  // Fetch recommended questions from backend
  const fetchRecommendedQuestions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/recommended-questions");
      const data = await response.json();
      setRecommendedQuestions(data);
    } catch (error) {
      console.error("Error fetching recommended questions:", error);
    }
  };

  // Function to send user message
  const sendMessage = async (message) => {
    if (!message.trim()) return;
  
    const newMessages = [...messages, { text: message, sender: "user" }];
    setMessages(newMessages);
    setUserInput(""); // Clear input box
  
    try {
      console.log("Sending request to backend:", message); // ✅ Debugging
  
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message }),
      });
  
      const data = await response.json();
      console.log("API Response:", data); // ✅ Debugging
  
      if (data.answer) {
        setMessages([...newMessages, { text: data.answer, sender: "bot" }]);
      } else {
        setMessages([...newMessages, { text: "Oops! No response from bot.", sender: "bot" }]);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...newMessages, { text: "Oops! Something went wrong.", sender: "bot" }]);
    }
  };

  // Handle recommended question click (now sends immediately)
  const handleRecommendedQuestionClick = (question) => {
    setUserInput(question);
    sendMessage(question); // Sends the question immediately
  };

  // Handle Enter key press to send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent new line
      sendMessage(userInput);
    }
  };

  return (
    <div style={styles.container}>
      {/* Chatbot Icon (Button to Open/Close Chat) */}
      {!isOpen && (
        <button onClick={toggleChat} style={styles.chatIcon}>
          💬 Chat
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatboxContainer}>
          <div style={styles.chatboxHeader}>
            <h3>Chatbot</h3>
            <button onClick={toggleChat} style={styles.closeButton}>✖</button>
          </div>

          {/* Recommended Questions */}
          <div style={styles.recommendations}>
            <h4>Recommended Questions:</h4>
            <ul>
              {recommendedQuestions.map((q) => (
                <li 
                  key={q.id} 
                  onClick={() => handleRecommendedQuestionClick(q.text)} 
                  style={styles.recommendationItem}
                >
                  {q.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Messages */}
          <div style={styles.chatbox}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={msg.sender === "bot" ? styles.botMessage : styles.userMessage}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* User Input Field */}
          <div style={styles.inputArea}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress} // Press Enter to send message
              placeholder="Type your question..."
              style={styles.input}
            />
            <button onClick={() => sendMessage(userInput)} style={styles.button}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styling
const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
  },
  chatIcon: {
    padding: "10px 15px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
  chatboxContainer: {
    width: "350px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  chatboxHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "10px",
    borderBottom: "1px solid #ddd",
  },
  closeButton: {
    border: "none",
    background: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  recommendations: {
    marginBottom: "10px",
  },
  recommendationItem: {
    cursor: "pointer",
    color: "#007bff",
    textDecoration: "underline",
    marginBottom: "5px",
  },
  chatbox: {
    height: "250px",
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
  },
  botMessage: {
    backgroundColor: "#e0e0e0",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "5px",
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "5px",
    alignSelf: "flex-end",
  },
  inputArea: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    marginLeft: "5px",
    padding: "10px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Chatbot;
