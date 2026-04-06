import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, getCategories } from '../api';
import Stories from '../components/Stories';

function Home({ token, username }) {
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
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
                padding: '4rem 2rem',
                textAlign: 'center',
                color: 'white'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    margin: '0 0 1rem 0',
                    letterSpacing: '-1px'
                }}>Welcome to MyBlog 📝</h1>
                <p style={{
                    fontSize: '1.1rem',
                    opacity: 0.85,
                    marginBottom: '2rem'
                }}>Discover stories, ideas and expertise</p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} style={{
                    display: 'flex',
                    gap: '0.5rem',
                    maxWidth: '500px',
                    margin: '0 auto'
                }}>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '1rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                    />
                    <button type="submit" style={{
                        background: 'white',
                        color: '#1d4ed8',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>Search</button>
                </form>
            </div>

            {/* Stories Bar */}
            <Stories token={token} username={username} />

            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '2rem'
            }}>
                {/* Categories Filter */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}>
                    <span style={{
                        color: '#6b7280',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}>Filter:</span>

                    <button
                        onClick={() => { setCategory(''); setPage(1); }}
                        style={{
                            background: category === '' ? '#1d4ed8' : 'white',
                            color: category === '' ? 'white' : '#374151',
                            border: '1px solid #e5e7eb',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>All Posts</button>

                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { setCategory(cat.slug); setPage(1); }}
                            style={{
                                background: category === cat.slug ? '#1d4ed8' : 'white',
                                color: category === cat.slug ? 'white' : '#374151',
                                border: '1px solid #e5e7eb',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}>{cat.name}</button>
                    ))}
                </div>

                {/* Section Title */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <h2 style={{
                        margin: 0,
                        color: '#111827',
                        fontWeight: '700'
                    }}>Latest Posts</h2>
                    <span style={{
                        color: '#6b7280',
                        fontSize: '0.9rem'
                    }}>Page {page} of {totalPages}</span>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        color: '#dc2626',
                        background: '#fef2f2',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        border: '1px solid #fca5a5'
                    }}>{error}</div>
                )}

                {/* Posts */}
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#6b7280'
                    }}>
                        <div style={{ fontSize: '2rem' }}>⏳</div>
                        <p>Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#6b7280'
                    }}>
                        <div style={{ fontSize: '3rem' }}>📭</div>
                        <p>No posts found!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div
                            key={post.id}
                            onClick={() => navigate(`/post/${post.id}`)}
                            style={{
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '12px',
                                marginBottom: '1.5rem',
                                overflow: 'hidden',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                            }}>

                            {/* Post Image */}
                            {post.image && (
                                <img
                                    src={`http://127.0.0.1:8000${post.image}`}
                                    alt={post.title}
                                    style={{
                                        width: '100%',
                                        height: '220px',
                                        objectFit: 'cover'
                                    }}
                                />
                            )}

                            <div style={{ padding: '1.5rem' }}>
                                {post.category_name && (
                                    <span style={{
                                        background: '#dbeafe',
                                        color: '#1d4ed8',
                                        padding: '0.2rem 0.7rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>{post.category_name}</span>
                                )}

                                <h2 style={{
                                    color: '#111827',
                                    margin: '0.75rem 0 0.5rem 0',
                                    fontSize: '1.3rem',
                                    fontWeight: '700',
                                    lineHeight: '1.4'
                                }}>{post.title}</h2>

                                <p style={{
                                    color: '#6b7280',
                                    fontSize: '0.85rem',
                                    marginBottom: '0.75rem'
                                }}>
                                    By <strong style={{ color: '#374151' }}>
                                        {post.author_name}
                                    </strong> •{' '}
                                    {new Date(post.date).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>

                                <p style={{
                                    color: '#4b5563',
                                    lineHeight: '1.6',
                                    marginBottom: '1rem'
                                }}>
                                    {post.content.substring(0, 150)}...
                                </p>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        color: '#6b7280',
                                        fontSize: '0.9rem'
                                    }}>
                                        <span>❤️ {post.total_likes}</span>
                                        <span>💬 {post.total_comments}</span>
                                    </div>
                                    <span style={{
                                        color: '#1d4ed8',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}>Read more →</span>
                                </div>
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
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={{
                                background: page === 1 ? '#e5e7eb' : 'white',
                                color: page === 1 ? '#9ca3af' : '#374151',
                                border: '1px solid #e5e7eb',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                cursor: page === 1 ? 'not-allowed' : 'pointer'
                            }}>← Prev</button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                style={{
                                    background: page === p ? '#1d4ed8' : 'white',
                                    color: page === p ? 'white' : '#374151',
                                    border: '1px solid #e5e7eb',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: page === p ? '600' : '400'
                                }}>{p}</button>
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            style={{
                                background: page === totalPages ? '#e5e7eb' : 'white',
                                color: page === totalPages ? '#9ca3af' : '#374151',
                                border: '1px solid #e5e7eb',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                cursor: page === totalPages ? 'not-allowed' : 'pointer'
                            }}>Next →</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;