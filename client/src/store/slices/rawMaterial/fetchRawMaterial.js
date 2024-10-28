import { createAsyncThunk } from '@reduxjs/toolkit';
import { rawMaterialService } from 'api/index';

const fetchAllRawMaterial = createAsyncThunk('rawMaterial/fetch', (_, { rejectWithValue }) =>
  rawMaterialService.fetchAllRawMaterial().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchRawMaterial = createAsyncThunk('rawMaterial/fetch', async ({ id }, { rejectWithValue }) =>
  rawMaterialService.fetchRawMaterial(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateRawMaterial = createAsyncThunk('rawMaterial/create/fetch', async ({ body }, { rejectWithValue }) =>
  rawMaterialService.fetchCreateRawMaterial(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchImportRawMaterial = createAsyncThunk('rawMaterial/import/fetch', async ({ body }, { rejectWithValue }) =>
  rawMaterialService.fetchImportRawMaterial(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateRawMaterial = createAsyncThunk('rawMaterial/update/fetch', async ({ id, body }, { rejectWithValue }) =>
  rawMaterialService.fetchUpdateRawMaterial(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteRawMaterial = createAsyncThunk('rawMaterial/delete/fetch', async ({ id }, { rejectWithValue }) =>
  rawMaterialService.fetchDeleteRawMaterial(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export {
  fetchAllRawMaterial,
  fetchRawMaterial,
  fetchCreateRawMaterial,
  fetchImportRawMaterial,
  fetchUpdateRawMaterial,
  fetchDeleteRawMaterial
};
