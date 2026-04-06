import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, deletePost } from '../api';

function DeletePost({ token }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        getPost(id).then(res => setPost(res.data));
    }, [id, token, navigate]);

    function handleDelete() {
        setDeleting(true);
        deletePost(id)
            .then(() => navigate('/'))
            .catch(() => setDeleting(false));
    }

    if (!post) return <p style={{ padding: '2rem' }}>Loading...</p>;

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <button
                onClick={() => navigate(`/post/${id}`)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#1d4ed8',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginBottom: '1rem',
                    padding: '0'
                }}>← Back to Post</button>

            <div style={{
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                padding: '2rem',
                background: '#fff5f5',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ color: '#dc2626', marginTop: 0 }}>
                    Delete Post 🗑️
                </h1>

                <p style={{ color: '#374151' }}>
                    Are you sure you want to delete:
                </p>

                <h2 style={{ color: '#1d4ed8' }}>{post.title}</h2>

                <p style={{ color: '#dc2626', fontWeight: 'bold' }}>
                    ⚠️ This action cannot be undone!
                </p>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '1.5rem'
                }}>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 2rem',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            flex: 1
                        }}>
                        {deleting ? 'Deleting...' : 'Yes Delete ❌'}
                    </button>

                    <button
                        onClick={() => navigate(`/post/${id}`)}
                        style={{
                            background: '#e5e7eb',
                            color: '#374151',
                            border: 'none',
                            padding: '0.75rem 2rem',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            flex: 1
                        }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeletePost;