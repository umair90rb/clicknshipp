import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchLogin } from './fetchAuth';
import { http } from 'api/ajax';

const initialState = {
  token: null,
  user: null,
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLogin.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.token = data.token;
      http.defaults.headers.common.Authorization = data.token;
      state.user = data.user;
      state.error = null;
    });
    builder.addCase(fetchLogin.rejected, (state, action) => {
      (state.user = null), (state.token = null);
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
