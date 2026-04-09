import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar({ token, setToken, username }) {
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        navigate('/');
    }

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            height: '64px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {/* Logo */}
            <Link to="/" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '800',
                fontSize: '1.4rem',
                letterSpacing: '-0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                📝 <span>MyBlog</span>
            </Link>

            {/* Nav Links */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginLeft: '2rem'
            }}>
                <Link to="/" style={{
                    color: isActive('/') ? 'white' : 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontWeight: isActive('/') ? '600' : '400',
                    background: isActive('/') ? 'rgba(255,255,255,0.15)' : 'transparent',
                    transition: 'all 0.2s'
                }}>Home</Link>

                <Link to="/categories" style={{
                    color: isActive('/categories') ? 'white' : 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontWeight: isActive('/categories') ? '600' : '400',
                    background: isActive('/categories') ? 'rgba(255,255,255,0.15)' : 'transparent',
                    transition: 'all 0.2s'
                }}>Categories</Link>

                <Link to="/videos" style={{
                    color: isActive('/vide') ? 'white' : 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontWeight: isActive('/videos') ? '600' : '400',
                    background: isActive('/videos') ? 'rgba(255,255,255,0.15)' : 'transparent',
                }}>Videos</Link>

                <Link to="/reports" style={{
                    color: isActive('/reports') ? 'white' : 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontWeight: isActive('/reports') ? '600' : '400',
                    background: isActive('/reports') ? 'rgba(255,255,255,0.15)' : 'transparent',
                }}>📡 Reports</Link>
                <Link to="/music" style={{
                    color: isActive('/music') ? 'white' : 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontWeight: isActive('/music') ? '600' : '400',
                    background: isActive('/music') ? 'rgba(255,255,255,0.15)' : 'transparent',
                }}>🎵 Music</Link>
            </div>

            {/* Right Side */}
            <div style={{
                marginLeft: 'auto',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center'
            }}>
                {token ? (
                    <>
                        <Link to="/create" style={{
                            background: 'white',
                            color: '#1d4ed8',
                            padding: '0.4rem 1rem',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}>+ New Post</Link>

                        <Link to={`/profile/${username}`} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            color: 'white',
                            textDecoration: 'none',
                            background: 'rgba(255,255,255,0.15)',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '6px',
                            fontSize: '0.9rem'
                        }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: 'white',
                                color: '#1d4ed8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '0.75rem'
                            }}>
                                {username?.charAt(0).toUpperCase()}
                            </div>
                            {username}
                        </Link>

                        <button onClick={handleLogout} style={{
                            background: 'transparent',
                            color: 'rgba(255,255,255,0.8)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{
                            color: 'rgba(255,255,255,0.8)',
                            textDecoration: 'none',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '6px',
                            fontSize: '0.9rem'
                        }}>Login</Link>

                        <Link to="/register" style={{
                            background: 'white',
                            color: '#1d4ed8',
                            padding: '0.4rem 1rem',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;