import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllItem } from './fetchItem';

const initialState = {
  items: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    clear: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllItem.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllItem.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.items = data.items;
      state.error = null;
    });
    builder.addCase(fetchAllItem.rejected, (state, action) => {
      state.items = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { clear } = itemSlice.actions;
export default itemSlice.reducer;
