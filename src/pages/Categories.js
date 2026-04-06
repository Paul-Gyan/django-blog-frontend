import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getPosts } from '../api';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getCategories()
            .then(res => {
                setCategories(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    function handleCategoryClick(cat) {
        setSelectedCategory(cat);
        setPostsLoading(true);
        getPosts({ category: cat.slug })
            .then(res => {
                setPosts(res.data.posts);
                setPostsLoading(false);
            });
    }

    const colors = [
        '#dbeafe', '#dcfce7', '#fef9c3',
        '#fce7f3', '#ede9fe', '#ffedd5'
    ];
    const textColors = [
        '#1d4ed8', '#16a34a', '#ca8a04',
        '#db2777', '#7c3aed', '#ea580c'
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
                padding: '3rem 2rem',
                color: 'white',
                textAlign: 'center'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    margin: '0 0 0.5rem 0'
                }}>📂 Categories</h1>
                <p style={{ opacity: 0.85, margin: 0 }}>
                    Browse posts by topic
                </p>
            </div>

            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '2rem'
            }}>
                {/* Categories Grid */}
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#6b7280'
                    }}>
                        <div style={{ fontSize: '2rem' }}>⏳</div>
                        <p>Loading categories...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#6b7280',
                        background: 'white',
                        borderRadius: '12px'
                    }}>
                        <div style={{ fontSize: '3rem' }}>📭</div>
                        <p>No categories yet!</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        {categories.map((cat, index) => (
                            <div
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat)}
                                style={{
                                    background: selectedCategory?.id === cat.id
                                        ? colors[index % colors.length]
                                        : 'white',
                                    border: selectedCategory?.id === cat.id
                                        ? `2px solid ${textColors[index % textColors.length]}`
                                        : '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
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
                                <h3 style={{
                                    color: textColors[index % textColors.length],
                                    margin: '0 0 0.5rem 0',
                                    fontWeight: '700'
                                }}>{cat.name}</h3>
                                <p style={{
                                    color: '#6b7280',
                                    fontSize: '0.85rem',
                                    margin: 0
                                }}>{cat.description || 'Click to explore posts'}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Posts for selected category */}
                {selectedCategory && (
                    <div>
                        <h2 style={{
                            color: '#111827',
                            fontWeight: '700',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            Posts in
                            <span style={{
                                background: '#dbeafe',
                                color: '#1d4ed8',
                                padding: '0.2rem 0.8rem',
                                borderRadius: '20px',
                                fontSize: '0.9rem'
                            }}>{selectedCategory.name}</span>
                        </h2>

                        {postsLoading ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem',
                                color: '#6b7280'
                            }}>
                                <div style={{ fontSize: '2rem' }}>⏳</div>
                                <p>Loading posts...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem',
                                color: '#6b7280',
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                            }}>
                                <div style={{ fontSize: '3rem' }}>📭</div>
                                <p>No posts in this category yet!</p>
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
                                        marginBottom: '1rem',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
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

                                    {post.image && (
                                        <img
                                            src={`http://127.0.0.1:8000${post.image}`}
                                            alt={post.title}
                                            style={{
                                                width: '100%',
                                                height: '180px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )}

                                    <div style={{ padding: '1.5rem' }}>
                                        <h3 style={{
                                            color: '#111827',
                                            margin: '0 0 0.5rem 0',
                                            fontWeight: '700'
                                        }}>{post.title}</h3>

                                        <p style={{
                                            color: '#6b7280',
                                            fontSize: '0.85rem',
                                            marginBottom: '0.5rem'
                                        }}>
                                            By <strong>{post.author_name}</strong> •{' '}
                                            {new Date(post.date).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>

                                        <p style={{
                                            color: '#4b5563',
                                            lineHeight: '1.6'
                                        }}>
                                            {post.content.substring(0, 120)}...
                                        </p>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginTop: '1rem'
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
                                                fontWeight: '600',
                                                fontSize: '0.9rem'
                                            }}>Read more →</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Categories;