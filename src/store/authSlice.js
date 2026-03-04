import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

// Async Thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            return await authService.login(email, password);
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.error || 'Giriş başarısız'
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            return await authService.register(userData);
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.error || 'Kayıt başarısız'
            );
        }
    }
);

export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            return await authService.getCurrentUser();
        } catch (err) {
            authService.logout();
            return rejectWithValue('Oturum süresi doldu');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: authService.getToken(),
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            authService.logout();
            state.user = null;
            state.token = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Load User
        builder
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
