import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllCustomer, fetchCustomer } from './fetchCustomer';

const initialState = {
  customers: [],
  fetchStatus: fetchStatus.IDLE,
  error: null,
  view: {
    fetchStatus: fetchStatus.IDLE,
    error: null,
    data: null
  }
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clear: () => initialState,
    clearView: (state, action) => {
      state.view.fetchStatus = fetchStatus.IDLE;
      state.view.data = null;
      state.view.error = null;
    }
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
      state.error = action.payload;
    });

    builder.addCase(fetchCustomer.pending, (state, _action) => {
      state.view.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchCustomer.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.view.fetchStatus = fetchStatus.SUCCESS;
      state.view.data = data.customer;
      state.view.error = null;
    });
    builder.addCase(fetchCustomer.rejected, (state, action) => {
      state.view.data = null;
      state.fetchStatus = fetchStatus.FAILURE;
      state.view.error = action.payload;
    });
  }
});
export const { clear, clearView } = customerSlice.actions;
export default customerSlice.reducer;
