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

    if (loading) return <p style={{ padding: '2rem' }}>Loading profile...</p>;
    if (error) return <p style={{ padding: '2rem', color: '#dc2626' }}>{error}</p>;
    if (!profile) return <p style={{ padding: '2rem' }}>Profile not found!</p>;

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

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

            {/* Profile Card */}
            <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem',
                display: 'flex',
                gap: '2rem',
                alignItems: 'flex-start'
            }}>
                {/* Avatar */}
                <div>
                    {profile.avatar ? (
                        <img
                            src={`http://127.0.0.1:8000${profile.avatar}`}
                            alt={profile.username}
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '3px solid #1d4ed8'
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: '#1d4ed8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            color: 'white',
                            border: '3px solid #1d4ed8'
                        }}>
                            {profile.username?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Profile Info */}
                <div style={{ flex: 1 }}>
                    <h1 style={{ color: '#1d4ed8', marginTop: 0 }}>
                        👤 {profile.username}
                    </h1>

                    {profile.bio && (
                        <p style={{ color: '#374151', marginBottom: '0.5rem' }}>
                            {profile.bio}
                        </p>
                    )}

                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                        marginTop: '0.5rem'
                    }}>
                        {profile.location && (
                            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                📍 {profile.location}
                            </span>
                        )}
                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: '#1d4ed8', fontSize: '0.9rem' }}>
                                🌐 {profile.website}
                            </a>
                        )}
                    </div>

                    <div style={{
                        marginTop: '1rem',
                        display: 'flex',
                        gap: '1rem'
                    }}>
                        <span style={{
                            background: '#dbeafe',
                            color: '#1d4ed8',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            📝 {posts.length} Posts
                        </span>
                    </div>

                    {/* Edit Profile Button */}
                    {token && currentUser === username && (
                        <button
                            onClick={() => navigate('/profile/edit')}
                            style={{
                                marginTop: '1rem',
                                background: '#1d4ed8',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}>✏️ Edit Profile</button>
                    )}
                </div>
            </div>

            {/* User Posts */}
            <h2 style={{ color: '#1d4ed8' }}>Posts by {profile.username}</h2>

            {posts.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No posts yet!</p>
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

                        <h3 style={{
                            color: '#1d4ed8',
                            margin: '0.5rem 0'
                        }}>{post.title}</h3>

                        <p style={{
                            color: '#6b7280',
                            fontSize: '0.85rem'
                        }}>
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
    );
}

export default Profile;