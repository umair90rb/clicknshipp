import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from 'api/index';

const fetchAllOrder = createAsyncThunk('orders/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchAllOrder(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchOrder = createAsyncThunk('order/fetch', ({ id }, { rejectWithValue }) =>
  orderService.fetchOrder(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateStatusOrder = createAsyncThunk('order/status/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchUpdateStatusOrder(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchBookOrder = createAsyncThunk('order/book/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchBookOrder(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCancelOrderBooking = createAsyncThunk('order/cancelOrderBooking/fetch', ({ id }, { rejectWithValue }) =>
  orderService.fetchCancelOrderBooking(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchOrderBookingStatus = createAsyncThunk('order/orderBookingStatus/fetch', ({ id }, { rejectWithValue }) =>
  orderService.fetchOrderBookingStatus(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchAssignOrders = createAsyncThunk('assign/orders/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchAssignOrders(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateOrder = createAsyncThunk('order/create/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchCreateOrder(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchImportOrder = createAsyncThunk('order/import/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchImportOrder(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateOrder = createAsyncThunk('order/update/fetch', ({ id, body }, { rejectWithValue }) =>
  orderService.fetchUpdateOrder(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchPartialUpdateOrder = createAsyncThunk('order/partialUpdate/fetch', ({ id, body }, { rejectWithValue }) =>
  orderService.fetchPartialUpdateOrder(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteOrder = createAsyncThunk('order/delete/fetch', ({ id }, { rejectWithValue }) =>
  orderService.fetchDeleteOrder(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchBulkOrdersDelete = createAsyncThunk('order/bulk/delete/fetch', ({ body }, { rejectWithValue }) =>
  orderService.fetchBulkOrdersDelete(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

export {
  fetchAllOrder,
  fetchOrder,
  fetchUpdateStatusOrder,
  fetchBookOrder,
  fetchCancelOrderBooking,
  fetchOrderBookingStatus,
  fetchAssignOrders,
  fetchCreateOrder,
  fetchImportOrder,
  fetchUpdateOrder,
  fetchPartialUpdateOrder,
  fetchDeleteOrder,
  fetchBulkOrdersDelete
};
