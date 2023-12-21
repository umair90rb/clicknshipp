import { createAsyncThunk } from '@reduxjs/toolkit';
import { itemService } from 'api/index';

const fetchAllItem = createAsyncThunk('items/fetch', (_, { rejectWithValue }) =>
  itemService.fetchAllItem().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchItem = createAsyncThunk('item/fetch', async ({ id }, { rejectWithValue }) =>
  itemService.fetchItem(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateItem = createAsyncThunk('item/create/fetch', async ({ body }, { rejectWithValue }) =>
  itemService.fetchCreateItem(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchImportItems = createAsyncThunk('items/import/fetch', async ({ body }, { rejectWithValue }) =>
  itemService.fetchImportItems(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateItem = createAsyncThunk('item/update/fetch', async ({ id, body }, { rejectWithValue }) =>
  itemService.fetchUpdateItem(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteItem = createAsyncThunk('item/delete/fetch', async ({ id }, { rejectWithValue }) =>
  itemService.fetchDeleteItem(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllItem, fetchItem, fetchCreateItem, fetchImportItems, fetchUpdateItem, fetchDeleteItem };
