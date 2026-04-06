import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, toggleLike, createComment, deleteComment } from './api';

function PostDetail({ token, username }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(false);
    const [error, setError] = useState('');
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        getPost(id)
            .then(res => {
                setPost(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    function handleLike() {
        if (!token) { navigate('/login'); return; }
        toggleLike(id)
            .then(res => {
                setLiked(res.data.liked);
                setPost(prev => ({ ...prev, total_likes: res.data.total_likes }));
            });
    }

    function handleComment() {
        if (!token) { navigate('/login'); return; }
        if (!comment.trim()) return;
        createComment(id, { content: comment })
            .then(res => {
                setPost(prev => ({
                    ...prev,
                    comments: [...prev.comments, res.data],
                    total_comments: prev.total_comments + 1
                }));
                setComment('');
            })
            .catch(() => setError('Failed to post comment!'));
    }

    function handleDeleteComment(commentId) {
        deleteComment(commentId)
            .then(() => {
                setPost(prev => ({
                    ...prev,
                    comments: prev.comments.filter(c => c.id !== commentId),
                    total_comments: prev.total_comments - 1
                }));
            });
    }

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
            <div style={{ fontSize: '2rem' }}>⏳</div>
            <p>Loading post...</p>
        </div>
    );

    if (!post) return (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem' }}>😕</div>
            <p>Post not found!</p>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
                padding: '2rem',
                color: 'white'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            padding: '0.4rem 1rem',
                            borderRadius: '6px',
                            marginBottom: '1rem'
                        }}>← Back</button>

                    {post.category_name && (
                        <span style={{
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '0.2rem 0.7rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'inline-block',
                            marginBottom: '0.75rem'
                        }}>{post.category_name}</span>
                    )}

                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        margin: '0 0 1rem 0',
                        lineHeight: '1.3'
                    }}>{post.title}</h1>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        <span style={{ opacity: 0.85, fontSize: '0.9rem' }}>
                            By <strong>{post.author_name}</strong>
                        </span>
                        <span style={{ opacity: 0.6 }}>•</span>
                        <span style={{ opacity: 0.85, fontSize: '0.9rem' }}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </span>
                        <span style={{ opacity: 0.6 }}>•</span>
                        <span style={{ opacity: 0.85, fontSize: '0.9rem' }}>
                            ❤️ {post.total_likes} · 💬 {post.total_comments}
                        </span>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            flexWrap: 'wrap',
                            marginTop: '1rem'
                        }}>
                            {post.tags.map(tag => (
                                <span key={tag} style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    color: 'white',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem'
                                }}>#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

                {/* Post Image */}
                {post.image && (
                    <>
                        <img
                            src={`http://127.0.0.1:8000${post.image}`}
                            alt={post.title}
                            onClick={() => setShowImage(true)}
                            style={{
                                width: '100%',
                                maxHeight: '450px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                marginBottom: '2rem',
                                cursor: 'zoom-in',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                            }}
                        />

                        {showImage && (
                            <div
                                onClick={() => setShowImage(false)}
                                style={{
                                    position: 'fixed',
                                    top: 0, left: 0,
                                    width: '100%', height: '100%',
                                    background: 'rgba(0,0,0,0.92)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1000,
                                    cursor: 'zoom-out'
                                }}>
                                <img
                                    src={`http://127.0.0.1:8000${post.image}`}
                                    alt={post.title}
                                    style={{
                                        maxWidth: '90%',
                                        maxHeight: '90vh',
                                        objectFit: 'contain',
                                        borderRadius: '8px'
                                    }}
                                />
                                <button
                                    onClick={() => setShowImage(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '1rem', right: '1rem',
                                        background: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '2.5rem', height: '2.5rem',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                    }}>✕</button>
                            </div>
                        )}
                    </>
                )}

                {/* Post Content */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    marginBottom: '2rem',
                    lineHeight: '1.8',
                    fontSize: '1.05rem',
                    color: '#374151'
                }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Action Bar */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1rem 1.5rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={handleLike}
                        style={{
                            background: liked ? '#fee2e2' : '#f3f4f6',
                            color: liked ? '#dc2626' : '#374151',
                            border: 'none',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}>
                        {liked ? '❤️' : '🤍'} {post.total_likes} {liked ? 'Liked!' : 'Like'}
                    </button>

                    {token && (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => navigate(`/post/${id}/edit`)}
                                style={{
                                    background: '#dbeafe',
                                    color: '#1d4ed8',
                                    border: 'none',
                                    padding: '0.5rem 1.2rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}>✏️ Edit</button>
                            <button
                                onClick={() => navigate(`/post/${id}/delete`)}
                                style={{
                                    background: '#fee2e2',
                                    color: '#dc2626',
                                    border: 'none',
                                    padding: '0.5rem 1.2rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}>🗑️ Delete</button>
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                }}>
                    <h2 style={{
                        color: '#111827',
                        marginTop: 0,
                        fontSize: '1.3rem',
                        fontWeight: '700'
                    }}>
                        💬 Comments ({post.total_comments})
                    </h2>

                    {error && (
                        <p style={{
                            color: '#dc2626',
                            background: '#fef2f2',
                            padding: '0.5rem',
                            borderRadius: '6px'
                        }}>{error}</p>
                    )}

                    {/* Add Comment */}
                    {token ? (
                        <div style={{
                            marginBottom: '2rem',
                            background: '#f8fafc',
                            padding: '1rem',
                            borderRadius: '8px'
                        }}>
                            <textarea
                                placeholder="Share your thoughts..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box',
                                    marginBottom: '0.75rem',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <button
                                onClick={handleComment}
                                style={{
                                    background: '#1d4ed8',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.6rem 1.5rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}>Post Comment</button>
                        </div>
                    ) : (
                        <div style={{
                            background: '#f8fafc',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '2rem',
                            textAlign: 'center',
                            color: '#6b7280'
                        }}>
                            <span
                                onClick={() => navigate('/login')}
                                style={{
                                    color: '#1d4ed8',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}>Login</span> to leave a comment
                        </div>
                    )}

                    {/* Comments List */}
                    {post.comments && post.comments.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            color: '#6b7280'
                        }}>
                            <div style={{ fontSize: '2rem' }}>💭</div>
                            <p>No comments yet. Be the first!</p>
                        </div>
                    ) : (
                        post.comments && post.comments.map(c => (
                            <div key={c.id} style={{
                                borderBottom: '1px solid #f3f4f6',
                                padding: '1rem 0',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '0.5rem'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: '#1d4ed8',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '700',
                                            fontSize: '0.85rem'
                                        }}>
                                            {c.author_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <strong style={{ color: '#111827' }}>
                                            {c.author_name}
                                        </strong>
                                    </div>
                                    <span style={{
                                        color: '#9ca3af',
                                        fontSize: '0.8rem'
                                    }}>
                                        {new Date(c.date).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p style={{
                                    margin: '0 0 0.5rem 2.5rem',
                                    color: '#4b5563',
                                    lineHeight: '1.6'
                                }}>{c.content}</p>
                                {token && c.author_name === username && (
                                    <button
                                        onClick={() => handleDeleteComment(c.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#dc2626',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            marginLeft: '2.5rem'
                                        }}>🗑️ Delete</button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostDetail;