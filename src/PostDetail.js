import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PostDetail({ token }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/posts/${id}/`)
            .then(response => response.json())
            .then(data => {
                setPost(data);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p style={{ padding: "2rem" }}>Loading post...</p>;
    if (!post) return <p style={{ padding: "2rem" }}>Post not found!</p>;

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
            </nav>

            <div style={{ padding: "2rem" }}>

                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#3b82f6",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "1rem",
                        marginBottom: "1rem",
                        padding: "0"
                    }}>
                    ← Back to Home
                </button>

                {/* Post */}
                <div style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "2rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}>
                    <h1 style={{ color: "#1d4ed8", marginTop: 0 }}>
                        {post.title}
                    </h1>
                    <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                        {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric"
                        })}
                    </p>
                    <hr />
                    <p style={{ lineHeight: "1.8" }}>{post.content}</p>

                    {/* Edit & Delete — only if logged in */}
                    {token && (
                        <div style={{
                            marginTop: "1.5rem",
                            display: "flex",
                            gap: "1rem"
                        }}>
                            <button
                                onClick={() => navigate(`/post/${id}/edit`)}
                                style={{
                                    background: "#3b82f6",
                                    color: "white",
                                    border: "none",
                                    padding: "0.5rem 1.5rem",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}>
                                ✏️ Edit
                            </button>
                            <button
                                onClick={() => navigate(`/post/${id}/delete`)}
                                style={{
                                    background: "#dc2626",
                                    color: "white",
                                    border: "none",
                                    padding: "0.5rem 1.5rem",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}>
                                🗑️ Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostDetail;