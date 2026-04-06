import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register({ setToken, setUsername }) {
    const [username, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleRegister() {
        setError('');
        if (!username || !password || !password2) {
            setError('Please fill in all fields!');
            return;
        }
        if (password !== password2) {
            setError('Passwords do not match!');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters!');
            return;
        }
        setLoading(true);
        axios.post('http://127.0.0.1:8000/register/', {
            username,
            password1: password,
            password2
        })
            .then(() => {
                axios.post('http://127.0.0.1:8000/api/token/', { username, password })
                    .then(res => {
                        localStorage.setItem('token', res.data.access);
                        localStorage.setItem('username', username);
                        setToken(res.data.access);
                        setUsername(username);
                        navigate('/');
                    });
            })
            .catch(() => {
                setError('Registration failed. Username may already exist!');
                setLoading(false);
            });
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚀</div>
                    <h1 style={{
                        color: '#111827',
                        margin: 0,
                        fontSize: '1.75rem',
                        fontWeight: '800'
                    }}>Create Account</h1>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                        Join our blogging community
                    </p>
                </div>

                {error && (
                    <div style={{
                        color: '#dc2626',
                        background: '#fef2f2',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        border: '1px solid #fca5a5'
                    }}>{error}</div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.4rem',
                        color: '#374151',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                    }}>Username</label>
                    <input
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={e => setUsernameInput(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.4rem',
                        color: '#374151',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                    }}>Password</label>
                    <input
                        type="password"
                        placeholder="Min 8 characters"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.4rem',
                        color: '#374151',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                    }}>Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Repeat your password"
                        value={password2}
                        onChange={e => setPassword2(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    style={{
                        background: loading
                            ? '#93c5fd'
                            : 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '0.85rem',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        width: '100%',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(29,78,216,0.3)'
                    }}>
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>

                <p style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: '#6b7280',
                    fontSize: '0.9rem'
                }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{
                        color: '#1d4ed8',
                        fontWeight: '600',
                        textDecoration: 'none'
                    }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;