import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import PostDetail from "./PostDetail";

function Home({ token, setToken }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  function fetchPosts() {
    fetch("http://127.0.0.1:8000/api/posts/")
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }

  function handleLogin() {
    setLoginError("");
    fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.access) {
          setToken(data.access);
          setShowLogin(false);
          setUsername("");
          setPassword("");
        } else {
          setLoginError("Invalid username or password!");
        }
      });
  }

  function handleLogout() {
    setToken(null);
  }

  function handleSubmit() {
    if (!title || !content) {
      alert("Please fill in both fields!");
      return;
    }
    setSaving(true);
    fetch("http://127.0.0.1:8000/api/posts/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    })
      .then(response => response.json())
      .then(() => {
        setTitle("");
        setContent("");
        setShowForm(false);
        setSaving(false);
        fetchPosts();
      });
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "0" }}>

      {/* Navbar */}
      <nav style={{
        background: "#3b82f6",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem"
      }}>
        <a href="/" style={{
          color: "white",
          textDecoration: "none",
          fontWeight: "bold"
        }}>Home</a>

        <div style={{ marginLeft: "auto", display: "flex", gap: "1rem", alignItems: "center" }}>
          {token ? (
            <>
              <button onClick={() => setShowForm(!showForm)} style={{
                background: "white",
                color: "#3b82f6",
                border: "none",
                padding: "0.3rem 0.8rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold"
              }}>
                {showForm ? "Cancel" : "+ New Post"}
              </button>
              <span style={{ color: "white" }}>✅ Logged in</span>
              <button onClick={handleLogout} style={{
                background: "transparent",
                color: "white",
                border: "1px solid white",
                padding: "0.3rem 0.8rem",
                borderRadius: "6px",
                cursor: "pointer"
              }}>Logout</button>
            </>
          ) : (
            <button onClick={() => setShowLogin(!showLogin)} style={{
              background: "white",
              color: "#3b82f6",
              border: "none",
              padding: "0.3rem 0.8rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}>Login</button>
          )}
        </div>
      </nav>

      <div style={{ padding: "2rem" }}>

        {/* Login Form */}
        {showLogin && (
          <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "2rem",
            marginBottom: "2rem",
            maxWidth: "400px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ color: "#1d4ed8", marginTop: 0 }}>Login 🔐</h2>
            {loginError && <p style={{ color: "#dc2626" }}>{loginError}</p>}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "1rem",
                marginBottom: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                boxSizing: "border-box"
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "1rem",
                marginBottom: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                boxSizing: "border-box"
              }}
            />
            <button onClick={handleLogin} style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "0.75rem 2rem",
              borderRadius: "6px",
              fontSize: "1rem",
              cursor: "pointer",
              width: "100%"
            }}>Login</button>
          </div>
        )}

        {/* Create Post Form */}
        {showForm && token && (
          <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "2rem",
            marginBottom: "2rem",
            maxWidth: "600px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ color: "#1d4ed8", marginTop: 0 }}>
              Create New Post ✍️
            </h2>
            <input
              type="text"
              placeholder="Post title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "1rem",
                marginBottom: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                boxSizing: "border-box"
              }}
            />
            <textarea
              placeholder="Write your content here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={5}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "1rem",
                marginBottom: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                boxSizing: "border-box"
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "0.75rem 2rem",
                borderRadius: "6px",
                fontSize: "1rem",
                cursor: "pointer",
                width: "100%"
              }}>
              {saving ? "Publishing..." : "Publish Post 🚀"}
            </button>
          </div>
        )}

        {/* Posts List */}
        <h1>Latest Posts 📝</h1>
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet!</p>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              onClick={() => navigate(`/post/${post.id}`)}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "1.5rem",
                marginBottom: "1rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                cursor: "pointer"
              }}>
              <h2 style={{ color: "#1d4ed8", margin: "0 0 0.5rem 0" }}>
                {post.title}
              </h2>
              <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric"
                })}
              </p>
              <p>{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home token={token} setToken={setToken} />} />
        <Route path="/post/:id" element={<PostDetail token={token} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;