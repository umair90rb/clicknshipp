import { createAsyncThunk } from '@reduxjs/toolkit';
import { brandService } from 'api/index';

const fetchAllBrand = createAsyncThunk('brands/fetch', (_, { rejectWithValue }) =>
  brandService.fetchAllBrand().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchBrand = createAsyncThunk(
  'brand/fetch',
  async ({ id }, { rejectWithValue }) =>
    await brandService.fetchBrand(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateBrand = createAsyncThunk(
  'brand/create/fetch',
  async ({ body }, { rejectWithValue }) =>
    await brandService.fetchCreateBrand(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateBrand = createAsyncThunk(
  'brand/update/fetch',
  async ({ body }, { rejectWithValue }) =>
    await brandService.fetchUpdateBrand(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteBrand = createAsyncThunk(
  'brand/delete/fetch',
  async ({ id }, { rejectWithValue }) =>
    await brandService.fetchDeleteBrand(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllBrand, fetchBrand, fetchCreateBrand, fetchUpdateBrand, fetchDeleteBrand };
