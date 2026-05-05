import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

const getInitialAuth = () => {
  try {
    const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      if (parsed && parsed.user && parsed.token) {
        return { user: parsed.user, token: parsed.token };
      }
    }
  } catch (err) {
    console.error('Error parsing auth info from storage:', err);
  }
  return { user: null, token: null };
};

const { user, token } = getInitialAuth();

const initialState = {
  user,
  token,
  loading: false,
  error: null,
  successMessage: null,
};

export const login = createAsyncThunk('auth/login', async ({ email, password, rememberMe }, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, ...user } = response.data;
    const authData = { user, token };
    
    if (rememberMe) {
      localStorage.setItem('userInfo', JSON.stringify(authData));
    } else {
      sessionStorage.setItem('userInfo', JSON.stringify(authData));
    }
    
    return authData;
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
    const { token, ...user } = response.data;
    const authData = { user, token };
    sessionStorage.setItem('userInfo', JSON.stringify(authData));
    return authData;
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
      state.token = null;
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('userInfo');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      const authData = { user: state.user, token: state.token };
      if (localStorage.getItem('userInfo')) {
        localStorage.setItem('userInfo', JSON.stringify(authData));
      } else {
        sessionStorage.setItem('userInfo', JSON.stringify(authData));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { 
        state.loading = false; 
        state.user = action.payload.user; 
        state.token = action.payload.token; 
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; state.successMessage = null; })
      .addCase(register.fulfilled, (state, action) => { 
        state.loading = false; 
        state.successMessage = action.payload.message; 
      })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.successMessage = null; })
      .addCase(verifyOTP.fulfilled, (state, action) => { 
        state.user = action.payload.user; 
        state.token = action.payload.token; 
      });
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
