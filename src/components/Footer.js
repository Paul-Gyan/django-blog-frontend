import { Link } from 'react-router-dom';
import { theme } from '../styles/theme';

function Footer() {
    return (
        <footer style={{
            background: theme.colors.dark,
            color: 'white',
            padding: '1.5rem 2rem 1rem',
            marginTop: '2rem'
        }}>
            <div style={{
                maxWidth: '1100px',
                margin: '0 auto'
            }}>
                {/* Top Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem'
                }}>
                    {/* Brand */}
                    <div>
                        <h3 style={{
                            background: theme.gradients.primary,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: '1.2rem',
                            fontWeight: '900',
                            marginBottom: '0.5rem',
                            marginTop: 0
                        }}>✨ MyBlog</h3>
                        <p style={{
                            color: theme.colors.gray,
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            margin: 0
                        }}>
                            A vibrant community platform for
                            sharing stories, videos, music and news.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            color: 'white',
                            fontWeight: '700',
                            marginBottom: '0.5rem',
                            marginTop: 0,
                            fontSize: '0.85rem'
                        }}>Quick Links</h4>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.3rem'
                        }}>
                            {[
                                { path: '/', label: 'Home' },
                                { path: '/videos', label: 'Videos' },
                                { path: '/music', label: 'Music' },
                                { path: '/reports', label: 'Reports' },
                            ].map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    style={{
                                        color: theme.colors.gray,
                                        fontSize: '0.82rem',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={e => e.target.style.color = 'white'}
                                    onMouseLeave={e => e.target.style.color = theme.colors.gray}
                                >{link.label}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 style={{
                            color: 'white',
                            fontWeight: '700',
                            marginBottom: '0.5rem',
                            marginTop: 0,
                            fontSize: '0.85rem'
                        }}>Features</h4>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.3rem'
                        }}>
                            {[
                                '📝 Blog Posts',
                                '📸 Stories',
                                '🎬 Videos',
                                '🎵 Music',
                                '📡 Reports',
                            ].map(feature => (
                                <span
                                    key={feature}
                                    style={{
                                        color: theme.colors.gray,
                                        fontSize: '0.82rem'
                                    }}>{feature}</span>
                            ))}
                        </div>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 style={{
                            color: 'white',
                            fontWeight: '700',
                            marginBottom: '0.5rem',
                            marginTop: 0,
                            fontSize: '0.85rem'
                        }}>Connect</h4>
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem'
                        }}>
                            {['🐦', '📘', '📸', '💼'].map((icon, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.5)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                >{icon}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: 'rgba(255,255,255,0.1)',
                    marginBottom: '1rem'
                }} />

                {/* Bottom */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                }}>
                    <p style={{
                        color: theme.colors.gray,
                        fontSize: '0.8rem',
                        margin: 0
                    }}>
                        © 2026 MyBlog. Built with ❤️ using Django & React.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '1rem'
                    }}>
                        {['Privacy Policy', 'Terms of Service', 'Contact'].map(item => (
                            <span
                                key={item}
                                style={{
                                    color: theme.colors.gray,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={e => e.target.style.color = 'white'}
                                onMouseLeave={e => e.target.style.color = theme.colors.gray}
                            >{item}</span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;