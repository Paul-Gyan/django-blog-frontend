import { Link, useNavigate } from 'react-router-dom';

function Navbar({ token, setToken, username }) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/');
    }

    return (
        <nav style={{
            background: '#1d4ed8',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
            <Link to="/" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.2rem'
            }}>
                📝 MyBlog
            </Link>

            <Link to="/categories" style={{
                color: 'white',
                textDecoration: 'none'
            }}>Categories</Link>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {token ? (
                    <>
                        <Link to="/create" style={{
                            background: 'white',
                            color: '#1d4ed8',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}>+ New Post</Link>

                        <Link to={`/profile/${username}`} style={{
                            color: 'white',
                            textDecoration: 'none'
                        }}>👤 {username}</Link>

                        <button onClick={handleLogout} style={{
                            background: 'transparent',
                            color: 'white',
                            border: '1px solid white',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{
                            color: 'white',
                            textDecoration: 'none'
                        }}>Login</Link>
                        <Link to="/register" style={{
                            background: 'white',
                            color: '#1d4ed8',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;