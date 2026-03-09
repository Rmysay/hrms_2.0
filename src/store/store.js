import { configureStore, createSlice } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import organizationReducer from './organizationSlice';
import talentReducer from './talentSlice';
import recruitmentReducer from './recruitmentSlice';
import performanceReducer from './performanceSlice';

// Placeholder slice until real modules are added
const appSlice = createSlice({
    name: 'app',
    initialState: {
        sidebarCollapsed: false,
        theme: 'dark',
    },
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
    },
});

export const { toggleSidebar } = appSlice.actions;

const store = configureStore({
    reducer: {
        app: appSlice.reducer,
        auth: authReducer,
        organization: organizationReducer,
        talent: talentReducer,
        recruitment: recruitmentReducer,
        performance: performanceReducer,
    },
});

export default store;

