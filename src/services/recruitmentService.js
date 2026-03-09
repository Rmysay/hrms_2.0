import axios from 'axios';

const API_URL = 'http://localhost:8080/api/recruitment';
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ikds_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const recruitmentService = {
    async getJobs(status) {
        const params = status ? { status } : {};
        const { data } = await api.get('/jobs', { params });
        return data;
    },
    async createJob(jobData) {
        const { data } = await api.post('/jobs', jobData);
        return data;
    },
    async updateJobStatus(id, status) {
        const { data } = await api.put(`/jobs/${id}/status`, { status });
        return data;
    },
    async getApplications() {
        const { data } = await api.get('/applications');
        return data;
    },
    async getApplicationsByJob(jobId) {
        const { data } = await api.get(`/jobs/${jobId}/applications`);
        return data;
    },
    async createApplication(appData) {
        const { data } = await api.post('/applications', appData);
        return data;
    },
    async updateApplicationStatus(id, status, notes) {
        const { data } = await api.put(`/applications/${id}/status`, { status, notes });
        return data;
    },
};
export default recruitmentService;
