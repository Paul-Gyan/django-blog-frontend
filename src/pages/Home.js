import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, getCategories } from '../api';

function Home() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError('');
        getPosts({ search, category, page })
            .then(res => {
                setPosts(res.data.posts);
                setTotalPages(res.data.pages);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load posts. Make sure Django server is running!');
                setLoading(false);
            });
    }, [page, category, search]);

    useEffect(() => {
        getCategories()
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    function handleSearch(e) {
        e.preventDefault();
        setPage(1);
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '1rem'
                    }}
                />
                <button type="submit" style={{
                    background: '#1d4ed8',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer'
                }}>Search</button>
            </form>

            {/* Categories Filter */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={() => { setCategory(''); setPage(1); }}
                    style={{
                        background: category === '' ? '#1d4ed8' : '#e5e7eb',
                        color: category === '' ? 'white' : 'black',
                        border: 'none',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        cursor: 'pointer'
                    }}>All</button>

                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => { setCategory(cat.slug); setPage(1); }}
                        style={{
                            background: category === cat.slug ? '#1d4ed8' : '#e5e7eb',
                            color: category === cat.slug ? 'white' : 'black',
                            border: 'none',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '20px',
                            cursor: 'pointer'
                        }}>{cat.name}</button>
                ))}
            </div>

            {/* Posts List */}
            <h1 style={{ marginBottom: '1.5rem' }}>Latest Posts 📝</h1>

            {/* Error Message */}
            {error && (
                <p style={{
                    color: '#dc2626',
                    background: '#fef2f2',
                    padding: '1rem',
                    borderRadius: '6px',
                    marginBottom: '1rem'
                }}>{error}</p>
            )}

            {loading ? (
                <p>Loading posts...</p>
            ) : posts.length === 0 ? (
                <p>No posts found!</p>
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
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                        }}>

                        {/* Post Image */}
                        {post.image && (
                            <img
                                src={`http://127.0.0.1:8000${post.image}`}
                                alt={post.title}
                                style={{
                                    width: '100%',
                                    maxHeight: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '6px',
                                    marginBottom: '0.5rem'
                                }}
                            />
                        )}

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

                        <h2 style={{
                            color: '#1d4ed8',
                            margin: '0.5rem 0'
                        }}>{post.title}</h2>

                        <p style={{
                            color: '#6b7280',
                            fontSize: '0.85rem',
                            marginBottom: '0.5rem'
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
                            marginTop: '0.5rem',
                            color: '#6b7280',
                            fontSize: '0.9rem'
                        }}>
                            <span>❤️ {post.total_likes}</span>
                            <span>💬 {post.total_comments}</span>
                        </div>
                    </div>
                ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'center',
                    marginTop: '2rem'
                }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            style={{
                                background: page === p ? '#1d4ed8' : '#e5e7eb',
                                color: page === p ? 'white' : 'black',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}>{p}</button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;