import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAudios, createAudio, deleteAudio, likeAudio, commentAudio, deleteAudioComment } from '../api';

const CATEGORIES = [
    { value: '', label: '🎵 All' },
    { value: 'music', label: '🎵 Music' },
    { value: 'podcast', label: '🎙️ Podcast' },
    { value: 'voice', label: '🎤 Voice Note' },
    { value: 'sermon', label: '⛪ Sermon' },
    { value: 'audiobook', label: '📚 Audiobook' },
    { value: 'other', label: '📌 Other' },
];

function Music({ token, username }) {
    const [audios, setAudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [selectedAudio, setSelectedAudio] = useState(null);
    const [currentPlaying, setCurrentPlaying] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    // Upload states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [audioCategory, setAudioCategory] = useState('music');
    const [audioFile, setAudioFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const audioRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAudios();
    }, [category]);

    function fetchAudios() {
        setLoading(true);
        getAudios({ search, category })
            .then(res => {
                setAudios(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }

    function handleSearch(e) {
        e.preventDefault();
        fetchAudios();
    }

    function handlePlay(audio) {
        if (currentPlaying?.id === audio.id) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        } else {
            setCurrentPlaying(audio);
            setIsPlaying(true);
            setProgress(0);
        }
    }

    useEffect(() => {
        if (currentPlaying && audioRef.current) {
            audioRef.current.src = `http://127.0.0.1:8000${currentPlaying.audio_file}`;
            audioRef.current.play();
        }
    }, [currentPlaying]);

    function handleTimeUpdate() {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            setProgress((current / total) * 100);
            setDuration(total);
        }
    }

    function handleSeek(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        audioRef.current.currentTime = percent * audioRef.current.duration;
    }

    function formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function handleUpload() {
        if (!title || !audioFile) {
            setError('Title and audio file are required!');
            return;
        }
        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description || '');
        formData.append('category', audioCategory);
        formData.append('audio_file', audioFile, audioFile.name);
        if (coverImage) formData.append('cover_image', coverImage, coverImage.name);

        createAudio(formData)
            .then(() => {
                setTitle('');
                setDescription('');
                setAudioFile(null);
                setCoverImage(null);
                setCoverPreview(null);
                setShowUpload(false);
                setUploading(false);
                fetchAudios();
            })
            .catch(err => {
                setError('Failed to upload audio!');
                console.error(err.response?.data);
                setUploading(false);
            });
    }

    function handleDelete(id) {
        deleteAudio(id)
            .then(() => {
                setAudios(prev => prev.filter(a => a.id !== id));
                if (currentPlaying?.id === id) {
                    setCurrentPlaying(null);
                    setIsPlaying(false);
                }
                if (selectedAudio?.id === id) setSelectedAudio(null);
            });
    }

    function handleLike(id) {
        if (!token) { navigate('/login'); return; }
        likeAudio(id)
            .then(res => {
                setAudios(prev => prev.map(a =>
                    a.id === id ? { ...a, total_likes: res.data.total_likes } : a
                ));
                if (selectedAudio?.id === id) {
                    setSelectedAudio(prev => ({
                        ...prev,
                        total_likes: res.data.total_likes
                    }));
                }
            });
    }

    function handleComment(audioId) {
        if (!token) { navigate('/login'); return; }
        if (!comment.trim()) return;
        commentAudio(audioId, { content: comment })
            .then(res => {
                setSelectedAudio(prev => ({
                    ...prev,
                    audio_comments: [...(prev.audio_comments || []), res.data],
                    total_comments: prev.total_comments + 1
                }));
                setComment('');
            });
    }

    function handleDeleteComment(commentId) {
        deleteAudioComment(commentId)
            .then(() => {
                setSelectedAudio(prev => ({
                    ...prev,
                    audio_comments: prev.audio_comments.filter(c => c.id !== commentId),
                    total_comments: prev.total_comments - 1
                }));
            });
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0f0f1a' }}>

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration)}
            />

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
                padding: '2rem',
                color: 'white'
            }}>
                <div style={{
                    maxWidth: '1000px',
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
                        }}>🎵 Music & Audio</h1>
                        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.85 }}>
                            Listen and share audio
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <form onSubmit={handleSearch} style={{
                            display: 'flex',
                            gap: '0.5rem'
                        }}>
                            <input
                                type="text"
                                placeholder="Search audio..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '0.9rem',
                                    width: '180px'
                                }}
                            />
                            <button type="submit" style={{
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.4)',
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
                                    background: 'white',
                                    color: '#7c3aed',
                                    border: 'none',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '700'
                                }}>+ Upload Audio</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Now Playing Bar */}
            {currentPlaying && (
                <div style={{
                    background: '#1a1a2e',
                    padding: '1rem 2rem',
                    borderBottom: '1px solid #333',
                    position: 'sticky',
                    top: '64px',
                    zIndex: 50
                }}>
                    <div style={{
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '0.5rem'
                        }}>
                            {/* Cover */}
                            <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '8px',
                                background: currentPlaying.cover_image
                                    ? `url(http://127.0.0.1:8000${currentPlaying.cover_image}) center/cover`
                                    : 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                flexShrink: 0
                            }}>
                                {!currentPlaying.cover_image && '🎵'}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    color: 'white',
                                    margin: 0,
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{currentPlaying.title}</p>
                                <p style={{
                                    color: '#9ca3af',
                                    margin: 0,
                                    fontSize: '0.8rem'
                                }}>{currentPlaying.author_name}</p>
                            </div>

                            {/* Controls */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <button
                                    onClick={() => handlePlay(currentPlaying)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: '#7c3aed',
                                        border: 'none',
                                        color: 'white',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                    {isPlaying ? '⏸' : '▶'}
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentPlaying(null);
                                        setIsPlaying(false);
                                        audioRef.current.pause();
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#9ca3af',
                                        cursor: 'pointer',
                                        fontSize: '1rem'
                                    }}>✕</button>
                            </div>

                            {/* Time */}
                            <span style={{
                                color: '#9ca3af',
                                fontSize: '0.8rem',
                                whiteSpace: 'nowrap'
                            }}>
                                {formatTime(audioRef.current?.currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div
                            onClick={handleSeek}
                            style={{
                                width: '100%',
                                height: '4px',
                                background: '#333',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                position: 'relative'
                            }}>
                            <div style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: '#7c3aed',
                                borderRadius: '4px',
                                transition: 'width 0.1s'
                            }} />
                        </div>
                    </div>
                </div>
            )}

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
                                background: category === cat.value ? '#7c3aed' : '#1a1a2e',
                                color: category === cat.value ? 'white' : '#9ca3af',
                                border: '1px solid #333',
                                padding: '0.4rem 0.9rem',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '500'
                            }}>{cat.label}</button>
                    ))}
                </div>

                {/* Audio Grid */}
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#9ca3af'
                    }}>
                        <div style={{ fontSize: '2rem' }}>⏳</div>
                        <p>Loading audio...</p>
                    </div>
                ) : audios.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#9ca3af'
                    }}>
                        <div style={{ fontSize: '3rem' }}>🎵</div>
                        <p>No audio yet! Be the first to upload.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1rem'
                    }}>
                        {audios.map(audio => (
                            <div
                                key={audio.id}
                                style={{
                                    background: '#1a1a2e',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: currentPlaying?.id === audio.id
                                        ? '2px solid #7c3aed'
                                        : '1px solid #333',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                {/* Cover Image */}
                                <div style={{
                                    height: '160px',
                                    background: audio.cover_image
                                        ? `url(http://127.0.0.1:8000${audio.cover_image}) center/cover`
                                        : 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    {!audio.cover_image && (
                                        <span style={{ fontSize: '3rem' }}>🎵</span>
                                    )}

                                    {/* Play Button */}
                                    <button
                                        onClick={() => handlePlay(audio)}
                                        style={{
                                            position: 'absolute',
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            background: 'rgba(124,58,237,0.9)',
                                            border: 'none',
                                            color: 'white',
                                            fontSize: '1.2rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                        }}>
                                        {currentPlaying?.id === audio.id && isPlaying ? '⏸' : '▶'}
                                    </button>

                                    {/* Category Badge */}
                                    <span style={{
                                        position: 'absolute',
                                        top: '0.5rem',
                                        left: '0.5rem',
                                        background: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem'
                                    }}>{audio.category_display}</span>
                                </div>

                                {/* Audio Info */}
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{
                                        color: 'white',
                                        margin: '0 0 0.3rem 0',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>{audio.title}</h3>

                                    <p style={{
                                        color: '#9ca3af',
                                        fontSize: '0.85rem',
                                        margin: '0 0 0.75rem 0'
                                    }}>
                                        By {audio.author_name} •{' '}
                                        {new Date(audio.created_at).toLocaleDateString()}
                                    </p>

                                    {audio.description && (
                                        <p style={{
                                            color: '#6b7280',
                                            fontSize: '0.8rem',
                                            margin: '0 0 0.75rem 0',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>{audio.description}</p>
                                    )}

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            gap: '1rem'
                                        }}>
                                            <span
                                                onClick={() => handleLike(audio.id)}
                                                style={{
                                                    color: '#9ca3af',
                                                    fontSize: '0.85rem',
                                                    cursor: 'pointer'
                                                }}>
                                                ❤️ {audio.total_likes}
                                            </span>
                                            <span
                                                onClick={() => setSelectedAudio(audio)}
                                                style={{
                                                    color: '#9ca3af',
                                                    fontSize: '0.85rem',
                                                    cursor: 'pointer'
                                                }}>
                                                💬 {audio.total_comments}
                                            </span>
                                        </div>

                                        {token && audio.author_name === username && (
                                            <button
                                                onClick={() => handleDelete(audio.id)}
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

            {/* Comments Modal */}
            {selectedAudio && (
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
                        background: '#1a1a2e',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '500px',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        border: '1px solid #333'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid #333',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{
                                    color: 'white',
                                    margin: 0,
                                    fontWeight: '700'
                                }}>{selectedAudio.title}</h3>
                                <p style={{
                                    color: '#9ca3af',
                                    margin: '0.3rem 0 0 0',
                                    fontSize: '0.85rem'
                                }}>By {selectedAudio.author_name}</p>
                            </div>
                            <button
                                onClick={() => setSelectedAudio(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#9ca3af',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem'
                                }}>✕</button>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            {/* Like Button */}
                            <button
                                onClick={() => handleLike(selectedAudio.id)}
                                style={{
                                    background: '#4c1d95',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    marginBottom: '1.5rem'
                                }}>
                                ❤️ {selectedAudio.total_likes} Like
                            </button>

                            {/* Comments */}
                            <h4 style={{
                                color: 'white',
                                marginBottom: '1rem'
                            }}>
                                💬 Comments ({selectedAudio.total_comments})
                            </h4>

                            {token ? (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <textarea
                                        placeholder="Write a comment..."
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
                                        onClick={() => handleComment(selectedAudio.id)}
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
                                <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
                                    <span
                                        onClick={() => navigate('/login')}
                                        style={{
                                            color: '#7c3aed',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}>Login</span> to comment
                                </p>
                            )}

                            {selectedAudio.audio_comments && selectedAudio.audio_comments.length === 0 ? (
                                <p style={{
                                    color: '#6b7280',
                                    textAlign: 'center',
                                    padding: '1rem'
                                }}>No comments yet!</p>
                            ) : (
                                selectedAudio.audio_comments && selectedAudio.audio_comments.map(c => (
                                    <div key={c.id} style={{
                                        borderBottom: '1px solid #333',
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
                                                <strong style={{
                                                    color: 'white',
                                                    fontSize: '0.9rem'
                                                }}>{c.author_name}</strong>
                                                <span style={{
                                                    color: '#6b7280',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {new Date(c.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p style={{
                                                margin: '0 0 0 2rem',
                                                color: '#d1d5db',
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
                        background: '#1a1a2e',
                        borderRadius: '16px',
                        padding: '2rem',
                        width: '100%',
                        maxWidth: '480px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        border: '1px solid #333'
                    }}>
                        <h2 style={{
                            color: 'white',
                            marginTop: 0,
                            fontWeight: '700'
                        }}>🎵 Upload Audio</h2>

                        {error && (
                            <p style={{
                                color: '#dc2626',
                                background: '#fef2f2',
                                padding: '0.5rem',
                                borderRadius: '6px'
                            }}>{error}</p>
                        )}

                        {/* Category */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#d1d5db',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}>Category</label>
                            <select
                                value={audioCategory}
                                onChange={e => setAudioCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: '#111',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: 'white',
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
                                color: '#d1d5db',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}>Title *</label>
                            <input
                                type="text"
                                placeholder="Enter title..."
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
                                placeholder="Describe your audio..."
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

                        {/* Audio File */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#d1d5db',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}>Audio File * (mp3, wav, etc)</label>
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={e => setAudioFile(e.target.files[0])}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: '#d1d5db',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {audioFile && (
                                <p style={{
                                    color: '#16a34a',
                                    fontSize: '0.85rem',
                                    marginTop: '0.5rem'
                                }}>
                                    ✅ {audioFile.name}
                                </p>
                            )}
                        </div>

                        {/* Cover Image */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#d1d5db',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}>Cover Image (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    setCoverImage(file);
                                    if (file) setCoverPreview(URL.createObjectURL(file));
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
                            {coverPreview && (
                                <img
                                    src={coverPreview}
                                    alt="cover"
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

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => {
                                    setShowUpload(false);
                                    setTitle('');
                                    setDescription('');
                                    setAudioFile(null);
                                    setCoverImage(null);
                                    setCoverPreview(null);
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
                                disabled={uploading || !title || !audioFile}
                                style={{
                                    flex: 1,
                                    background: uploading || !title || !audioFile
                                        ? '#555'
                                        : 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    cursor: uploading || !title || !audioFile
                                        ? 'not-allowed' : 'pointer',
                                    fontWeight: '600'
                                }}>
                                {uploading ? 'Uploading...' : '🎵 Upload Audio'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Music;