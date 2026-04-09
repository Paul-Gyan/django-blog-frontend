import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReports, createReport, deleteReport, likeReport, commentReport, deleteReportComment } from '../api';

const CATEGORIES = [
    { value: '', label: '📋 All' },
    { value: 'crime', label: '🚨 Crime' },
    { value: 'weather', label: '⛈️ Weather' },
    { value: 'traffic', label: '🚗 Traffic' },
    { value: 'community', label: '👥 Community' },
    { value: 'fire', label: '🔥 Fire' },
    { value: 'medical', label: '🏥 Medical' },
    { value: 'politics', label: '🏛️ Politics' },
    { value: 'other', label: '📌 Other' },
];

const URGENCY_LEVELS = [
    { value: 'breaking', label: '🔴 Breaking', color: '#dc2626', bg: '#fef2f2' },
    { value: 'normal', label: '🟡 Normal', color: '#ca8a04', bg: '#fefce8' },
    { value: 'update', label: '🔵 Update', color: '#1d4ed8', bg: '#dbeafe' },
];

function Reports({ token, username }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [urgency, setUrgency] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    // Create form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [reportCategory, setReportCategory] = useState('other');
    const [reportUrgency, setReportUrgency] = useState('normal');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [locating, setLocating] = useState(false);
    const [coords, setCoords] = useState({ lat: null, lng: null });

    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, [category, urgency]);

    function fetchReports() {
        setLoading(true);
        getReports({ category, urgency, search })
            .then(res => {
                setReports(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }

    function handleSearch(e) {
        e.preventDefault();
        fetchReports();
    }

    function getLocation() {
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            pos => {
                setCoords({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
                setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
                setLocating(false);
            },
            err => {
                alert('Could not get location. Please enter manually.');
                setLocating(false);
            }
        );
    }

    function handleSubmit() {
        if (!title || !description) {
            setError('Title and description are required!');
            return;
        }
        setSubmitting(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('location', location || '');
        formData.append('category', reportCategory);
        formData.append('urgency', reportUrgency);
        if (coords.lat) formData.append('latitude', coords.lat);
        if (coords.lng) formData.append('longitude', coords.lng);
        if (image) formData.append('image', image, image.name);
        if (video) formData.append('video', video, video.name);

        createReport(formData)
            .then(() => {
                setTitle('');
                setDescription('');
                setLocation('');
                setReportCategory('other');
                setReportUrgency('normal');
                setImage(null);
                setVideo(null);
                setImagePreview(null);
                setVideoPreview(null);
                setCoords({ lat: null, lng: null });
                setShowCreate(false);
                setSubmitting(false);
                fetchReports();
            })
            .catch(err => {
                setError('Failed to submit report!');
                console.error(err.response?.data);
                setSubmitting(false);
            });
    }

    function handleLike(id) {
        if (!token) { navigate('/login'); return; }
        likeReport(id)
            .then(res => {
                setReports(prev => prev.map(r =>
                    r.id === id ? { ...r, total_likes: res.data.total_likes } : r
                ));
                if (selectedReport?.id === id) {
                    setSelectedReport(prev => ({
                        ...prev,
                        total_likes: res.data.total_likes
                    }));
                }
            });
    }

    function handleComment(reportId) {
        if (!token) { navigate('/login'); return; }
        if (!comment.trim()) return;
        commentReport(reportId, { content: comment })
            .then(res => {
                setSelectedReport(prev => ({
                    ...prev,
                    report_comments: [...(prev.report_comments || []), res.data],
                    total_comments: prev.total_comments + 1
                }));
                setComment('');
            })
            .catch(() => setError('Failed to post comment!'));
    }

    function handleDeleteComment(commentId) {
        deleteReportComment(commentId)
            .then(() => {
                setSelectedReport(prev => ({
                    ...prev,
                    report_comments: prev.report_comments.filter(c => c.id !== commentId),
                    total_comments: prev.total_comments - 1
                }));
            });
    }

    function handleDelete(id) {
        deleteReport(id)
            .then(() => {
                setReports(prev => prev.filter(r => r.id !== id));
                if (selectedReport?.id === id) setSelectedReport(null);
            });
    }

    function getUrgencyStyle(urgency) {
        const found = URGENCY_LEVELS.find(u => u.value === urgency);
        return found || URGENCY_LEVELS[1];
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #dc2626 100%)',
                padding: '2rem',
                color: 'white'
            }}>
                <div style={{
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div>
                            <h1 style={{
                                margin: 0,
                                fontSize: '2rem',
                                fontWeight: '800'
                            }}>📡 Reports & News</h1>
                            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.85 }}>
                                Stay informed with live community reports
                            </p>
                        </div>

                        {token && (
                            <button
                                onClick={() => setShowCreate(true)}
                                style={{
                                    background: 'white',
                                    color: '#dc2626',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '0.95rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                }}>
                                📢 Submit Report
                            </button>
                        )}
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '1rem',
                                maxWidth: '400px'
                            }}
                        />
                        <button type="submit" style={{
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.4)',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}>Search</button>
                    </form>

                    {/* Urgency Filter */}
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => setUrgency('')}
                            style={{
                                background: urgency === '' ? 'white' : 'rgba(255,255,255,0.2)',
                                color: urgency === '' ? '#7c3aed' : 'white',
                                border: 'none',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem'
                            }}>All</button>
                        {URGENCY_LEVELS.map(u => (
                            <button
                                key={u.value}
                                onClick={() => setUrgency(u.value)}
                                style={{
                                    background: urgency === u.value ? 'white' : 'rgba(255,255,255,0.2)',
                                    color: urgency === u.value ? u.color : 'white',
                                    border: 'none',
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.85rem'
                                }}>{u.label}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '2rem'
            }}>
                {/* Category Filter */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    marginBottom: '2rem'
                }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.value}
                            onClick={() => setCategory(cat.value)}
                            style={{
                                background: category === cat.value ? '#7c3aed' : 'white',
                                color: category === cat.value ? 'white' : '#374151',
                                border: '1px solid #e5e7eb',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}>{cat.label}</button>
                    ))}
                </div>

                {/* Reports List */}
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#6b7280'
                    }}>
                        <div style={{ fontSize: '2rem' }}>⏳</div>
                        <p>Loading reports...</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#6b7280',
                        background: 'white',
                        borderRadius: '12px'
                    }}>
                        <div style={{ fontSize: '3rem' }}>📭</div>
                        <p>No reports yet! Be the first to report.</p>
                    </div>
                ) : (
                    reports.map(report => {
                        const urgencyStyle = getUrgencyStyle(report.urgency);
                        return (
                            <div
                                key={report.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    marginBottom: '1.5rem',
                                    overflow: 'hidden',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                    border: `2px solid ${urgencyStyle.bg}`,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onClick={() => setSelectedReport(report)}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                                }}>

                                {/* Report Image */}
                                {report.image && (
                                    <img
                                        src={`http://127.0.0.1:8000${report.image}`}
                                        alt={report.title}
                                        style={{
                                            width: '100%',
                                            height: '250px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )}

                                <div style={{ padding: '1.5rem' }}>
                                    {/* Badges */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        marginBottom: '0.75rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        <span style={{
                                            background: urgencyStyle.bg,
                                            color: urgencyStyle.color,
                                            padding: '0.2rem 0.8rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '700'
                                        }}>{urgencyStyle.label}</span>

                                        <span style={{
                                            background: '#f3f4f6',
                                            color: '#374151',
                                            padding: '0.2rem 0.8rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '500'
                                        }}>{report.category_display}</span>

                                        {report.is_verified && (
                                            <span style={{
                                                background: '#dcfce7',
                                                color: '#16a34a',
                                                padding: '0.2rem 0.8rem',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: '700'
                                            }}>✅ Verified</span>
                                        )}
                                    </div>

                                    <h2 style={{
                                        color: '#111827',
                                        margin: '0 0 0.5rem 0',
                                        fontSize: '1.2rem',
                                        fontWeight: '700'
                                    }}>{report.title}</h2>

                                    <p style={{
                                        color: '#6b7280',
                                        fontSize: '0.85rem',
                                        marginBottom: '0.75rem'
                                    }}>
                                        By <strong>{report.author_name}</strong> •{' '}
                                        {new Date(report.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>

                                    {report.location && (
                                        <p style={{
                                            color: '#6b7280',
                                            fontSize: '0.85rem',
                                            marginBottom: '0.75rem'
                                        }}>
                                            📍 {report.location}
                                        </p>
                                    )}

                                    <p style={{
                                        color: '#4b5563',
                                        lineHeight: '1.6',
                                        marginBottom: '1rem'
                                    }}>
                                        {report.description.substring(0, 200)}
                                        {report.description.length > 200 ? '...' : ''}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            color: '#6b7280',
                                            fontSize: '0.9rem'
                                        }}>
                                            <span
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleLike(report.id);
                                                }}
                                                style={{ cursor: 'pointer' }}>
                                                ❤️ {report.total_likes}
                                            </span>
                                            <span>💬 {report.total_comments}</span>
                                            <span>👁️ {report.views}</span>
                                        </div>

                                        {token && report.author_name === username && (
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleDelete(report.id);
                                                }}
                                                style={{
                                                    background: '#fee2e2',
                                                    color: '#dc2626',
                                                    border: 'none',
                                                    padding: '0.3rem 0.6rem',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem'
                                                }}>🗑️ Delete</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Report Detail Modal */}
            {selectedReport && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '700px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        {/* Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #7c3aed 0%, #dc2626 100%)',
                            padding: '1.5rem',
                            color: 'white',
                            borderRadius: '16px 16px 0 0',
                            position: 'relative'
                        }}>
                            <button
                                onClick={() => setSelectedReport(null)}
                                style={{
                                    position: 'absolute',
                                    top: '1rem', right: '1rem',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    width: '2rem', height: '2rem',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}>✕</button>

                            <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                marginBottom: '0.75rem'
                            }}>
                                <span style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '0.2rem 0.8rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: '700'
                                }}>{getUrgencyStyle(selectedReport.urgency).label}</span>
                                <span style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '0.2rem 0.8rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem'
                                }}>{selectedReport.category_display}</span>
                                {selectedReport.is_verified && (
                                    <span style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        padding: '0.2rem 0.8rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '700'
                                    }}>✅ Verified</span>
                                )}
                            </div>

                            <h2 style={{
                                margin: '0 0 0.5rem 0',
                                fontSize: '1.3rem',
                                fontWeight: '800'
                            }}>{selectedReport.title}</h2>

                            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.85rem' }}>
                                By {selectedReport.author_name} •{' '}
                                {new Date(selectedReport.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            {/* Image */}
                            {selectedReport.image && (
                                <img
                                    src={`http://127.0.0.1:8000${selectedReport.image}`}
                                    alt={selectedReport.title}
                                    style={{
                                        width: '100%',
                                        borderRadius: '8px',
                                        marginBottom: '1rem',
                                        maxHeight: '350px',
                                        objectFit: 'cover'
                                    }}
                                />
                            )}

                            {/* Video */}
                            {selectedReport.video && (
                                <video
                                    src={`http://127.0.0.1:8000${selectedReport.video}`}
                                    controls
                                    style={{
                                        width: '100%',
                                        borderRadius: '8px',
                                        marginBottom: '1rem',
                                        maxHeight: '350px'
                                    }}
                                />
                            )}

                            {/* Location */}
                            {selectedReport.location && (
                                <div style={{
                                    background: '#f8fafc',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    marginBottom: '1rem',
                                    fontSize: '0.9rem',
                                    color: '#374151'
                                }}>
                                    📍 {selectedReport.location}
                                </div>
                            )}

                            {/* Description */}
                            <p style={{
                                color: '#374151',
                                lineHeight: '1.8',
                                marginBottom: '1.5rem',
                                fontSize: '1rem'
                            }}>{selectedReport.description}</p>

                            {/* Stats */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                background: '#f8fafc',
                                borderRadius: '8px'
                            }}>
                                <button
                                    onClick={() => handleLike(selectedReport.id)}
                                    style={{
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}>
                                    ❤️ {selectedReport.total_likes} Like
                                </button>
                                <span style={{
                                    color: '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '0.9rem'
                                }}>
                                    💬 {selectedReport.total_comments} Comments
                                </span>
                                <span style={{
                                    color: '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '0.9rem'
                                }}>
                                    👁️ {selectedReport.views} Views
                                </span>
                            </div>

                            {/* Comments */}
                            <h3 style={{
                                color: '#111827',
                                marginBottom: '1rem'
                            }}>💬 Comments</h3>

                            {token ? (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <textarea
                                        placeholder="Add a comment..."
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            boxSizing: 'border-box',
                                            marginBottom: '0.5rem',
                                            resize: 'none',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                    <button
                                        onClick={() => handleComment(selectedReport.id)}
                                        style={{
                                            background: '#7c3aed',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1.5rem',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}>Post Comment</button>
                                </div>
                            ) : (
                                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                                    <span
                                        onClick={() => navigate('/login')}
                                        style={{ color: '#7c3aed', cursor: 'pointer', fontWeight: '600' }}>
                                        Login
                                    </span> to comment
                                </p>
                            )}

                            {selectedReport.report_comments && selectedReport.report_comments.length === 0 ? (
                                <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>
                                    No comments yet!
                                </p>
                            ) : (
                                selectedReport.report_comments && selectedReport.report_comments.map(c => (
                                    <div key={c.id} style={{
                                        borderBottom: '1px solid #f3f4f6',
                                        padding: '0.75rem 0',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                marginBottom: '0.3rem'
                                            }}>
                                                <div style={{
                                                    width: '28px', height: '28px',
                                                    borderRadius: '50%',
                                                    background: '#7c3aed',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: '700',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {c.author_name?.charAt(0).toUpperCase()}
                                                </div>
                                                <strong style={{ color: '#111827', fontSize: '0.9rem' }}>
                                                    {c.author_name}
                                                </strong>
                                                <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                                                    {new Date(c.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p style={{
                                                margin: '0 0 0 2rem',
                                                color: '#4b5563',
                                                fontSize: '0.9rem'
                                            }}>{c.content}</p>
                                        </div>
                                        {token && c.author_name === username && (
                                            <button
                                                onClick={() => handleDeleteComment(c.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#dc2626',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem'
                                                }}>🗑️</button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Report Modal */}
            {showCreate && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        width: '100%',
                        maxWidth: '550px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{
                            color: '#111827',
                            marginTop: 0,
                            fontWeight: '700'
                        }}>📢 Submit Report</h2>

                        {error && (
                            <p style={{
                                color: '#dc2626',
                                background: '#fef2f2',
                                padding: '0.75rem',
                                borderRadius: '8px'
                            }}>{error}</p>
                        )}

                        {/* Urgency */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#374151',
                                fontSize: '0.9rem'
                            }}>Urgency Level</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {URGENCY_LEVELS.map(u => (
                                    <button
                                        key={u.value}
                                        onClick={() => setReportUrgency(u.value)}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: reportUrgency === u.value ? u.bg : '#f3f4f6',
                                            color: reportUrgency === u.value ? u.color : '#374151',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            fontSize: '0.85rem',
                                            outline: reportUrgency === u.value ? `2px solid ${u.color}` : 'none'
                                        }}>{u.label}</button>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#374151',
                                fontSize: '0.9rem'
                            }}>Category</label>
                            <select
                                value={reportCategory}
                                onChange={e => setReportCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}>
                                {CATEGORIES.filter(c => c.value !== '').map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Title */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#374151',
                                fontSize: '0.9rem'
                            }}>Title *</label>
                            <input
                                type="text"
                                placeholder="Brief title of the report..."
                                value={title}
                                onChange={e => setTitle(e.target.value)}
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

                        {/* Description */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#374151',
                                fontSize: '0.9rem'
                            }}>Description *</label>
                            <textarea
                                placeholder="Describe what is happening..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        {/* Location */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#374151',
                                fontSize: '0.9rem'
                            }}>Location</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Enter location..."
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <button
                                    onClick={getLocation}
                                    disabled={locating}
                                    style={{
                                        background: '#7c3aed',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        whiteSpace: 'nowrap',
                                        fontSize: '0.85rem'
                                    }}>
                                    {locating ? '...' : '📍 Get GPS'}
                                </button>
                            </div>
                        </div>

                        {/* Image */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#374151',
                                fontSize: '0.9rem'
                            }}>📷 Photo (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setImage(file);
                                    setImagePreview(URL.createObjectURL(file));
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="preview"
                                    style={{
                                        width: '100%',
                                        height: '150px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        marginTop: '0.5rem'
                                    }}
                                />
                            )}
                        </div>

                        {/* Video */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#374151',
                                fontSize: '0.9rem'
                            }}>🎥 Video (optional, max 100MB)</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    if (file.size > 104857600) {
                                        alert('Video too large! Max 100MB');
                                        return;
                                    }
                                    setVideo(file);
                                    setVideoPreview(URL.createObjectURL(file));
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {videoPreview && (
                                <video
                                    src={videoPreview}
                                    controls
                                    style={{
                                        width: '100%',
                                        borderRadius: '8px',
                                        marginTop: '0.5rem',
                                        maxHeight: '150px'
                                    }}
                                />
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => {
                                    setShowCreate(false);
                                    setTitle('');
                                    setDescription('');
                                    setLocation('');
                                    setImage(null);
                                    setVideo(null);
                                    setImagePreview(null);
                                    setVideoPreview(null);
                                    setError('');
                                }}
                                style={{
                                    flex: 1,
                                    background: '#f3f4f6',
                                    color: '#374151',
                                    border: 'none',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}>Cancel</button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !title || !description}
                                style={{
                                    flex: 1,
                                    background: submitting || !title || !description
                                        ? '#c4b5fd'
                                        : 'linear-gradient(135deg, #7c3aed 0%, #dc2626 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    cursor: submitting || !title || !description
                                        ? 'not-allowed' : 'pointer',
                                    fontWeight: '600'
                                }}>
                                {submitting ? 'Submitting...' : '📢 Submit Report'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reports;