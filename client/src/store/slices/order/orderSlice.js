import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllOrder, fetchCreateOrder, fetchImportOrder } from './fetchOrder';

const initialState = {
  list: {
    orders: [],
    fetchStatus: fetchStatus.IDLE,
    error: null,
    page: 0,
    pageSize: 100,
    total: 0,
    filters: [],
    sort: [{ field: 'createdAt', sort: 'desc' }],
    nextOrder: null,
    preOrder: null
  },
  create: {
    fetchStatus: fetchStatus.IDLE,
    error: null
  },
  import: {
    fetchStatus: fetchStatus.IDLE,
    error: null
  }
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderPagination: (state, action) => {
      const { page, pageSize } = action.payload;
      state.list.page = page;
      state.list.pageSize = pageSize;
    },
    setOrderFilters: (state, action) => {
      state.list.filters = action.payload;
    },
    setOrderSort: (state, action) => {
      state.list.sort = action.payload;
    },
    setOrder: (state, action) => {
      const updatedOrder = action.payload.order;
      const index = state.list.orders.findIndex((order) => order.id === updatedOrder.id);
      if (index > -1) {
        state.list.orders[index] = updatedOrder;
      }
    },
    setNextPreOrder: (state, action) => {
      if (state.list.orders.length) {
        const currentOrderIndex = state.list.orders.findIndex((order) => order.id == action.payload);
        if (currentOrderIndex > -1) {
          if (currentOrderIndex + 1 < state.list.orders.length) {
            state.list.nextOrder = state.list.orders[currentOrderIndex + 1].id;
          } else {
            state.list.nextOrder = null;
          }
          if (currentOrderIndex > 0) {
            state.list.preOrder = state.list.orders[currentOrderIndex - 1].id;
          } else {
            state.list.preOrder = null;
          }
        }
      }
    },
    clearOrderState: (_state, _action) => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllOrder.pending, (state, _action) => {
      state.list.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllOrder.fulfilled, (state, action) => {
      const {
        data: { orders }
      } = action.payload;
      state.list.fetchStatus = fetchStatus.SUCCESS;
      state.list.orders = orders.rows;
      state.list.page = orders.page;
      state.list.pageSize = orders.pageSize;
      state.list.total = orders.count;
      state.list.error = null;
    });
    builder.addCase(fetchAllOrder.rejected, (state, action) => {
      state.list.orders = null;
      state.list.fetchStatus = fetchStatus.FAILURE;
      state.list.error = action.payload?.message || action.payload || 'Error in fetching orders';
    });

    builder.addCase(fetchCreateOrder.pending, (state, _action) => {
      state.create.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchCreateOrder.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.create.fetchStatus = fetchStatus.SUCCESS;
      state.list.orders.push(data.order);
      state.create.error = null;
    });
    builder.addCase(fetchCreateOrder.rejected, (state, action) => {
      state.create.fetchStatus = fetchStatus.FAILURE;
      state.create.error = action.payload;
    });

    builder.addCase(fetchImportOrder.pending, (state, _action) => {
      state.import.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchImportOrder.fulfilled, (state, action) => {
      state.import.fetchStatus = fetchStatus.SUCCESS;
      state.import.error = null;
    });
    builder.addCase(fetchImportOrder.rejected, (state, action) => {
      state.import.fetchStatus = fetchStatus.FAILURE;
      state.import.error = action.payload;
    });
  }
});
export const { setOrderPagination, setOrderFilters, setOrderSort, setOrder, setNextPreOrder, clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
