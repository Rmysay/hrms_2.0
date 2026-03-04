import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ikds_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    async login(email, password) {
        const { data } = await api.post('/login', { email, password });
        if (data.token) {
            localStorage.setItem('ikds_token', data.token);
        }
        return data;
    },

    async register(userData) {
        const { data } = await api.post('/register', userData);
        if (data.token) {
            localStorage.setItem('ikds_token', data.token);
        }
        return data;
    },

    async getCurrentUser() {
        const { data } = await api.get('/me');
        return data;
    },

    logout() {
        localStorage.removeItem('ikds_token');
    },

    getToken() {
        return localStorage.getItem('ikds_token');
    },
};

export default authService;
