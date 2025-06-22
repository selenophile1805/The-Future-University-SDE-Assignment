import axios from 'axios';
import config from '../config';

const API_BASE_URL = config.getApiUrl();

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

export const postsAPI = {
    getPosts: () => api.get('/posts/'),
    createPost: (postData) => {
        const formData = new FormData();
        formData.append('content', postData.content);
        if (postData.image) {
            formData.append('image', postData.image);
        }
        return api.post('/posts/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    likePost: (postId) => api.post(`/posts/${postId}/like`),
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export const imagesAPI = {
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export default api; 