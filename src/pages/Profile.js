import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfile, getPosts } from '../api';

function Profile({ token, currentUser }) {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getProfile(username),
            getPosts({ search: '', page: 1 })
        ])
            .then(([profileRes, postsRes]) => {
                setProfile(profileRes.data);
                const userPosts = postsRes.data.posts.filter(
                    p => p.author_name === username
                );
                setPosts(userPosts);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load profile!');
                setLoading(false);
            });
    }, [username]);

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
            <div style={{ fontSize: '2rem' }}>⏳</div>
            <p>Loading profile...</p>
        </div>
    );

    if (error) return (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#dc2626' }}>
            <div style={{ fontSize: '3rem' }}>😕</div>
            <p>{error}</p>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

            {/* Profile Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
                padding: '3rem 2rem',
                color: 'white'
            }}>
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    display: 'flex',
                    gap: '2rem',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    {/* Avatar */}
                    {profile.avatar ? (
                        <img
                            src={`http://127.0.0.1:8000${profile.avatar}`}
                            alt={profile.username}
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '4px solid rgba(255,255,255,0.5)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            border: '4px solid rgba(255,255,255,0.5)'
                        }}>
                            {profile.username?.charAt(0).toUpperCase()}
                        </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            margin: '0 0 0.5rem 0',
                            fontSize: '2rem',
                            fontWeight: '800'
                        }}>{profile.username}</h1>

                        {profile.bio && (
                            <p style={{
                                opacity: 0.85,
                                margin: '0 0 0.75rem 0',
                                fontSize: '1rem'
                            }}>{profile.bio}</p>
                        )}

                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            flexWrap: 'wrap'
                        }}>
                            {profile.location && (
                                <span style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                                    📍 {profile.location}
                                </span>
                            )}
                            {profile.website && (
                                <a
                                    href={profile.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        color: 'white',
                                        opacity: 0.8,
                                        fontSize: '0.9rem'
                                    }}>
                                    🌐 {profile.website}
                                </a>
                            )}
                            <span style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                                📝 {posts.length} Posts
                            </span>
                        </div>
                    </div>

                    {/* Edit Button */}
                    {token && currentUser === username && (
                        <button
                            onClick={() => navigate('/profile/edit')}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.4)',
                                padding: '0.6rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}>✏️ Edit Profile</button>
                    )}
                </div>
            </div>

            {/* Posts */}
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '2rem'
            }}>
                <h2 style={{
                    color: '#111827',
                    fontWeight: '700',
                    marginBottom: '1.5rem'
                }}>Posts by {profile.username}</h2>

                {posts.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#6b7280',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                    }}>
                        <div style={{ fontSize: '3rem' }}>📭</div>
                        <p>No posts yet!</p>
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

                            {post.image && (
                                <img
                                    src={`http://127.0.0.1:8000${post.image}`}
                                    alt={post.title}
                                    style={{
                                        width: '100%',
                                        height: '200px',
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
                                        textTransform: 'uppercase'
                                    }}>{post.category_name}</span>
                                )}

                                <h3 style={{
                                    color: '#111827',
                                    margin: '0.75rem 0 0.5rem 0',
                                    fontSize: '1.2rem',
                                    fontWeight: '700'
                                }}>{post.title}</h3>

                                <p style={{
                                    color: '#6b7280',
                                    fontSize: '0.85rem',
                                    marginBottom: '0.75rem'
                                }}>
                                    {new Date(post.date).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>

                                <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                                    {post.content.substring(0, 120)}...
                                </p>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
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
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}>Read more →</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Profile;