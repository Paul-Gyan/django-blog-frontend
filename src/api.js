import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        }
        return Promise.reject(error);
    }
);

// Posts
export const getPosts = (params) => API.get('/api/posts/', { params });
export const getPost = (id) => API.get(`/api/posts/${id}/`);
export const createPost = (data) => API.post('/api/posts/create/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const editPost = (id, data) => API.put(`/api/posts/${id}/edit/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deletePost = (id) => API.delete(`/api/posts/${id}/delete/`);

// Comments
export const createComment = (postId, data) => API.post(`/api/posts/${postId}/comment/`, data);
export const deleteComment = (id) => API.delete(`/api/comments/${id}/delete/`);

// Likes
export const toggleLike = (postId) => API.post(`/api/posts/${postId}/like/`);

// Categories
export const getCategories = () => API.get('/api/categories/');

// Auth
export const login = (data) => API.post('/api/token/', data);
export const getProfile = (username) => API.get(`/api/profile/${username}/`);
export const updateProfile = (data) => API.put('/api/profile/update/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Stories
export const getStories = () => API.get('/api/stories/');
export const getStory = (id) => API.get(`/api/stories/${id}/`);
export const createStory = (data) => API.post('/api/stories/create/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000
});
export const deleteStory = (id) => API.delete(`/api/stories/${id}/delete/`);

// Videos
export const getVideos = (params) => API.get('/api/videos/', { params });
export const getVideo = (id) => API.get(`/api/videos/${id}/`);
export const createVideo = (data) => API.post('/api/videos/create/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
});
export const deleteVideo = (id) => API.delete(`/api/videos/${id}/delete/`);
export const likeVideo = (id) => API.post(`/api/videos/${id}/like/`);
export const commentVideo = (id, data) => API.post(`/api/videos/${id}/comment/`, data);
export const deleteVideoComment = (id) => API.delete(`/api/videos/comments/${id}/delete/`);

// Reports
export const getReports = (params) => API.get('/api/reports/', { params });
export const getReport = (id) => API.get(`/api/reports/${id}/`);
export const createReport = (data) => API.post('/api/reports/create/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
});
export const deleteReport = (id) => API.delete(`/api/reports/${id}/delete/`);
export const likeReport = (id) => API.post(`/api/reports/${id}/like/`);
export const commentReport = (id, data) => API.post(`/api/reports/${id}/comment/`, data);
export const deleteReportComment = (id) => API.delete(`/api/reports/comments/${id}/delete/`);

// Audio
export const getAudios = (params) => API.get('/api/audios/', { params });
export const getAudio = (id) => API.get(`/api/audios/${id}/`);
export const createAudio = (data) => API.post('/api/audios/create/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
});
export const deleteAudio = (id) => API.delete(`/api/audios/${id}/delete/`);
export const likeAudio = (id) => API.post(`/api/audios/${id}/like/`);
export const commentAudio = (id, data) => API.post(`/api/audios/${id}/comment/`, data);
export const deleteAudioComment = (id) => API.delete(`/api/audios/comments/${id}/delete/`);


export default API;