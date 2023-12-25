import { createAsyncThunk } from '@reduxjs/toolkit';
import { brandService } from 'api/index';

const fetchAllBrand = createAsyncThunk('brands/fetch', (_, { rejectWithValue }) =>
  brandService.fetchAllBrand().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchBrand = createAsyncThunk('brand/fetch', ({ id }, { rejectWithValue }) =>
  brandService.fetchBrand(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateBrand = createAsyncThunk('brand/create/fetch', ({ body }, { rejectWithValue }) =>
  brandService.fetchCreateBrand(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateBrand = createAsyncThunk('brand/update/fetch', ({ id, body }, { rejectWithValue }) =>
  brandService.fetchUpdateBrand(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteBrand = createAsyncThunk('brand/delete/fetch', ({ id }, { rejectWithValue }) =>
  brandService.fetchDeleteBrand(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllBrand, fetchBrand, fetchCreateBrand, fetchUpdateBrand, fetchDeleteBrand };
