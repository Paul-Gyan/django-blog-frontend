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
        if (!token) {
            navigate('/login');
            return;
        }
        toggleLike(id)
            .then(res => {
                setLiked(res.data.liked);
                setPost(prev => ({
                    ...prev,
                    total_likes: res.data.total_likes
                }));
            });
    }

    function handleComment() {
        if (!token) {
            navigate('/login');
            return;
        }
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

    if (loading) return <p style={{ padding: '2rem' }}>Loading post...</p>;
    if (!post) return <p style={{ padding: '2rem' }}>Post not found!</p>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#1d4ed8',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginBottom: '1rem',
                    padding: '0'
                }}>← Back to Home</button>

            {/* Post */}
            <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
            }}>
                {post.category_name && (
                    <span style={{
                        background: '#dbeafe',
                        color: '#1d4ed8',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                    }}>{post.category_name}</span>
                )}

                <h1 style={{ color: '#1d4ed8', marginTop: '0.5rem' }}>
                    {post.title}
                </h1>

                <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                    By {post.author_name} •{' '}
                    {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        margin: '0.5rem 0'
                    }}>
                        {post.tags.map(tag => (
                            <span key={tag} style={{
                                background: '#f3f4f6',
                                color: '#374151',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem'
                            }}>#{tag}</span>
                        ))}
                    </div>
                )}

                {/* Post Image */}
                {post.image && (
                    <>
                        <img
                            src={`http://127.0.0.1:8000${post.image}`}
                            alt={post.title}
                            onClick={() => setShowImage(true)}
                            style={{
                                width: '100%',
                                maxHeight: '400px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                marginTop: '1rem',
                                cursor: 'zoom-in'
                            }}
                        />

                        {/* Lightbox */}
                        {showImage && (
                            <div
                                onClick={() => setShowImage(false)}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'rgba(0,0,0,0.9)',
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
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '2rem',
                                        height: '2rem',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}>✕</button>
                            </div>
                        )}
                    </>
                )}

                <hr />

                {/* Post Content */}
                <div
                    style={{ lineHeight: '1.8', fontSize: '1.1rem' }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Like Button */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '1.5rem',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={handleLike}
                        style={{
                            background: liked ? '#dc2626' : '#f3f4f6',
                            color: liked ? 'white' : '#374151',
                            border: 'none',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}>
                        ❤️ {post.total_likes} {liked ? 'Liked' : 'Like'}
                    </button>
                    <span style={{ color: '#6b7280' }}>
                        💬 {post.total_comments} Comments
                    </span>
                </div>

                {/* Edit & Delete — only if logged in */}
                {token && (
                    <div style={{
                        marginTop: '1rem',
                        display: 'flex',
                        gap: '1rem'
                    }}>
                        <button
                            onClick={() => navigate(`/post/${id}/edit`)}
                            style={{
                                background: '#1d4ed8',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}>✏️ Edit</button>
                        <button
                            onClick={() => navigate(`/post/${id}/delete`)}
                            style={{
                                background: '#dc2626',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}>🗑️ Delete</button>
                    </div>
                )}
            </div>

            {/* Comments Section */}
            <div>
                <h2 style={{ color: '#1d4ed8' }}>
                    💬 Comments ({post.total_comments})
                </h2>

                {error && (
                    <p style={{ color: '#dc2626' }}>{error}</p>
                )}

                {/* Add Comment */}
                {token ? (
                    <div style={{ marginBottom: '2rem' }}>
                        <textarea
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                boxSizing: 'border-box',
                                marginBottom: '0.5rem'
                            }}
                        />
                        <button
                            onClick={handleComment}
                            style={{
                                background: '#1d4ed8',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}>Post Comment</button>
                    </div>
                ) : (
                    <p style={{ color: '#6b7280' }}>
                        <span
                            onClick={() => navigate('/login')}
                            style={{ color: '#1d4ed8', cursor: 'pointer' }}>
                            Login
                        </span> to leave a comment
                    </p>
                )}

                {/* Comments List */}
                {post.comments && post.comments.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    post.comments && post.comments.map(c => (
                        <div key={c.id} style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '1rem',
                            marginBottom: '1rem',
                            background: '#f9fafb'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <strong style={{ color: '#1d4ed8' }}>
                                    👤 {c.author_name}
                                </strong>
                                <span style={{
                                    color: '#6b7280',
                                    fontSize: '0.8rem'
                                }}>
                                    {new Date(c.date).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <p style={{ margin: '0.5rem 0 0 0' }}>
                                {c.content}
                            </p>
                            {token && c.author_name === username && (
                                <button
                                    onClick={() => handleDeleteComment(c.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#dc2626',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        marginTop: '0.5rem'
                                    }}>🗑️ Delete</button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PostDetail;