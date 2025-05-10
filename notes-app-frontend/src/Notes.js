import React, { useEffect, useState } from "react";
import API from "./api";

export default function Notes({ onLogout }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);

  const loadNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to load notes:", err.response?.data || err.message);
    }
  };

  const addNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }
    await API.post("/notes", { title, content });
    setTitle("");
    setContent("");
    loadNotes();
  };

  const deleteNote = async (id) => {
    await API.delete(`/notes/${id}`);
    loadNotes();
  };

  const startEditNote = (note) => setEditingNote(note);

  const saveEdit = async () => {
    if (!editingNote.title.trim() || !editingNote.content.trim()) return;
    await API.put(`/notes/${editingNote.id}`, {
      title: editingNote.title,
      content: editingNote.content,
    });
    setEditingNote(null);
    loadNotes();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) loadNotes();
  }, []);

  return (
    <div style={styles.container}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <h2 style={styles.header}>📝 My Notes</h2>
        <button style={styles.logoutButton} onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Add Note Form */}
      <div style={styles.addNoteForm}>
        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
        />
        <textarea
          style={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note Content"
        />
        <button style={styles.addButton} onClick={addNote}>
          Add Note
        </button>
      </div>

      {/* Notes Grid */}
      <div style={styles.notesGrid}>
        {notes.map((note) => (
          <div
            key={note.id}
            style={styles.noteCard}
            onClick={() => setViewingNote(note)}
          >
            <h3>{note.title}</h3>
            <p>
              {note.content.length > 100
                ? note.content.slice(0, 100) + "..."
                : note.content}
            </p>
            <div style={styles.cardButtons}>
              <button
                style={styles.editButton}
                onClick={(e) => {
                  e.stopPropagation();
                  startEditNote(note);
                }}
              >
                Edit
              </button>
              <button
                style={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingNote && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Edit Note</h3>
            <input
              style={styles.input}
              value={editingNote.title}
              onChange={(e) =>
                setEditingNote({ ...editingNote, title: e.target.value })
              }
            />
            <textarea
              style={styles.textarea}
              value={editingNote.content}
              onChange={(e) =>
                setEditingNote({ ...editingNote, content: e.target.value })
              }
            />
            <div style={styles.modalFooter}>
              <button style={styles.saveButton} onClick={saveEdit}>
                Save
              </button>
              <button
                style={styles.cancelButton}
                onClick={() => setEditingNote(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingNote && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>{viewingNote.title}</h3>
            <div style={styles.scrollableContent}>
              <p style={{ whiteSpace: "pre-wrap" }}>{viewingNote.content}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <button
                style={styles.cancelButton}
                onClick={() => setViewingNote(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "900px", margin: "0 auto", padding: "20px" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  header: { color: "#333", margin: 0 },
  logoutButton: {
    padding: "8px 16px",
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  addNoteForm: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: "30px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    height: "100px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginBottom: "10px",
  },
  addButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
  },
  notesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  noteCard: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    cursor: "pointer",
    position: "relative",
  },
  cardButtons: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  scrollableContent: {
    maxHeight: "50vh",
    overflowY: "auto",
    marginBottom: "20px",
    whiteSpace: "pre-wrap",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  saveButton: {
    backgroundColor: "#17a2b8",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
