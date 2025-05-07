import React, { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import Notes from "./Notes";
import { setToken } from "./api";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setToken(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setLoggedIn(false);
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>📝 Note Taker</h1>

      {!loggedIn ? (
        <div style={styles.authContainer}>
          <div style={styles.authBox}>
            <Signup onSignup={() => {}} />
          </div>
          <div style={styles.authBox}>
            <Login onLogin={() => setLoggedIn(true)} />
          </div>
        </div>
      ) : (
        <Notes onLogout={handleLogout} />
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#343a40",
    fontSize: "32px",
  },
  authContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "40px",
    flexWrap: "wrap",
  },
  authBox: {
    flex: "1 1 400px", // grow, shrink, base width
    maxWidth: "500px",
    minWidth: "300px",
  },
};

export default App;
