import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllRoles, fetchAllPermissions } from './fetchACL';

const initialState = {
  roles: {
    list: [],
    fetchStatus: fetchStatus.IDLE,
    error: null
  },
  permissions: {
    list: [],
    fetchStatus: fetchStatus.IDLE,
    error: null
  }
};

const roleSlice = createSlice({
  name: 'acl',
  initialState,
  reducers: {
    clearACLState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllRoles.pending, (state, _action) => {
      state.roles.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllRoles.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.roles.fetchStatus = fetchStatus.SUCCESS;
      state.roles.list = data.roles;
      state.roles.error = null;
    });
    builder.addCase(fetchAllRoles.rejected, (state, action) => {
      state.roles.list = [];
      state.roles.fetchStatus = fetchStatus.FAILURE;
      state.roles.error = action.payload;
    });
    builder.addCase(fetchAllPermissions.pending, (state, _action) => {
      state.permissions.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllPermissions.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.permissions.fetchStatus = fetchStatus.SUCCESS;
      state.permissions.list = data.permissions;
      state.permissions.error = null;
    });
    builder.addCase(fetchAllPermissions.rejected, (state, action) => {
      state.permissions.list = [];
      state.permissions.fetchStatus = fetchStatus.FAILURE;
      state.permissions.error = action.payload;
    });
  }
});
export const { clearACLState } = roleSlice.actions;
export default roleSlice.reducer;
