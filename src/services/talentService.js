import axios from 'axios';

const API_URL = 'http://localhost:8080/api/talent';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ikds_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const talentService = {
    async getSkills() {
        const { data } = await api.get('/skills');
        return data;
    },
    async createSkill(skillData) {
        const { data } = await api.post('/skills', skillData);
        return data;
    },
    async getAssessments(employeeId) {
        const { data } = await api.get(`/assessments/employee/${employeeId}`);
        return data;
    },
    async createAssessment(assessmentData) {
        const { data } = await api.post('/assessments', assessmentData);
        return data;
    },
    async getWeightedScore(employeeId) {
        const { data } = await api.get(`/assessments/weighted-score/${employeeId}`);
        return data;
    },
    async getNineBoxData() {
        const { data } = await api.get('/nine-box');
        return data;
    },
    async createPerformanceRating(ratingData) {
        const { data } = await api.post('/performance-rating', ratingData);
        return data;
    },
};

export default talentService;
