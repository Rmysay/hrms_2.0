import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import talentService from '../services/talentService';

export const fetchSkills = createAsyncThunk('talent/fetchSkills', async (_, { rejectWithValue }) => {
    try { return await talentService.getSkills(); }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Yetkinlikler yüklenemedi'); }
});

export const createSkill = createAsyncThunk('talent/createSkill', async (data, { rejectWithValue }) => {
    try { return await talentService.createSkill(data); }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Yetkinlik oluşturulamadı'); }
});

export const fetchNineBox = createAsyncThunk('talent/fetchNineBox', async (_, { rejectWithValue }) => {
    try { return await talentService.getNineBoxData(); }
    catch (err) { return rejectWithValue(err.response?.data?.error || '9-Box verisi yüklenemedi'); }
});

const talentSlice = createSlice({
    name: 'talent',
    initialState: { skills: [], nineBox: [], loading: false, error: null },
    reducers: {
        clearTalentError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSkills.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchSkills.fulfilled, (state, action) => { state.loading = false; state.skills = action.payload; })
            .addCase(fetchSkills.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createSkill.fulfilled, (state, action) => { state.skills.push(action.payload); })
            .addCase(fetchNineBox.pending, (state) => { state.loading = true; })
            .addCase(fetchNineBox.fulfilled, (state, action) => { state.loading = false; state.nineBox = action.payload; })
            .addCase(fetchNineBox.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { clearTalentError } = talentSlice.actions;
export default talentSlice.reducer;
