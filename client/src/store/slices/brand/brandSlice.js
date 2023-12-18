import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllBrand } from './fetchBrand';

const initialState = {
  brands: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    clear: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllBrand.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllBrand.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.brands = data.brands;
      state.error = null;
    });
    builder.addCase(fetchAllBrand.rejected, (state, action) => {
      state.brands = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { clear } = brandSlice.actions;
export default brandSlice.reducer;
