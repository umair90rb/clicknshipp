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
    createItem: (state, action) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      console.log(index, 'updating index');
      if (index > -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter((items) => items.id !== action.payload.id);
    },
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
export const { createItem, updateItem, deleteItem, clear } = itemSlice.actions;
export default itemSlice.reducer;
