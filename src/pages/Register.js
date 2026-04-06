import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register({ setToken, setUsername }) {
    const [username, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleRegister() {
        setError('');

        if (password !== password2) {
            setError('Passwords do not match!');
            return;
        }

        axios.post('http://127.0.0.1:8000/register/', {
            username,
            password1: password,
            password2
        })
            .then(() => {
                // After registering login automatically
                axios.post('http://127.0.0.1:8000/api/token/', {
                    username,
                    password
                })
                    .then(res => {
                        localStorage.setItem('token', res.data.access);
                        localStorage.setItem('username', username);
                        setToken(res.data.access);
                        setUsername(username);
                        navigate('/');
                    });
            })
            .catch(() => setError('Registration failed. Username may already exist!'));
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
            <h1 style={{ color: '#1d4ed8', marginTop: 0 }}>
                Create Account 📝
            </h1>

            {error && (
                <p style={{
                    color: '#dc2626', background: '#fef2f2',
                    padding: '0.5rem', borderRadius: '6px'
                }}>
                    {error}
                </p>
            )}

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
            <input
                type="password"
                placeholder="Confirm Password"
                value={password2}
                onChange={e => setPassword2(e.target.value)}
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
            <button onClick={handleRegister} style={{
                background: '#1d4ed8',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
                width: '100%'
            }}>Create Account</button>

            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#1d4ed8' }}>Login</Link>
            </p>
        </div>
    );
}

export default Register;