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
    createCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex((category) => category.id === action.payload.id);
      if (index > -1) {
        state.categories[index].name = action.payload.name;
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter((category) => category.id !== action.payload.id);
    },
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
export const { createCategory, updateCategory, deleteCategory, clear } = categorySlice.actions;
export default categorySlice.reducer;
