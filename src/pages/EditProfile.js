import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../api';

function EditProfile({ token, username }) {
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        getProfile(username)
            .then(res => {
                setBio(res.data.bio || '');
                setLocation(res.data.location || '');
                setWebsite(res.data.website || '');
            });
    }, [token, username, navigate]);

    function handleSubmit() {
        setSaving(true);
        setError('');

        const formData = new FormData();
        formData.append('bio', bio);
        formData.append('location', location);
        formData.append('website', website);
        if (avatar) formData.append('avatar', avatar);

        updateProfile(formData)
            .then(() => navigate(`/profile/${username}`))
            .catch(() => {
                setError('Failed to update profile!');
                setSaving(false);
            });
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <button
                onClick={() => navigate(`/profile/${username}`)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#1d4ed8',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginBottom: '1rem',
                    padding: '0'
                }}>← Back to Profile</button>

            <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ color: '#1d4ed8', marginTop: 0 }}>
                    Edit Profile ✏️
                </h1>

                {error && (
                    <p style={{
                        color: '#dc2626',
                        background: '#fef2f2',
                        padding: '0.5rem',
                        borderRadius: '6px'
                    }}>{error}</p>
                )}

                {/* Avatar */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold',
                        color: '#374151'
                    }}>Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setAvatar(e.target.files[0])}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Bio */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold',
                        color: '#374151'
                    }}>Bio</label>
                    <textarea
                        placeholder="Tell us about yourself..."
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Location */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold',
                        color: '#374151'
                    }}>Location</label>
                    <input
                        type="text"
                        placeholder="e.g. Accra, Ghana"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Website */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold',
                        color: '#374151'
                    }}>Website</label>
                    <input
                        type="url"
                        placeholder="e.g. https://yourwebsite.com"
                        value={website}
                        onChange={e => setWebsite(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
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
                        padding: '0.75rem',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        width: '100%'
                    }}>
                    {saving ? 'Saving...' : 'Save Changes ✅'}
                </button>
            </div>
        </div>
    );
}

export default EditProfile;