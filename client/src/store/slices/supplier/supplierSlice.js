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
    clear: () => initialState,
    createSupplier: (state, action) => {
      state.suppliers = [...state.suppliers, action.payload];
    },
    updateSupplier: (state, action) => {
      const index = state.suppliers.indexOf((supplier) => supplier.id === action.payload.id);
      state.suppliers = state.suppliers.splice(index, 1, action.payload);
    },
    deleteSupplier: (state, action) => {
      state.suppliers = state.suppliers.filter((supplier) => supplier.id !== action.payload.id);
    }
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
export const { clear, createSupplier } = supplierSlice.actions;
export default supplierSlice.reducer;
