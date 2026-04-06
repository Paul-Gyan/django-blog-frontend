import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, editPost, getCategories } from '../api';

function EditPost({ token }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState('');
    const [image, setImage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        Promise.all([
            getPost(id),
            getCategories()
        ]).then(([postRes, catRes]) => {
            setTitle(postRes.data.title);
            setContent(postRes.data.content);
            setCategory(postRes.data.category || '');
            setTags(postRes.data.tags ? postRes.data.tags.join(', ') : '');
            setCategories(catRes.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setError('Failed to load post!');
            setLoading(false);
        });
    }, [id, token, navigate]);

    function handleSubmit() {
        if (!title || !content) {
            setError('Title and content are required!');
            return;
        }
        setSaving(true);
        setError('');

        const tagList = tags.split(',').map(t => t.trim()).filter(t => t);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('tags', JSON.stringify(tagList));
        if (category) formData.append('category', category);
        if (image) formData.append('image', image);

        editPost(id, formData)
            .then(() => navigate(`/post/${id}`))
            .catch(() => {
                setError('Failed to update post!');
                setSaving(false);
            });
    }

    if (loading) return <p style={{ padding: '2rem' }}>Loading post...</p>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
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
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ color: '#1d4ed8', marginTop: 0 }}>
                    Edit Post ✏️
                </h1>

                {error && (
                    <p style={{
                        color: '#dc2626',
                        background: '#fef2f2',
                        padding: '0.5rem',
                        borderRadius: '6px'
                    }}>{error}</p>
                )}

                {/* Title */}
                <input
                    type="text"
                    placeholder="Post title..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        marginBottom: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '1.1rem',
                        boxSizing: 'border-box'
                    }}
                />

                {/* Category */}
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        marginBottom: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                    }}>
                    <option value="">Select Category (optional)</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Tags */}
                <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        marginBottom: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                    }}
                />

                {/* Image Upload */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontWeight: 'bold'
                    }}>Replace Image (optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setImage(e.target.files[0])}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Content */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontWeight: 'bold'
                    }}>Content</label>
                    <textarea
                        placeholder="Write your content here..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={12}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    style={{
                        background: '#1d4ed8',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 2rem',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        width: '100%',
                        marginTop: '1rem'
                    }}>
                    {saving ? 'Saving...' : 'Save Changes ✅'}
                </button>
            </div>
        </div>
    );
}

export default EditPost;