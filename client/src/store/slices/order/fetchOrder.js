import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from 'api/index';

const fetchAllOrder = createAsyncThunk('orders/fetch', (_, { rejectWithValue }) =>
  orderService.fetchAllOrder().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchOrder = createAsyncThunk('order/fetch', ({ id }, { rejectWithValue }) =>
  orderService.fetchOrder(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateOrder = createAsyncThunk('order/create/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchCreateOrder(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchImportOrder = createAsyncThunk('order/import/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchImportOrder(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateOrder = createAsyncThunk('order/update/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchUpdateOrder(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteOrder = createAsyncThunk('order/delete/fetch', ({ id }, { rejectWithValue }) =>
  orderService.fetchDeleteOrder(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllOrder, fetchOrder, fetchCreateOrder, fetchImportOrder, fetchUpdateOrder, fetchDeleteOrder };
