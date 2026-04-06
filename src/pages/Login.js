import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';

function Login({ setToken, setUsername }) {
    const [username, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleLogin() {
        setError('');
        login({ username, password })
            .then(res => {
                localStorage.setItem('token', res.data.access);
                setToken(res.data.access);
                setUsername(username);
                navigate('/');
            })
            .catch(() => setError('Invalid username or password!'));
    }

    return (
        <div style={{
            maxWidth: '400px',
            margin: '3rem auto',
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <h1 style={{ color: '#1d4ed8', marginTop: 0 }}>Welcome Back 👋</h1>

            {error && <p style={{ color: '#dc2626' }}>{error}</p>}

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsernameInput(e.target.value)}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginBottom: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginBottom: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                }}
            />
            <button onClick={handleLogin} style={{
                background: '#1d4ed8',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
                width: '100%'
            }}>Login</button>

            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                No account? <Link to="/register" style={{ color: '#1d4ed8' }}>Register</Link>
            </p>
        </div>
    );
}

export default Login;