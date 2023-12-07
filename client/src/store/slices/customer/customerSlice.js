import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllCustomer } from './fetchCustomer';

const initialState = {
  customers: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clear: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllCustomer.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllCustomer.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.customers = data.customers;
      state.error = null;
    });
    builder.addCase(fetchAllCustomer.rejected, (state, action) => {
      state.customers = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload.error;
    });
  }
});
export const { clear } = customerSlice.actions;
export default customerSlice.reducer;
