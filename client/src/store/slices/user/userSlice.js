import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllUser } from './fetchUser';

const initialState = {
  users: [],
  fetchStatus: fetchStatus.IDLE,
  error: null,
  update: {
    data: null
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users = [...state.users, action.payload];
    },
    setUserForUpdate: (state, action) => {
      state.update.data = action.payload;
    },
    updateUser: (state, action) => {
      const { data } = action.payload;
      const index = state.users.findIndex((user) => user.id === data.id);
      state.users[index] = data;
      state.update.data = null;
      state.update.index = null;
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    disableUser: (state, action) => {
      const index = state.users.findIndex((user) => user.id === action.payload);
      if (index > -1) {
        state.users[index].status = 'inactive';
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllUser.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllUser.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.users = data.users;
      state.error = null;
    });
    builder.addCase(fetchAllUser.rejected, (state, action) => {
      state.users = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { addUser, setUserForUpdate, updateUser, deleteUser, disableUser } = userSlice.actions;
export default userSlice.reducer;
