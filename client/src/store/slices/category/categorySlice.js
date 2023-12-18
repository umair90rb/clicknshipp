import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllCategory } from './fetchCategory';

const initialState = {
  categories: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clear: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllCategory.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllCategory.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.categories = data.categories;
      state.error = null;
    });
    builder.addCase(fetchAllCategory.rejected, (state, action) => {
      state.categories = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { clear } = categorySlice.actions;
export default categorySlice.reducer;
