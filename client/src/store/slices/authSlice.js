import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

const initialState = {
  user: JSON.parse(localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo')) || null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async ({ email, password, rememberMe }, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data;
    
    if (rememberMe) {
      localStorage.setItem('userInfo', JSON.stringify(data));
    } else {
      sessionStorage.setItem('userInfo', JSON.stringify(data));
    }
    
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ email, otp }, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });
    const data = response.data;
    sessionStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Verification failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('userInfo');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      if (localStorage.getItem('userInfo')) {
        localStorage.setItem('userInfo', JSON.stringify(state.user));
      } else {
        sessionStorage.setItem('userInfo', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(verifyOTP.fulfilled, (state, action) => { state.user = action.payload; });
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
