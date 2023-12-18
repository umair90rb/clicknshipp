import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllSupplier } from './fetchSupplier';

const initialState = {
  suppliers: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    clear: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllSupplier.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllSupplier.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.suppliers = data.suppliers;
      state.error = null;
    });
    builder.addCase(fetchAllSupplier.rejected, (state, action) => {
      state.suppliers = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { clear } = supplierSlice.actions;
export default supplierSlice.reducer;
