import { createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from 'api/index';

const fetchAllCategory = createAsyncThunk('categories/fetch', (_, { rejectWithValue }) =>
  categoryService.fetchAllCategory().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCategory = createAsyncThunk(
  'category/fetch',
  async ({ id }, { rejectWithValue }) =>
    await categoryService.fetchCategory(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateCategory = createAsyncThunk(
  'category/create/fetch',
  async ({ body }, { rejectWithValue }) =>
    await categoryService.fetchCreateCategory(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateCategory = createAsyncThunk(
  'category/update/fetch',
  async ({ body }, { rejectWithValue }) =>
    await categoryService.fetchUpdateCategory(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteCategory = createAsyncThunk(
  'category/delete/fetch',
  async ({ id }, { rejectWithValue }) =>
    await categoryService.fetchDeleteCategory(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllCategory, fetchCategory, fetchCreateCategory, fetchUpdateCategory, fetchDeleteCategory };
