import { useState, useEffect } from 'react';
import { getStories, createStory, deleteStory } from '../api';

function Stories({ token, username }) {
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [bgColor, setBgColor] = useState('#1d4ed8');
    const [saving, setSaving] = useState(false);
    const [progress, setProgress] = useState(0);
    const [mediaType, setMediaType] = useState('text');
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    useEffect(() => {
        fetchStories();
    }, []);

    function fetchStories() {
        getStories()
            .then(res => setStories(res.data))
            .catch(err => console.error(err));
    }

    useEffect(() => {
        if (!selectedStory) return;
        setProgress(0);
        const duration = selectedStory.video ? 150 : 50;
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setSelectedStory(null);
                    return 0;
                }
                return prev + (100 / duration);
            });
        }, 100);
        return () => clearInterval(interval);
    }, [selectedStory]);

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    }

    function handleVideoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 52428800) {
            alert('Video too large! Maximum 50MB');
            return;
        }
        setVideo(file);
        setVideoPreview(URL.createObjectURL(file));
    }

    function handleCreate() {
        if (!text && !image && !video) return;
        setSaving(true);

        const formData = new FormData();
        formData.append('text', text || '');
        formData.append('background_color', bgColor || '#1d4ed8');
        if (image) formData.append('image', image, image.name);
        if (video) formData.append('video', video, video.name);

        createStory(formData)
            .then(() => {
                setText('');
                setImage(null);
                setVideo(null);
                setImagePreview(null);
                setVideoPreview(null);
                setShowCreate(false);
                setSaving(false);
                fetchStories();
            })
            .catch(err => {
                console.error('Story error:', err.response?.data);
                alert('Failed: ' + JSON.stringify(err.response?.data));
                setSaving(false);
            });
    }

    function handleDelete(id) {
        deleteStory(id)
            .then(() => {
                setStories(prev => prev.filter(s => s.id !== id));
                setSelectedStory(null);
            });
    }

    return (
        <div style={{
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
            padding: '1rem 2rem'
        }}>
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem'
            }}>
                {/* Add Story Button */}
                {token && (
                    <div
                        onClick={() => setShowCreate(true)}
                        style={{
                            minWidth: '70px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.4rem',
                            cursor: 'pointer'
                        }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: '#f3f4f6',
                            border: '2px dashed #1d4ed8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            color: '#1d4ed8'
                        }}>+</div>
                        <span style={{
                            fontSize: '0.7rem',
                            color: '#6b7280',
                            textAlign: 'center'
                        }}>Add Story</span>
                    </div>
                )}

                {/* Stories List */}
                {stories.map(story => (
                    <div
                        key={story.id}
                        onClick={() => setSelectedStory(story)}
                        style={{
                            minWidth: '70px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.4rem',
                            cursor: 'pointer'
                        }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: story.image
                                ? `url(http://127.0.0.1:8000${story.image}) center/cover`
                                : story.background_color,
                            border: '3px solid #1d4ed8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '1.2rem',
                            position: 'relative'
                        }}>
                            {!story.image && !story.video &&
                                story.author_name?.charAt(0).toUpperCase()}
                            {story.video && !story.image && (
                                <span style={{ fontSize: '1.5rem' }}>🎥</span>
                            )}
                        </div>
                        <span style={{
                            fontSize: '0.7rem',
                            color: '#374151',
                            textAlign: 'center',
                            maxWidth: '70px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>{story.author_name}</span>
                        <span style={{
                            fontSize: '0.65rem',
                            color: '#9ca3af'
                        }}>{story.time_left}h left</span>
                    </div>
                ))}

                {stories.length === 0 && !token && (
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                        No stories yet!
                    </p>
                )}
            </div>

            {/* Story Viewer */}
            {selectedStory && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.95)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: '100vh',
                        maxHeight: '700px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        background: selectedStory.background_color
                    }}>
                        {/* Progress Bar */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%',
                            height: '3px',
                            background: 'rgba(255,255,255,0.3)',
                            zIndex: 10
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: 'white',
                                transition: 'width 0.1s linear'
                            }} />
                        </div>

                        {/* Header */}
                        <div style={{
                            position: 'absolute',
                            top: '1rem', left: '1rem', right: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            zIndex: 10
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: '700'
                                }}>
                                    {selectedStory.author_name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: '0.9rem'
                                    }}>{selectedStory.author_name}</div>
                                    <div style={{
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '0.75rem'
                                    }}>
                                        {selectedStory.time_left}h left • 👁️ {selectedStory.total_views}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {selectedStory.author_name === username && (
                                    <button
                                        onClick={() => handleDelete(selectedStory.id)}
                                        style={{
                                            background: 'rgba(220,38,38,0.8)',
                                            border: 'none',
                                            color: 'white',
                                            padding: '0.3rem 0.6rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}>🗑️</button>
                                )}
                                <button
                                    onClick={() => setSelectedStory(null)}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '0.3rem 0.6rem',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem'
                                    }}>✕</button>
                            </div>
                        </div>

                        {/* Story Content */}
                        {selectedStory.video ? (
                            <video
                                src={`http://127.0.0.1:8000${selectedStory.video}`}
                                autoPlay
                                controls
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : selectedStory.image ? (
                            <img
                                src={`http://127.0.0.1:8000${selectedStory.image}`}
                                alt="story"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '2rem'
                            }}>
                                <p style={{
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    lineHeight: '1.6'
                                }}>{selectedStory.text}</p>
                            </div>
                        )}

                        {/* Text overlay */}
                        {(selectedStory.image || selectedStory.video) && selectedStory.text && (
                            <div style={{
                                position: 'absolute',
                                bottom: '2rem',
                                left: '1rem', right: '1rem',
                                background: 'rgba(0,0,0,0.5)',
                                padding: '1rem',
                                borderRadius: '8px'
                            }}>
                                <p style={{
                                    color: 'white',
                                    margin: 0,
                                    fontSize: '1rem',
                                    textAlign: 'center'
                                }}>{selectedStory.text}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Story Modal */}
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
                        maxWidth: '450px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{
                            color: '#111827',
                            marginTop: 0,
                            fontWeight: '700'
                        }}>Create Story 📸</h2>

                        {/* Media Type Selector */}
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            {['text', 'image', 'video'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setMediaType(type);
                                        setImage(null);
                                        setVideo(null);
                                        setImagePreview(null);
                                        setVideoPreview(null);
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: mediaType === type ? '#1d4ed8' : '#f3f4f6',
                                        color: mediaType === type ? 'white' : '#374151',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.85rem'
                                    }}>
                                    {type === 'text' ? '✍️ Text' :
                                        type === 'image' ? '🖼️ Image' : '🎥 Video'}
                                </button>
                            ))}
                        </div>

                        {/* Color Picker */}
                        {mediaType === 'text' && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#374151',
                                    fontSize: '0.9rem'
                                }}>Background Color</label>

                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    flexWrap: 'wrap',
                                    marginBottom: '0.5rem'
                                }}>
                                    {[
                                        '#1d4ed8', '#dc2626', '#16a34a',
                                        '#ca8a04', '#7c3aed', '#db2777',
                                        '#ea580c', '#0891b2', '#111827',
                                        '#be185d', '#065f46', '#92400e'
                                    ].map(color => (
                                        <div
                                            key={color}
                                            onClick={() => setBgColor(color)}
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                background: color,
                                                cursor: 'pointer',
                                                border: bgColor === color
                                                    ? '3px solid #111827'
                                                    : '2px solid transparent',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                            }}
                                        />
                                    ))}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={e => setBgColor(e.target.value)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            padding: '2px'
                                        }}
                                    />
                                    <span style={{
                                        color: '#6b7280',
                                        fontSize: '0.85rem'
                                    }}>Or pick any custom color 🎨</span>
                                </div>
                            </div>
                        )}

                        {/* Image Upload */}
                        {mediaType === 'image' && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#374151',
                                    fontSize: '0.9rem'
                                }}>Upload Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
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
                        )}

                        {/* Video Upload */}
                        {mediaType === 'video' && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#374151',
                                    fontSize: '0.9rem'
                                }}>Upload Video (max 50MB)</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoChange}
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
                                            maxHeight: '200px'
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        {/* Caption */}
                        <textarea
                            placeholder={
                                mediaType === 'text'
                                    ? 'Write your story...'
                                    : 'Add a caption (optional)'
                            }
                            value={text}
                            onChange={e => setText(e.target.value)}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                boxSizing: 'border-box',
                                marginBottom: '1rem',
                                resize: 'none',
                                fontFamily: 'inherit'
                            }}
                        />

                        {/* Preview for text */}
                        {mediaType === 'text' && (
                            <div style={{
                                background: bgColor,
                                borderRadius: '8px',
                                padding: '1rem',
                                marginBottom: '1rem',
                                minHeight: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <p style={{
                                    color: 'white',
                                    margin: 0,
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    fontSize: '1.1rem'
                                }}>{text || 'Preview...'}</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => {
                                    setShowCreate(false);
                                    setText('');
                                    setImage(null);
                                    setVideo(null);
                                    setImagePreview(null);
                                    setVideoPreview(null);
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
                                onClick={handleCreate}
                                disabled={saving || (!text && !image && !video)}
                                style={{
                                    flex: 1,
                                    background: saving || (!text && !image && !video)
                                        ? '#93c5fd'
                                        : 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    cursor: saving || (!text && !image && !video)
                                        ? 'not-allowed' : 'pointer',
                                    fontWeight: '600'
                                }}>
                                {saving ? 'Sharing...' : 'Share Story 🚀'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Stories;