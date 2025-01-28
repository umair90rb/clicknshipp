import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchLogin, fetchProfile, fetchUpdatePassword } from './fetchAuth';

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
  },
  updatePassword: {
    visible: false,
    fetchStatus: fetchStatus.IDLE,
    error: null
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUserSetting: (state, action) => {
      state.user = { ...state.user, settings: action.payload };
    },
    setAuthUpdatePasswordVisible: (state, action) => {
      state.updatePassword.visible = action.payload;
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

    builder.addCase(fetchUpdatePassword.pending, (state, _action) => {
      state.updatePassword.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchUpdatePassword.fulfilled, (state, _action) => {
      state.updatePassword.fetchStatus = fetchStatus.SUCCESS;
      state.updatePassword.error = null;
      state.updatePassword.visible = false;
    });
    builder.addCase(fetchUpdatePassword.rejected, (state, action) => {
      state.updatePassword.fetchStatus = fetchStatus.FAILURE;
      state.updatePassword.error = action.payload;
    });
  }
});

export const { setAuthUserSetting, setAuthUpdatePasswordVisible, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
