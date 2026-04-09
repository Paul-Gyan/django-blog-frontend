import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, getCategories } from '../api';
import Stories from '../components/Stories';
import { theme } from '../styles/theme';

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
    const resultsRef = useRef(null);

    function fetchPosts(searchTerm, categoryTerm, pageNum) {
        setLoading(true);
        setError('');
        getPosts({
            search: searchTerm,
            category: categoryTerm,
            page: pageNum
        })
            .then(res => {
                setPosts(res.data.posts);
                setTotalPages(res.data.pages);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load posts!');
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchPosts(search, category, page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, category, page]);

    useEffect(() => {
        getCategories()
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    function handleSearch(e) {
        e.preventDefault();
        setPage(1);
        fetchPosts(search, category, 1);
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }

    function handleCategoryChange(slug) {
        setCategory(slug);
        setPage(1);
    }

    function handlePageChange(newPage) {
        setPage(newPage);
    }

    return (
        <div style={{ minHeight: '100vh', background: theme.colors.light }}>

            {/* Compact Hero Section */}
            <div style={{
                background: theme.gradients.rainbow,
                padding: '1rem',
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{
                        fontSize: '1.3rem',
                        fontWeight: '900',
                        margin: '0 0 0.5rem 0',
                        letterSpacing: '-0.5px',
                        lineHeight: '1.1'
                    }}>
                        Share Your Story{' '}
                        <span style={{ opacity: 0.9 }}>With The World ✨</span>
                    </h1>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} style={{
                        display: 'flex',
                        gap: '0.5rem',
                        maxWidth: '550px',
                        margin: '0 auto'
                    }}>
                        <input
                            type="text"
                            placeholder="🔍 Search posts, authors, categories..."
                            value={search}
                            onChange={e => {
                                const value = e.target.value;
                                setSearch(value);
                                setLoading(true);
                                getPosts({
                                    search: value,
                                    category: category,
                                    page: 1
                                })
                                    .then(res => {
                                        setPosts(res.data.posts);
                                        setTotalPages(res.data.pages);
                                        setPage(1);
                                        setLoading(false);
                                        setTimeout(() => {
                                            resultsRef.current?.scrollIntoView({
                                                behavior: 'smooth'
                                            });
                                        }, 300);
                                    })
                                    .catch(() => setLoading(false));
                            }}
                            style={{
                                flex: 1,
                                padding: '0.6rem 1.2rem',
                                borderRadius: theme.borderRadius.full,
                                border: 'none',
                                fontSize: '0.9rem',
                                boxShadow: theme.shadows.lg,
                                outline: 'none'
                            }}
                        />
                        <button type="submit" style={{
                            background: theme.colors.dark,
                            color: 'white',
                            border: 'none',
                            padding: '0.6rem 1.2rem',
                            borderRadius: theme.borderRadius.full,
                            cursor: 'pointer',
                            fontWeight: '700',
                            boxShadow: theme.shadows.lg,
                            fontSize: '0.9rem'
                        }}>Search</button>
                    </form>
                </div>
            </div>

            {/* Stories Bar — compact padding */}
            <div style={{ padding: '0.5rem 0' }}>
                <Stories token={token} username={username} />
            </div>

            {/* Main Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '1rem auto',
                padding: '0 1.5rem'
            }}>
                {/* Categories Filter */}
                <div style={{
                    display: 'flex',
                    gap: '0.4rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}>
                    <span style={{
                        color: theme.colors.gray,
                        fontSize: '0.8rem',
                        fontWeight: '600'
                    }}>Filter:</span>

                    <button
                        onClick={() => handleCategoryChange('')}
                        style={{
                            background: category === ''
                                ? theme.gradients.primary
                                : 'white',
                            color: category === '' ? 'white' : theme.colors.dark,
                            border: `1px solid ${theme.colors.grayLight}`,
                            padding: '0.2rem 0.7rem',
                            borderRadius: theme.borderRadius.full,
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            boxShadow: theme.shadows.sm
                        }}>All Posts</button>

                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.slug)}
                            style={{
                                background: category === cat.slug
                                    ? theme.gradients.primary
                                    : 'white',
                                color: category === cat.slug
                                    ? 'white'
                                    : theme.colors.dark,
                                border: `1px solid ${theme.colors.grayLight}`,
                                padding: '0.2rem 0.7rem',
                                borderRadius: theme.borderRadius.full,
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '500',
                                boxShadow: theme.shadows.sm
                            }}>{cat.name}</button>
                    ))}
                </div>

                {/* Section Title */}
                <div
                    ref={resultsRef}
                    style={{
                        marginBottom: '1rem'
                    }}>
                    <h2 style={{
                        margin: '0 0 0.3rem 0',
                        color: theme.colors.dark,
                        fontWeight: '800',
                        fontSize: '1.2rem'
                    }}>
                        {search
                            ? `🔍 Results for "${search}"`
                            : '🔥 Latest Posts'}
                    </h2>
                    <span style={{
                        color: theme.colors.gray,
                        fontSize: '0.8rem',
                        background: 'white',
                        padding: '0.2rem 0.7rem',
                        borderRadius: theme.borderRadius.full,
                        border: `1px solid ${theme.colors.grayLight}`,
                        display: 'inline-block'
                    }}>Page {page} of {totalPages}</span>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        color: theme.colors.danger,
                        background: '#fef2f2',
                        padding: '0.75rem',
                        borderRadius: theme.borderRadius.md,
                        marginBottom: '1rem',
                        border: '1px solid #fca5a5'
                    }}>{error}</div>
                )}

                {/* Posts */}
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: theme.colors.gray
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                        <p style={{ fontWeight: '600' }}>Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: theme.colors.gray,
                        background: 'white',
                        borderRadius: theme.borderRadius.xl,
                        boxShadow: theme.shadows.sm
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                        <h3 style={{
                            color: theme.colors.dark,
                            marginBottom: '0.5rem'
                        }}>
                            {search
                                ? `No results for "${search}"`
                                : 'No posts found!'}
                        </h3>
                        <p style={{ fontSize: '0.9rem' }}>
                            {search
                                ? 'Try a different search term'
                                : 'Be the first to share your story'}
                        </p>
                        {token && !search && (
                            <button
                                onClick={() => navigate('/create')}
                                style={{
                                    background: theme.gradients.primary,
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.6rem 1.5rem',
                                    borderRadius: theme.borderRadius.full,
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    marginTop: '1rem',
                                    fontSize: '0.9rem'
                                }}>+ Create First Post</button>
                        )}
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '1rem'
                    }}>
                        {posts.map((post, index) => (
                            <div
                                key={post.id}
                                onClick={() => navigate(`/post/${post.id}`)}
                                style={{
                                    background: 'white',
                                    borderRadius: theme.borderRadius.lg,
                                    overflow: 'hidden',
                                    boxShadow: theme.shadows.sm,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    border: `1px solid ${theme.colors.grayLight}`
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = theme.shadows.colored;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = theme.shadows.sm;
                                }}>

                                {/* Post Image or Color Bar */}
                                {post.image ? (
                                    <img
                                        src={`http://127.0.0.1:8000${post.image}`}
                                        alt={post.title}
                                        style={{
                                            width: '100%',
                                            height: '150px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        height: '6px',
                                        background: [
                                            theme.gradients.primary,
                                            theme.gradients.secondary,
                                            theme.gradients.cool,
                                            theme.gradients.warm,
                                        ][index % 4]
                                    }} />
                                )}

                                <div style={{ padding: '1rem' }}>
                                    {post.category_name && (
                                        <span style={{
                                            background: `${theme.colors.primary}15`,
                                            color: theme.colors.primary,
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: theme.borderRadius.full,
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>{post.category_name}</span>
                                    )}

                                    <h2 style={{
                                        color: theme.colors.dark,
                                        margin: '0.5rem 0 0.3rem 0',
                                        fontSize: '0.95rem',
                                        fontWeight: '800',
                                        lineHeight: '1.4'
                                    }}>{post.title}</h2>

                                    <p style={{
                                        color: theme.colors.gray,
                                        fontSize: '0.75rem',
                                        marginBottom: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem'
                                    }}>
                                        <span style={{
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            background: theme.gradients.primary,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: '700',
                                            fontSize: '0.6rem',
                                            flexShrink: 0
                                        }}>
                                            {post.author_name?.charAt(0).toUpperCase()}
                                        </span>
                                        <strong style={{ color: '#475569' }}>
                                            {post.author_name}
                                        </strong> •{' '}
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>

                                    <p style={{
                                        color: '#64748b',
                                        lineHeight: '1.5',
                                        marginBottom: '0.75rem',
                                        fontSize: '0.82rem'
                                    }}>
                                        {post.content.substring(0, 80)}...
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '0.75rem',
                                        borderTop: `1px solid ${theme.colors.grayLight}`
                                    }}>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <span style={{
                                                color: theme.colors.gray,
                                                fontSize: '0.8rem'
                                            }}>❤️ {post.total_likes}</span>
                                            <span style={{
                                                color: theme.colors.gray,
                                                fontSize: '0.8rem'
                                            }}>💬 {post.total_comments}</span>
                                        </div>
                                        <span style={{
                                            color: theme.colors.primary,
                                            fontSize: '0.8rem',
                                            fontWeight: '700'
                                        }}>Read →</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
                            onClick={() => handlePageChange(Math.max(1, page - 1))}
                            disabled={page === 1}
                            style={{
                                background: page === 1
                                    ? theme.colors.grayLight : 'white',
                                color: page === 1
                                    ? theme.colors.gray : theme.colors.dark,
                                border: `1px solid ${theme.colors.grayLight}`,
                                padding: '0.4rem 1rem',
                                borderRadius: theme.borderRadius.full,
                                cursor: page === 1 ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem'
                            }}>← Prev</button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => handlePageChange(p)}
                                style={{
                                    background: page === p
                                        ? theme.gradients.primary : 'white',
                                    color: page === p ? 'white' : theme.colors.dark,
                                    border: `1px solid ${theme.colors.grayLight}`,
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: theme.borderRadius.full,
                                    cursor: 'pointer',
                                    fontWeight: page === p ? '700' : '400',
                                    fontSize: '0.85rem',
                                    minWidth: '35px'
                                }}>{p}</button>
                        ))}

                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            style={{
                                background: page === totalPages
                                    ? theme.colors.grayLight : 'white',
                                color: page === totalPages
                                    ? theme.colors.gray : theme.colors.dark,
                                border: `1px solid ${theme.colors.grayLight}`,
                                padding: '0.4rem 1rem',
                                borderRadius: theme.borderRadius.full,
                                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem'
                            }}>Next →</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;