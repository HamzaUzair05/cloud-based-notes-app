import React, { useState, useEffect } from "react";
import Signup from "./Signup";
import Login from "./Login";
import Notes from "./Notes";
import { setToken } from "./api";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setLoggedIn(false);
  };

  return (
    <>
      {/* Fixed left image */}
      <img src="/secure-image" alt="Left" style={styles.fixedImageLeft} />

      {/* Fixed right image */}
      <img src="/secure-image" alt="Right" style={styles.fixedImageRight} />

      {/* Main content stays centered */}
      <div style={styles.wrapper}>
        <h1 style={styles.title}>📝 Note Taker</h1>

        {!loggedIn ? (
          <div style={styles.authContainer}>
            <div style={styles.authBox}>
              <Login onLogin={() => setLoggedIn(true)} />
            </div>
            <div style={styles.authBox}>
              <Signup onSignup={() => {}} />
            </div>
          </div>
        ) : (
          <Notes onLogout={handleLogout} />
        )}
      </div>
    </>
  );
}

const styles = {
  fixedImageLeft: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "180px",
    objectFit: "cover",
    zIndex: 0, // Changed from -1 to avoid overflow issues
    overflow: "hidden", // Ensure content stays within bounds
  },

  fixedImageRight: {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    width: "180px",
    objectFit: "cover",
    zIndex: 0,
    overflow: "hidden",
  },

  wrapper: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1000px",
    margin: "0 auto", // center content
    zIndex: 1,
    position: "relative",
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
    flex: "1 1 400px",
    maxWidth: "500px",
    minWidth: "300px",
  },
};

export default App;
