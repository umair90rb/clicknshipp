import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllSalesOrder, fetchCreateSalesOrder } from './fetchSalesOrder';

const initialState = {
  list: [],
  fetchStatus: fetchStatus.IDLE,
  error: null,
  create: {
    createModalVisible: false,
    viewModalVisible: false,
    viewId: null,
    fetchStatus: fetchStatus.IDLE,
    error: null,
    data: null
  }
};

const salesOrder = createSlice({
  name: 'salesOrder',
  initialState,
  reducers: {
    setSalesOrderCreateModalVisible: (state, action) => {
      state.create.createModalVisible = action.payload;
    },
    setSalesOrderViewModalVisible: (state, action) => {
      state.create.viewModalVisible = action.payload;
    },
    setSalesOrderViewId: (state, action) => {
      state.create.viewId = action.payload;
    },
    createSalesOrder: (state, action) => {
      state.list = [...state.list, action.payload];
    },
    updateSalesOrder: (state, action) => {
      const index = state.list.indexOf((stock) => stock.id === action.payload.id);
      state.list.splice(index, 1, action.payload);
    },
    deleteSalesOrder: (state, action) => {
      state.list = state.list.filter((stock) => stock.id !== action.payload.id);
    },
    clearSalesOrderState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllSalesOrder.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllSalesOrder.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.list = data.salesOrders;
      state.error = null;
    });
    builder.addCase(fetchAllSalesOrder.rejected, (state, action) => {
      state.list = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });

    builder.addCase(fetchCreateSalesOrder.pending, (state, _action) => {
      state.create.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchCreateSalesOrder.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.create.fetchStatus = fetchStatus.SUCCESS;
      state.create.data = data.salesOrder;
      state.create.error = null;
      state.create.viewId = data.salesOrder.id;
      state.create.createModalVisible = false;
      state.create.viewModalVisible = true;
    });
    builder.addCase(fetchCreateSalesOrder.rejected, (state, action) => {
      state.create.data = null;
      state.create.fetchStatus = fetchStatus.FAILURE;
      state.create.error = action.payload;
    });
  }
});
export const {
  setSalesOrderCreateModalVisible,
  setSalesOrderViewModalVisible,
  setSalesOrderViewId,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  clearSalesOrderState
} = salesOrder.actions;
export default salesOrder.reducer;
