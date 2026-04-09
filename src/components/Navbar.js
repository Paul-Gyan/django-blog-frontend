import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../styles/theme';

function Navbar({ token, setToken, username }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('refresh_token');
        setToken(null);
        navigate('/');
    }

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: '🏠 Home' },
        { path: '/categories', label: '📂 Categories' },
        { path: '/videos', label: '🎬 Videos' },
        { path: '/music', label: '🎵 Music' },
        { path: '/reports', label: '📡 Reports' },
    ];

    return (
        <>
            <nav style={{
                background: theme.gradients.primary,
                padding: '0 2rem',
                height: '65px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: theme.shadows.colored,
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                {/* Logo */}
                <Link to="/" style={{
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '1.5rem',
                    letterSpacing: '-1px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    ✨ <span>MyBlog</span>
                </Link>

                {/* Desktop Nav Links */}
                <div style={{
                    display: 'flex',
                    gap: '0.25rem',
                    alignItems: 'center'
                }}
                    className="desktop-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                color: isActive(link.path)
                                    ? 'white'
                                    : 'rgba(255,255,255,0.75)',
                                padding: '0.4rem 0.8rem',
                                borderRadius: theme.borderRadius.sm,
                                fontWeight: isActive(link.path) ? '600' : '400',
                                fontSize: '0.9rem',
                                background: isActive(link.path)
                                    ? 'rgba(255,255,255,0.2)'
                                    : 'transparent',
                                transition: 'all 0.2s'
                            }}>
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Side */}
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center'
                }}>
                    {token ? (
                        <>
                            <Link to="/create" style={{
                                background: 'white',
                                color: theme.colors.primary,
                                padding: '0.4rem 1rem',
                                borderRadius: theme.borderRadius.full,
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                boxShadow: theme.shadows.sm
                            }}>+ New Post</Link>

                            <Link
                                to={`/profile/${username}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    color: 'white',
                                    background: 'rgba(255,255,255,0.15)',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: theme.borderRadius.full,
                                    fontSize: '0.85rem'
                                }}>
                                <div style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    background: theme.colors.accent,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '800',
                                    fontSize: '0.75rem',
                                    color: 'white'
                                }}>
                                    {username?.charAt(0).toUpperCase()}
                                </div>
                                <span>{username}</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: theme.borderRadius.full,
                                    fontSize: '0.85rem',
                                    fontWeight: '500'
                                }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{
                                color: 'rgba(255,255,255,0.85)',
                                fontSize: '0.9rem',
                                padding: '0.4rem 0.8rem'
                            }}>Login</Link>

                            <Link to="/register" style={{
                                background: 'white',
                                color: theme.colors.primary,
                                padding: '0.4rem 1.2rem',
                                borderRadius: theme.borderRadius.full,
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                boxShadow: theme.shadows.sm
                            }}>Register</Link>
                        </>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            border: 'none',
                            color: 'white',
                            padding: '0.4rem 0.6rem',
                            borderRadius: theme.borderRadius.sm,
                            fontSize: '1.2rem',
                            display: 'none'
                        }}
                        className="mobile-menu-btn">
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{
                    background: theme.gradients.primary,
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    boxShadow: theme.shadows.lg
                }}>
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                color: 'white',
                                padding: '0.75rem 1rem',
                                borderRadius: theme.borderRadius.sm,
                                background: isActive(link.path)
                                    ? 'rgba(255,255,255,0.2)'
                                    : 'transparent',
                                fontWeight: isActive(link.path) ? '600' : '400'
                            }}>
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}

            {/* Mobile CSS */}
            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .mobile-menu-btn { display: block !important; }
                }
            `}</style>
        </>
    );
}

export default Navbar;