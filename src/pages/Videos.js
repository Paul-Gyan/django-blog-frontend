import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVideos, createVideo, deleteVideo, likeVideo, commentVideo, deleteVideoComment } from '../api';

function Videos({ token, username }) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    // Upload states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        fetchVideos();
    }, []);

    function fetchVideos() {
        setLoading(true);
        getVideos({ search })
            .then(res => {
                setVideos(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }

    function handleSearch(e) {
        e.preventDefault();
        fetchVideos();
    }

    function handleUpload() {
        if (!title || !videoFile) {
            setError('Title and video file are required!');
            return;
        }
        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description || '');
        formData.append('video_file', videoFile, videoFile.name);
        if (thumbnail) formData.append('thumbnail', thumbnail, thumbnail.name);

        createVideo(formData)
            .then(() => {
                setTitle('');
                setDescription('');
                setVideoFile(null);
                setThumbnail(null);
                setThumbnailPreview(null);
                setShowUpload(false);
                setUploading(false);
                setUploadProgress(0);
                fetchVideos();
            })
            .catch(err => {
                setError('Failed to upload video!');
                console.error(err.response?.data);
                setUploading(false);
            });
    }

    function handleDelete(id) {
        deleteVideo(id)
            .then(() => {
                setVideos(prev => prev.filter(v => v.id !== id));
                if (selectedVideo?.id === id) setSelectedVideo(null);
            });
    }

    function handleLike(id) {
        if (!token) { navigate('/login'); return; }
        likeVideo(id)
            .then(res => {
                setVideos(prev => prev.map(v =>
                    v.id === id ? { ...v, total_likes: res.data.total_likes } : v
                ));
                if (selectedVideo?.id === id) {
                    setSelectedVideo(prev => ({
                        ...prev,
                        total_likes: res.data.total_likes
                    }));
                }
            });
    }

    function handleComment(videoId) {
        if (!token) { navigate('/login'); return; }
        if (!comment.trim()) return;

        commentVideo(videoId, { content: comment })
            .then(res => {
                setSelectedVideo(prev => ({
                    ...prev,
                    video_comments: [...(prev.video_comments || []), res.data],
                    total_comments: prev.total_comments + 1
                }));
                setComment('');
            })
            .catch(() => setError('Failed to post comment!'));
    }

    function handleDeleteComment(commentId, videoId) {
        deleteVideoComment(commentId)
            .then(() => {
                setSelectedVideo(prev => ({
                    ...prev,
                    video_comments: prev.video_comments.filter(c => c.id !== commentId),
                    total_comments: prev.total_comments - 1
                }));
            });
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0f0f0f' }}>

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
                padding: '2rem',
                color: 'white'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '2rem',
                            fontWeight: '800'
                        }}>🎬 Videos</h1>
                        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.85 }}>
                            Watch and share videos
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}>
                        {/* Search */}
                        <form onSubmit={handleSearch} style={{
                            display: 'flex',
                            gap: '0.5rem'
                        }}>
                            <input
                                type="text"
                                placeholder="Search videos..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '0.9rem',
                                    width: '200px'
                                }}
                            />
                            <button type="submit" style={{
                                background: 'white',
                                color: '#1d4ed8',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}>Search</button>
                        </form>

                        {token && (
                            <button
                                onClick={() => setShowUpload(true)}
                                style={{
                                    background: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}>
                                + Upload Video
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem'
            }}>
                {/* Video Grid */}
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#9ca3af'
                    }}>
                        <div style={{ fontSize: '2rem' }}>⏳</div>
                        <p>Loading videos...</p>
                    </div>
                ) : videos.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#9ca3af'
                    }}>
                        <div style={{ fontSize: '3rem' }}>🎬</div>
                        <p>No videos yet! Be the first to upload.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {videos.map(video => (
                            <div
                                key={video.id}
                                style={{
                                    background: '#1f1f1f',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    border: '1px solid #333'
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                {/* Video Thumbnail or Player */}
                                <div
                                    onClick={() => setSelectedVideo(video)}
                                    style={{
                                        position: 'relative',
                                        paddingBottom: '56.25%',
                                        background: '#000'
                                    }}>
                                    {video.thumbnail ? (
                                        <img
                                            src={`http://127.0.0.1:8000${video.thumbnail}`}
                                            alt={video.title}
                                            style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <video
                                            src={`http://127.0.0.1:8000${video.video_file}`}
                                            style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )}
                                    {/* Play Button Overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        background: 'rgba(0,0,0,0.7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem'
                                    }}>▶️</div>
                                </div>

                                {/* Video Info */}
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{
                                        color: 'white',
                                        margin: '0 0 0.5rem 0',
                                        fontSize: '1rem',
                                        fontWeight: '600'
                                    }}>{video.title}</h3>

                                    <p style={{
                                        color: '#9ca3af',
                                        fontSize: '0.85rem',
                                        margin: '0 0 0.75rem 0'
                                    }}>
                                        By {video.author_name} •{' '}
                                        {new Date(video.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            color: '#9ca3af',
                                            fontSize: '0.85rem'
                                        }}>
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLike(video.id);
                                                }}
                                                style={{ cursor: 'pointer' }}>
                                                ❤️ {video.total_likes}
                                            </span>
                                            <span>💬 {video.total_comments}</span>
                                        </div>

                                        {token && video.author_name === username && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(video.id);
                                                }}
                                                style={{
                                                    background: 'rgba(220,38,38,0.2)',
                                                    color: '#dc2626',
                                                    border: 'none',
                                                    padding: '0.3rem 0.6rem',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem'
                                                }}>🗑️</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.95)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '900px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        background: '#1f1f1f',
                        borderRadius: '16px',
                        overflow: 'hidden'
                    }}>
                        {/* Video Player */}
                        <div style={{ position: 'relative' }}>
                            <video
                                src={`http://127.0.0.1:8000${selectedVideo.video_file}`}
                                controls
                                autoPlay
                                style={{
                                    width: '100%',
                                    maxHeight: '500px',
                                    background: '#000'
                                }}
                            />
                            <button
                                onClick={() => setSelectedVideo(null)}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'rgba(0,0,0,0.7)',
                                    border: 'none',
                                    color: 'white',
                                    width: '2rem',
                                    height: '2rem',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}>✕</button>
                        </div>

                        {/* Video Details */}
                        <div style={{ padding: '1.5rem' }}>
                            <h2 style={{
                                color: 'white',
                                margin: '0 0 0.5rem 0',
                                fontSize: '1.3rem',
                                fontWeight: '700'
                            }}>{selectedVideo.title}</h2>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem'
                            }}>
                                <p style={{
                                    color: '#9ca3af',
                                    margin: 0,
                                    fontSize: '0.9rem'
                                }}>
                                    By {selectedVideo.author_name} •{' '}
                                    {new Date(selectedVideo.created_at).toLocaleDateString()}
                                </p>

                                <button
                                    onClick={() => handleLike(selectedVideo.id)}
                                    style={{
                                        background: '#dc2626',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}>
                                    ❤️ {selectedVideo.total_likes} Like
                                </button>
                            </div>

                            {selectedVideo.description && (
                                <p style={{
                                    color: '#d1d5db',
                                    lineHeight: '1.6',
                                    marginBottom: '1.5rem',
                                    background: '#111',
                                    padding: '1rem',
                                    borderRadius: '8px'
                                }}>{selectedVideo.description}</p>
                            )}

                            {/* Comments */}
                            <h3 style={{
                                color: 'white',
                                marginBottom: '1rem'
                            }}>
                                💬 Comments ({selectedVideo.total_comments})
                            </h3>

                            {error && (
                                <p style={{ color: '#dc2626' }}>{error}</p>
                            )}

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
                                            background: '#111',
                                            border: '1px solid #333',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '0.9rem',
                                            boxSizing: 'border-box',
                                            marginBottom: '0.5rem',
                                            resize: 'none',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                    <button
                                        onClick={() => handleComment(selectedVideo.id)}
                                        style={{
                                            background: '#1d4ed8',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1.5rem',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}>Post Comment</button>
                                </div>
                            ) : (
                                <p style={{
                                    color: '#9ca3af',
                                    marginBottom: '1rem'
                                }}>
                                    <span
                                        onClick={() => navigate('/login')}
                                        style={{
                                            color: '#1d4ed8',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}>Login</span> to comment
                                </p>
                            )}

                            {/* Comments List */}
                            {selectedVideo.video_comments && selectedVideo.video_comments.length === 0 ? (
                                <p style={{
                                    color: '#6b7280',
                                    textAlign: 'center',
                                    padding: '1rem'
                                }}>No comments yet!</p>
                            ) : (
                                selectedVideo.video_comments && selectedVideo.video_comments.map(c => (
                                    <div key={c.id} style={{
                                        borderBottom: '1px solid #333',
                                        padding: '0.75rem 0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start'
                                    }}>
                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                marginBottom: '0.3rem'
                                            }}>
                                                <div style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '50%',
                                                    background: '#1d4ed8',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: '700',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {c.author_name?.charAt(0).toUpperCase()}
                                                </div>
                                                <strong style={{ color: 'white', fontSize: '0.9rem' }}>
                                                    {c.author_name}
                                                </strong>
                                                <span style={{
                                                    color: '#6b7280',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {new Date(c.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p style={{
                                                color: '#d1d5db',
                                                margin: '0 0 0 2rem',
                                                fontSize: '0.9rem'
                                            }}>{c.content}</p>
                                        </div>

                                        {token && c.author_name === username && (
                                            <button
                                                onClick={() => handleDeleteComment(c.id, selectedVideo.id)}
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

            {/* Upload Modal */}
            {showUpload && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.85)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div style={{
                        background: '#1f1f1f',
                        borderRadius: '16px',
                        padding: '2rem',
                        width: '100%',
                        maxWidth: '500px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        border: '1px solid #333'
                    }}>
                        <h2 style={{
                            color: 'white',
                            marginTop: 0,
                            fontWeight: '700'
                        }}>Upload Video 🎬</h2>

                        {error && (
                            <p style={{
                                color: '#dc2626',
                                background: '#fef2f2',
                                padding: '0.5rem',
                                borderRadius: '6px'
                            }}>{error}</p>
                        )}

                        {/* Title */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#d1d5db',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}>Title *</label>
                            <input
                                type="text"
                                placeholder="Enter video title..."
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: '#111',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: 'white',
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
                                color: '#d1d5db',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}>Description</label>
                            <textarea
                                placeholder="Describe your video..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: '#111',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box',
                                    resize: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        {/* Video File */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#d1d5db',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}>Video File * (max 100MB)</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    if (file && file.size > 104857600) {
                                        alert('Video too large! Max 100MB');
                                        return;
                                    }
                                    setVideoFile(file);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: '#d1d5db',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {videoFile && (
                                <p style={{
                                    color: '#16a34a',
                                    fontSize: '0.85rem',
                                    marginTop: '0.5rem'
                                }}>
                                    ✅ {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)}MB)
                                </p>
                            )}
                        </div>

                        {/* Thumbnail */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#d1d5db',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}>Thumbnail (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    setThumbnail(file);
                                    if (file) setThumbnailPreview(URL.createObjectURL(file));
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: '#d1d5db',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {thumbnailPreview && (
                                <img
                                    src={thumbnailPreview}
                                    alt="thumbnail"
                                    style={{
                                        width: '100%',
                                        height: '120px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        marginTop: '0.5rem'
                                    }}
                                />
                            )}
                        </div>

                        {/* Upload Progress */}
                        {uploading && (
                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
                                    Uploading...
                                </p>
                                <div style={{
                                    background: '#333',
                                    borderRadius: '8px',
                                    height: '8px'
                                }}>
                                    <div style={{
                                        background: '#1d4ed8',
                                        height: '100%',
                                        borderRadius: '8px',
                                        width: `${uploadProgress}%`,
                                        transition: 'width 0.3s'
                                    }} />
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => {
                                    setShowUpload(false);
                                    setTitle('');
                                    setDescription('');
                                    setVideoFile(null);
                                    setThumbnail(null);
                                    setThumbnailPreview(null);
                                    setError('');
                                }}
                                style={{
                                    flex: 1,
                                    background: '#333',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}>Cancel</button>
                            <button
                                onClick={handleUpload}
                                disabled={uploading || !title || !videoFile}
                                style={{
                                    flex: 1,
                                    background: uploading || !title || !videoFile
                                        ? '#555'
                                        : '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    cursor: uploading || !title || !videoFile
                                        ? 'not-allowed' : 'pointer',
                                    fontWeight: '600'
                                }}>
                                {uploading ? 'Uploading...' : 'Upload Video 🎬'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Videos;