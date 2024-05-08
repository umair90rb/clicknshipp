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
    createBrand: (state, action) => {
      state.brands.push(action.payload);
    },
    updateBrand: (state, action) => {
      const index = state.brands.findIndex((brand) => brand.id === action.payload.id);
      console.log(index, 'brand update index');
      if (index > -1) {
        state.brands[index] = action.payload;
      }
    },
    deleteBrand: (state, action) => {
      state.brands = state.brands.filter((brand) => brand.id !== action.payload.id);
    },
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
export const { createBrand, updateBrand, deleteBrand, clear } = brandSlice.actions;
export default brandSlice.reducer;
