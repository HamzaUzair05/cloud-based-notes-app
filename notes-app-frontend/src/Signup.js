import React, { useState } from "react";
import API from "./api";

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleSignup = async () => {
    try {
      await API.post("/signup", { username, password });
      setMessage({
        type: "success",
        text: "Signup successful!",
        key: Date.now(),
      });
      setTimeout(() => {
        setMessage(null);
        onSignup();
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Signup failed",
        key: Date.now(),
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Signup</h2>
      <input
        style={styles.input}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        style={styles.input}
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button style={styles.button} onClick={handleSignup}>
        Signup
      </button>

      {message && (
        <div
          key={message.key}
          style={{
            ...styles.message,
            backgroundColor: message.type === "error" ? "#f8d7da" : "#d4edda",
            color: message.type === "error" ? "#721c24" : "#155724",
            borderColor: message.type === "error" ? "#f5c6cb" : "#c3e6cb",
          }}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "300px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f1f3f5",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#222",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #bbb",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid",
    fontSize: "14px",
  },
};
