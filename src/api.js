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
export const editPost = (id, data) => API.put(`/api/posts/${id}/edit/`, data);
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

export default API;