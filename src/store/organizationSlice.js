import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import organizationService from '../services/organizationService';

export const fetchDepartments = createAsyncThunk(
    'organization/fetchDepartments',
    async (_, { rejectWithValue }) => {
        try {
            return await organizationService.getDepartments();
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || 'Departmanlar yüklenemedi');
        }
    }
);

export const fetchDepartmentTree = createAsyncThunk(
    'organization/fetchTree',
    async (_, { rejectWithValue }) => {
        try {
            return await organizationService.getDepartmentTree();
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || 'Org chart yüklenemedi');
        }
    }
);

export const createDepartment = createAsyncThunk(
    'organization/create',
    async (data, { rejectWithValue }) => {
        try {
            return await organizationService.createDepartment(data);
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || 'Departman oluşturulamadı');
        }
    }
);

export const deleteDepartment = createAsyncThunk(
    'organization/delete',
    async (id, { rejectWithValue }) => {
        try {
            await organizationService.deleteDepartment(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || 'Departman silinemedi');
        }
    }
);

const organizationSlice = createSlice({
    name: 'organization',
    initialState: {
        departments: [],
        tree: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearOrgError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartments.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchDepartments.fulfilled, (state, action) => { state.loading = false; state.departments = action.payload; })
            .addCase(fetchDepartments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchDepartmentTree.pending, (state) => { state.loading = true; })
            .addCase(fetchDepartmentTree.fulfilled, (state, action) => { state.loading = false; state.tree = action.payload; })
            .addCase(fetchDepartmentTree.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(createDepartment.fulfilled, (state, action) => { state.departments.push(action.payload); })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.departments = state.departments.filter(d => d.id !== action.payload);
            });
    },
});

export const { clearOrgError } = organizationSlice.actions;
export default organizationSlice.reducer;
