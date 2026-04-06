import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';

function Login({ setToken, setUsername }) {
    const [username, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleLogin() {
        if (!username || !password) {
            setError('Please fill in all fields!');
            return;
        }
        setLoading(true);
        setError('');
        login({ username, password })
            .then(res => {
                localStorage.setItem('token', res.data.access);
                localStorage.setItem('username', username);
                setToken(res.data.access);
                setUsername(username);
                navigate('/');
            })
            .catch(() => {
                setError('Invalid username or password!');
                setLoading(false);
            });
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') handleLogin();
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
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👋</div>
                    <h1 style={{
                        color: '#111827',
                        margin: 0,
                        fontSize: '1.75rem',
                        fontWeight: '800'
                    }}>Welcome Back</h1>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                        Sign in to your account
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
                        placeholder="Enter your username"
                        value={username}
                        onChange={e => setUsernameInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            outline: 'none'
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
                    }}>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            outline: 'none'
                        }}
                    />
                </div>

                <button
                    onClick={handleLogin}
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
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <p style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: '#6b7280',
                    fontSize: '0.9rem'
                }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{
                        color: '#1d4ed8',
                        fontWeight: '600',
                        textDecoration: 'none'
                    }}>Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login; 