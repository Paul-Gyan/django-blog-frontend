import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createPost, getCategories } from '../api';

function CreatePost({ token }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState('');
    const [image, setImage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        getCategories().then(res => setCategories(res.data));
    }, [token, navigate]);

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

        createPost(formData)
            .then(() => navigate('/'))
            .catch(() => {
                setError('Failed to create post!');
                setSaving(false);
            });
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
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

            <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ color: '#1d4ed8', marginTop: 0 }}>
                    Create New Post ✍️
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
                    placeholder="Tags (comma separated e.g. django, python, web)"
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
                    }}>Post Image (optional)</label>
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

                {/* Rich Text Editor */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontWeight: 'bold'
                    }}>Content</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        style={{ height: '300px', marginBottom: '3rem' }}
                        modules={{
                            toolbar: [
                                [{ header: [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                ['link', 'blockquote', 'code-block'],
                                ['clean']
                            ]
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
                    {saving ? 'Publishing...' : 'Publish Post 🚀'}
                </button>
            </div>
        </div>
    );
}

export default CreatePost;