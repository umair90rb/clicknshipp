import { createAsyncThunk } from '@reduxjs/toolkit';
import { stockService } from 'api/index';

const fetchAllStock = createAsyncThunk('stocks/fetch', (_, { rejectWithValue }) =>
  stockService.fetchAllStock().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchStockHistory = createAsyncThunk('stock/history/fetch', ({ body }, { rejectWithValue }) =>
  stockService.fetchStockHistory(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateStock = createAsyncThunk('stock/create/fetch', ({ body }, { rejectWithValue }) =>
  stockService.fetchCreateStock(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateStock = createAsyncThunk('stock/update/fetch', ({ body }, { rejectWithValue }) =>
  stockService.fetchUpdateStock(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteStock = createAsyncThunk('stock/delete/fetch', ({ id }, { rejectWithValue }) =>
  stockService.fetchDeleteStock(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllStock, fetchStockHistory, fetchCreateStock, fetchUpdateStock, fetchDeleteStock };
