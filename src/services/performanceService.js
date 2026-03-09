import axios from 'axios';

const API_URL = 'http://localhost:8080/api/performance';
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ikds_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const performanceService = {
    async getReviews(employeeId) {
        const params = employeeId ? { employeeId } : {};
        const { data } = await api.get('/reviews', { params });
        return data;
    },
    async createReview(reviewData) {
        const { data } = await api.post('/reviews', reviewData);
        return data;
    },
    async getAwards() {
        const { data } = await api.get('/awards');
        return data;
    },
    async createAward(awardData) {
        const { data } = await api.post('/awards', awardData);
        return data;
    },
};
export default performanceService;
