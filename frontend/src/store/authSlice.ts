import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@/api';
import type { User } from '@/types';

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: typeof window !== 'undefined' ? localStorage.getItem('isAuth') === 'true' : false,
    isLoading: false,
    error: null,
};

export const loginThunk = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const { data } = await authApi.login(email, password);
            if (typeof window !== 'undefined') localStorage.setItem('isAuth', 'true');
            return data.user;
        } catch (err: unknown) {
            const error = err as { response?: { data?: Record<string, string> } };
            return rejectWithValue(error.response?.data?.detail || 'Login failed');
        }
    }
);

export const registerThunk = createAsyncThunk(
    'auth/register',
    async (data: any, { rejectWithValue }) => {
        try {
            const payload = {
                ...data,
                password2: data.confirm_password || data.password2
            };
            const { data: resData } = await authApi.register(payload);
            if (typeof window !== 'undefined') localStorage.setItem('isAuth', 'true');
            return resData.user;
        } catch (err: unknown) {
            const error = err as { response?: { data?: Record<string, string> } };
            return rejectWithValue(error.response?.data?.detail || 'Registration failed');
        }
    }
);

export const fetchProfileThunk = createAsyncThunk(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await authApi.getProfile();
            return data;
        } catch {
            if (typeof window !== 'undefined') localStorage.removeItem('isAuth');
            return rejectWithValue('Failed to fetch profile');
        }
    }
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    if (typeof window !== 'undefined') localStorage.removeItem('isAuth');
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearError(state) { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchProfileThunk.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
