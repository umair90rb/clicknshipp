import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from 'api/index';

const fetchAllOrder = createAsyncThunk('orders/fetch', (_, { rejectWithValue }) =>
  orderService.fetchAllOrder().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchOrder = createAsyncThunk(
  'order/fetch',
  async ({ id }, { rejectWithValue }) =>
    await orderService.fetchOrder(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateOrder = createAsyncThunk(
  'order/create/fetch',
  async ({ body }, { rejectWithValue }) =>
    await orderService.fetchCreateOrder(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchImportOrder = createAsyncThunk(
  'order/import/fetch',
  async ({ body }, { rejectWithValue }) =>
    await orderService.fetchImportOrder(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateOrder = createAsyncThunk(
  'order/update/fetch',
  async ({ body }, { rejectWithValue }) =>
    await orderService.fetchUpdateOrder(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteOrder = createAsyncThunk(
  'order/delete/fetch',
  async ({ id }, { rejectWithValue }) =>
    await orderService.fetchDeleteOrder(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllOrder, fetchOrder, fetchCreateOrder, fetchImportOrder, fetchUpdateOrder, fetchDeleteOrder };
