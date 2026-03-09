import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ikds_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const employeeService = {
    async getEmployees() {
        const { data } = await api.get('/auth/users');
        return data;
    },
    async getEmployeeReviews(employeeId) {
        const { data } = await api.get('/performance/reviews', { params: { employeeId } });
        return data;
    },
    async getEmployeeAwards(employeeId) {
        const { data } = await api.get('/performance/awards');
        return data.filter(a => a.employeeId === employeeId);
    },
};
export default employeeService;
