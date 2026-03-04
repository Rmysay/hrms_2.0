import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ikds_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const organizationService = {
    // Departments
    async getDepartments() {
        const { data } = await api.get('/departments');
        return data;
    },

    async getDepartmentTree() {
        const { data } = await api.get('/departments/tree');
        return data;
    },

    async getDepartment(id) {
        const { data } = await api.get(`/departments/${id}`);
        return data;
    },

    async createDepartment(departmentData) {
        const { data } = await api.post('/departments', departmentData);
        return data;
    },

    async updateDepartment(id, departmentData) {
        const { data } = await api.put(`/departments/${id}`, departmentData);
        return data;
    },

    async deleteDepartment(id) {
        const { data } = await api.delete(`/departments/${id}`);
        return data;
    },

    // Positions
    async getPositions() {
        const { data } = await api.get('/positions');
        return data;
    },

    async getPositionsByDepartment(departmentId) {
        const { data } = await api.get(`/positions/department/${departmentId}`);
        return data;
    },

    async createPosition(positionData) {
        const { data } = await api.post('/positions', positionData);
        return data;
    },
};

export default organizationService;
