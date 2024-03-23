import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from 'api/index';

const fetchLogin = createAsyncThunk('login/fetch', ({ body }, { rejectWithValue }) =>
  authService.fetchLogin(body).catch((error) => rejectWithValue(error.response.data))
);

const fetchRegister = createAsyncThunk('register/fetch', ({ body }, { rejectWithValue }) =>
  authService.fetchRegister(body).catch((error) => rejectWithValue(error.response.data))
);

const fetchProfile = createAsyncThunk('profile/fetch', (_, { rejectWithValue }) =>
  authService.fetchProfile().catch((error) => rejectWithValue(error.response.data))
);

export { fetchLogin, fetchRegister, fetchProfile };
