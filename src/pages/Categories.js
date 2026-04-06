import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getPosts } from '../api';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getCategories()
            .then(res => {
                setCategories(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    function handleCategoryClick(cat) {
        setSelectedCategory(cat);
        setLoading(true);
        getPosts({ category: cat.slug })
            .then(res => {
                setPosts(res.data.posts);
                setLoading(false);
            });
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ color: '#1d4ed8' }}>Categories 📂</h1>

            {/* Categories Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat)}
                        style={{
                            border: selectedCategory?.id === cat.id
                                ? '2px solid #1d4ed8'
                                : '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            cursor: 'pointer',
                            background: selectedCategory?.id === cat.id
                                ? '#dbeafe'
                                : 'white',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                        <h3 style={{
                            color: '#1d4ed8',
                            margin: '0 0 0.5rem 0'
                        }}>{cat.name}</h3>
                        <p style={{
                            color: '#6b7280',
                            fontSize: '0.85rem',
                            margin: 0
                        }}>{cat.description || 'No description'}</p>
                    </div>
                ))}
            </div>

            {/* Posts for selected category */}
            {selectedCategory && (
                <div>
                    <h2 style={{ color: '#1d4ed8' }}>
                        Posts in "{selectedCategory.name}"
                    </h2>

                    {loading ? (
                        <p>Loading posts...</p>
                    ) : posts.length === 0 ? (
                        <p style={{ color: '#6b7280' }}>
                            No posts in this category yet!
                        </p>
                    ) : (
                        posts.map(post => (
                            <div
                                key={post.id}
                                onClick={() => navigate(`/post/${post.id}`)}
                                style={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    marginBottom: '1rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}>
                                <h3 style={{
                                    color: '#1d4ed8',
                                    margin: '0 0 0.5rem 0'
                                }}>{post.title}</h3>
                                <p style={{
                                    color: '#6b7280',
                                    fontSize: '0.85rem'
                                }}>
                                    By {post.author_name} •{' '}
                                    {new Date(post.date).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                                <p style={{ color: '#374151' }}>
                                    {post.content.substring(0, 150)}...
                                </p>
                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    color: '#6b7280',
                                    fontSize: '0.9rem'
                                }}>
                                    <span>❤️ {post.total_likes}</span>
                                    <span>💬 {post.total_comments}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Categories;