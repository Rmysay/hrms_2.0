import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import recruitmentService from '../services/recruitmentService';

export const fetchJobs = createAsyncThunk('recruitment/fetchJobs', async (_, { rejectWithValue }) => {
    try { return await recruitmentService.getJobs(); }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'İlanlar yüklenemedi'); }
});

export const fetchApplications = createAsyncThunk('recruitment/fetchApplications', async (_, { rejectWithValue }) => {
    try { return await recruitmentService.getApplications(); }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Başvurular yüklenemedi'); }
});

export const createJob = createAsyncThunk('recruitment/createJob', async (data, { rejectWithValue }) => {
    try { return await recruitmentService.createJob(data); }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'İlan oluşturulamadı'); }
});

export const updateAppStatus = createAsyncThunk('recruitment/updateAppStatus',
    async ({ id, status, notes }, { rejectWithValue }) => {
        try {
            const result = await recruitmentService.updateApplicationStatus(id, status, notes);
            return result;
        } catch (err) { return rejectWithValue(err.response?.data?.error || 'Durum güncellenemedi'); }
    }
);

const recruitmentSlice = createSlice({
    name: 'recruitment',
    initialState: { jobs: [], applications: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobs.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchJobs.fulfilled, (state, action) => { state.loading = false; state.jobs = action.payload; })
            .addCase(fetchJobs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchApplications.fulfilled, (state, action) => { state.applications = action.payload; })
            .addCase(createJob.fulfilled, (state, action) => { state.jobs.unshift(action.payload); })
            .addCase(updateAppStatus.fulfilled, (state, action) => {
                const idx = state.applications.findIndex(a => a.id === action.payload.id);
                if (idx >= 0) state.applications[idx] = action.payload;
            });
    },
});

export default recruitmentSlice.reducer;
