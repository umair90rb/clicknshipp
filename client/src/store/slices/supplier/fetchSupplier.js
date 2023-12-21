import { createAsyncThunk } from '@reduxjs/toolkit';
import { supplierService } from 'api/index';

const fetchAllSupplier = createAsyncThunk('suppliers/fetch', (_, { rejectWithValue }) =>
  supplierService.fetchAllSupplier().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchSupplier = createAsyncThunk(
  'supplier/fetch',
  async ({ id }, { rejectWithValue }) =>
    await supplierService.fetchSupplier(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateSupplier = createAsyncThunk(
  'supplier/create/fetch',
  async ({ body }, { rejectWithValue }) =>
    await supplierService.fetchAddSupplier(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateSupplier = createAsyncThunk(
  'supplier/update/fetch',
  async ({ body }, { rejectWithValue }) =>
    await supplierService.fetchUpdateSupplier(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteSupplier = createAsyncThunk(
  'supplier/delete/fetch',
  async ({ id }, { rejectWithValue }) =>
    await supplierService.fetchDeleteSupplier(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllSupplier, fetchSupplier, fetchCreateSupplier, fetchUpdateSupplier, fetchDeleteSupplier };
