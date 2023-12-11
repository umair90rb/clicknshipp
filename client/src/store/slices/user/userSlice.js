import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllUser } from './fetchUser';

const initialState = {
  users: [],
  fetchStatus: fetchStatus.IDLE,
  error: null,
  update: {
    index: null,
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
      const { data, index } = action.payload;
      state.update.data = data;
      state.update.index = index;
    },
    updateUser: (state, action) => {
      const { data, index } = action.payload;
      state.users.splice(index, 1, data);
      state.update.data = null;
      state.update.index = null;
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
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
export const { addUser, setUserForUpdate, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
