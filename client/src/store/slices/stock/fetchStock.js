import { createAsyncThunk } from '@reduxjs/toolkit';
import { stockService } from 'api/index';

const fetchAllStock = createAsyncThunk('stocks/fetch', (_, { rejectWithValue }) =>
  stockService.fetchAllStock().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchStock = createAsyncThunk('stock/fetch', async ({ id }, { rejectWithValue }) =>
  stockService.fetchStock(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateStock = createAsyncThunk('stock/create/fetch', async ({ body }, { rejectWithValue }) =>
  stockService.fetchCreateStock(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateStock = createAsyncThunk('stock/update/fetch', async ({ body }, { rejectWithValue }) =>
  stockService.fetchUpdateStock(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteStock = createAsyncThunk('stock/delete/fetch', async ({ id }, { rejectWithValue }) =>
  stockService.fetchDeleteStock(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllStock, fetchStock, fetchCreateStock, fetchUpdateStock, fetchDeleteStock };
