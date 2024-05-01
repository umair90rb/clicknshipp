import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchLogin, fetchProfile } from './fetchAuth';

const initialState = {
  token: null,
  user: null,
  login: {
    fetchStatus: fetchStatus.IDLE,
    error: null
  },
  profile: {
    fetchStatus: fetchStatus.IDLE,
    error: null
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserSetting: (state, action) => {
      state.user = { ...state.user, settings: action.payload };
    },
    clearAuthState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLogin.pending, (state, _action) => {
      state.login.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.login.fetchStatus = fetchStatus.SUCCESS;
      state.token = data.token;
      state.error = null;
    });
    builder.addCase(fetchLogin.rejected, (state, action) => {
      state.user = null;
      state.token = null;
      state.login.fetchStatus = fetchStatus.FAILURE;
      state.login.error = action.payload?.error || "Can't login! Please try again.";
    });
    builder.addCase(fetchProfile.pending, (state, _action) => {
      state.profile.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.profile.fetchStatus = fetchStatus.SUCCESS;
      state.token = data.token;
      state.user = data.user;
      state.profile.error = null;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.user = null;
      state.token = null;
      state.profile.fetchStatus = fetchStatus.FAILURE;
      state.profile.error = action.payload;
    });
  }
});

export const { setUserSetting, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
