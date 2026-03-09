import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import performanceService from '../services/performanceService';

export const fetchReviews = createAsyncThunk('performance/fetchReviews', async (_, { rejectWithValue }) => {
    try { return await performanceService.getReviews(); }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Değerlendirmeler yüklenemedi'); }
});

export const fetchAwards = createAsyncThunk('performance/fetchAwards', async (_, { rejectWithValue }) => {
    try { return await performanceService.getAwards(); }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Ödüller yüklenemedi'); }
});

export const createReview = createAsyncThunk('performance/createReview', async (data, { rejectWithValue }) => {
    try { return await performanceService.createReview(data); }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Değerlendirme oluşturulamadı'); }
});

export const createAward = createAsyncThunk('performance/createAward', async (data, { rejectWithValue }) => {
    try { return await performanceService.createAward(data); }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Ödül oluşturulamadı'); }
});

const performanceSlice = createSlice({
    name: 'performance',
    initialState: { reviews: [], awards: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchReviews.fulfilled, (state, action) => { state.loading = false; state.reviews = action.payload; })
            .addCase(fetchReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchAwards.fulfilled, (state, action) => { state.awards = action.payload; })
            .addCase(createReview.fulfilled, (state, action) => { state.reviews.unshift(action.payload); })
            .addCase(createAward.fulfilled, (state, action) => { state.awards.unshift(action.payload); });
    },
});

export default performanceSlice.reducer;
