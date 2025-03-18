import React, { useState, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", sender: "bot" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [recommendedQuestions, setRecommendedQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Toggle chat visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) fetchCategories();
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch recommended questions when a category is clicked
  const fetchRecommendedQuestions = async (categoryId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/recommended-questions?category_id=${categoryId}`);
      setRecommendedQuestions(response.data);
      setSelectedCategory(categoryId);
    } catch (error) {
      console.error("Error fetching recommended questions:", error);
    }
  };

  // Send user message
  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const newMessages = [...messages, { text: message, sender: "user" }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", { question: message });
      setMessages([...newMessages, { text: response.data.answer, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...newMessages, { text: "Oops! Something went wrong.", sender: "bot" }]);
    }
  };

  return (
    <div style={styles.container}>
      {!isOpen && (
        <button onClick={toggleChat} style={styles.chatIcon}>💬 Chat</button>
      )}
      {isOpen && (
        <div style={styles.chatboxContainer}>
          <div style={styles.chatboxHeader}>
            <h3>Chatbot</h3>
            <button onClick={toggleChat} style={styles.closeButton}>✖</button>
          </div>

          {/* Categories Section */}
          <div style={styles.categories}>
            <h4>FAQs Common Categories:</h4>
            <div style={styles.categoryContainer}>
              {categories.map((category) => (
                <button key={category.id} onClick={() => fetchRecommendedQuestions(category.id)} style={styles.categoryBox}>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Questions Section */}
          {selectedCategory && (
            <div style={styles.recommendations}>
              <h4>Recommended Questions:</h4>
              <div style={styles.recommendationContainer}>
                {recommendedQuestions.map((q) => (
                  <button key={q.id} onClick={() => sendMessage(q.text)} style={styles.recommendationBox}>
                    {q.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div style={styles.chatbox}>
            {messages.map((msg, index) => (
              <div key={index} style={msg.sender === "bot" ? styles.botMessage : styles.userMessage}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* User Input */}
          <div style={styles.inputArea}>
            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Type your question..." style={styles.input} />
            <button onClick={() => sendMessage(userInput)} style={styles.button}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px", // Moves chatbot to bottom-left corner
    zIndex: 1000,
  },
  chatIcon: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "50%",
    padding: "15px",
    fontSize: "18px",
    cursor: "pointer",
  },
  chatboxContainer: {
    width: "320px",
    backgroundColor: "white",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  chatboxHeader: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
  categories: {
    padding: "10px",
  },
  categoryContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  categoryBox: {
    padding: "8px 12px",
    backgroundColor: "#f1f1f1",
    borderRadius: "5px",
    border: "1px solid #ccc",
    cursor: "pointer",
    textAlign: "center",
    flex: "1 1 calc(50% - 10px)",
  },
  recommendations: {
    padding: "10px",
  },
  recommendationContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  recommendationBox: {
    padding: "8px 12px",
    backgroundColor: "#e7f3ff",
    borderRadius: "5px",
    border: "1px solid #007bff",
    cursor: "pointer",
    textAlign: "center",
    flex: "1 1 calc(50% - 10px)",
  },
  chatbox: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    maxHeight: "250px",
    borderTop: "1px solid #ccc",
  },
  botMessage: {
    backgroundColor: "#e7f3ff",
    padding: "8px",
    borderRadius: "5px",
    margin: "5px 0",
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "8px",
    borderRadius: "5px",
    margin: "5px 0",
    alignSelf: "flex-end",
  },
  inputArea: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    marginLeft: "5px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  }
};

export default Chatbot;
