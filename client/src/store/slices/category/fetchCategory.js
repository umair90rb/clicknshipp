import { createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from 'api/index';

const fetchAllCategory = createAsyncThunk('categories/fetch', (_, { rejectWithValue }) =>
  categoryService.fetchAllCategory().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCategory = createAsyncThunk('category/fetch', ({ id }, { rejectWithValue }) =>
  categoryService.fetchCategory(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateCategory = createAsyncThunk('category/create/fetch', ({ body }, { rejectWithValue }) =>
  categoryService.fetchCreateCategory(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateCategory = createAsyncThunk('category/update/fetch', ({ id, body }, { rejectWithValue }) =>
  categoryService.fetchUpdateCategory(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteCategory = createAsyncThunk('category/delete/fetch', ({ id }, { rejectWithValue }) =>
  categoryService.fetchDeleteCategory(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllCategory, fetchCategory, fetchCreateCategory, fetchUpdateCategory, fetchDeleteCategory };
