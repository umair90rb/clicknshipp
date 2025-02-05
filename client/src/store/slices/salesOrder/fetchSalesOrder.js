import { createAsyncThunk } from '@reduxjs/toolkit';
import { salesOrderService } from 'api/index';

const fetchAllSalesOrder = createAsyncThunk('salesOrder/all/fetch', (_, { rejectWithValue }) =>
  salesOrderService.fetchAllSalesOrder().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchSalesOrder = createAsyncThunk('salesOrder/fetch', ({ id }, { rejectWithValue }) =>
  salesOrderService.fetchSalesOrder(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateSalesOrder = createAsyncThunk('salesOrder/create/fetch', ({ body }, { rejectWithValue }) =>
  salesOrderService.fetchCreateSalesOrder(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateSalesOrder = createAsyncThunk('salesOrder/update/fetch', ({ id, body }, { rejectWithValue }) =>
  salesOrderService.fetchUpdateSalesOrder(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteSalesOrder = createAsyncThunk('salesOrder/delete/fetch', ({ id }, { rejectWithValue }) =>
  salesOrderService.fetchDeleteSalesOrder(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllSalesOrder, fetchSalesOrder, fetchCreateSalesOrder, fetchUpdateSalesOrder, fetchDeleteSalesOrder };
