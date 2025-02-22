import { createAsyncThunk } from '@reduxjs/toolkit';
import { stockService } from 'api/index';

export const fetchAllStock = createAsyncThunk('stocks/fetch', ({ type, lowStock }, { rejectWithValue }) =>
  stockService.fetchAllStock(type, lowStock).catch((error) => rejectWithValue(error.response.data || error.message))
);

export const fetchStockHistory = createAsyncThunk('stock/history/fetch', ({ body }, { rejectWithValue }) =>
  stockService.fetchStockHistory(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

export const fetchCreateStock = createAsyncThunk('stock/create/fetch', ({ body }, { rejectWithValue }) =>
  stockService.fetchCreateStock(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

export const fetchCreateStockReturn = createAsyncThunk('stockReturn/create/fetch', ({ body }, { rejectWithValue }) =>
  stockService.fetchCreateStockReturn(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

export const fetchCreateStockDamage = createAsyncThunk('stockDamage/create/fetch', ({ body }, { rejectWithValue }) =>
  stockService.fetchCreateStockDamage(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

export const fetchUpdateStock = createAsyncThunk('stock/update/fetch', ({ body }, { rejectWithValue }) =>
  stockService.fetchUpdateStock(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

export const fetchDeleteStock = createAsyncThunk('stock/delete/fetch', ({ id }, { rejectWithValue }) =>
  stockService.fetchDeleteStock(id).catch((error) => rejectWithValue(error.response.data || error.message))
);
