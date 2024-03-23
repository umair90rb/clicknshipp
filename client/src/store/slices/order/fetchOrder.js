import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from 'api/index';

const fetchAllOrder = createAsyncThunk('orders/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchAllOrder(body).catch((error) => rejectWithValue(error || error.message))
);

const fetchOrder = createAsyncThunk('order/fetch', ({ id }, { rejectWithValue }) =>
  orderService.fetchOrder(id).catch((error) => rejectWithValue(error || error.message))
);

const fetchUpdateStatusOrder = createAsyncThunk('order/status/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchUpdateStatusOrder(body).catch((error) => rejectWithValue(error || error.message))
);

const fetchBookOrder = createAsyncThunk('order/book/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchBookOrder(body).catch((error) => rejectWithValue(error || error.message))
);

const fetchCreateOrder = createAsyncThunk('order/create/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchCreateOrder(body).catch((error) => rejectWithValue(error || error.message))
);

const fetchImportOrder = createAsyncThunk('order/import/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchImportOrder(body).catch((error) => rejectWithValue(error || error.message))
);

const fetchUpdateOrder = createAsyncThunk('order/update/fetch', ({ id, body }, { rejectWithValue }) =>
  orderService.fetchUpdateOrder(id, body).catch((error) => rejectWithValue(error || error.message))
);

const fetchDeleteOrder = createAsyncThunk('order/delete/fetch', ({ id }, { rejectWithValue }) =>
  orderService.fetchDeleteOrder(id).catch((error) => rejectWithValue(error || error.message))
);

export {
  fetchAllOrder,
  fetchOrder,
  fetchUpdateStatusOrder,
  fetchBookOrder,
  fetchCreateOrder,
  fetchImportOrder,
  fetchUpdateOrder,
  fetchDeleteOrder
};
