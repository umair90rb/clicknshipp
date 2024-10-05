import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllCustomer, fetchCustomer } from './fetchCustomer';

const initialState = {
  customers: [],
  fetchStatus: fetchStatus.IDLE,
  error: null,
  page: 0,
  pageSize: 100,
  total: 0,
  sort: [{ field: 'createdAt', sort: 'desc' }],
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
    setCustomerPagination: (state, action) => {
      const { page, pageSize } = action.payload;
      state.page = page;
      state.pageSize = pageSize;
    },
    setCustomerSort: (state, action) => {
      state.sort = action.payload;
    },
    clearCustomerState: () => initialState,
    // need to fetch and view customer data only in view do not put it on the state. its useless
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
      const {
        data: { customers }
      } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.customers = customers.rows;
      state.page = customers.page;
      state.pageSize = customers.pageSize;
      state.total = customers.count;
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
export const { setCustomerPagination, setCustomerSort, clearCustomerState, clearView } = customerSlice.actions;
export default customerSlice.reducer;
