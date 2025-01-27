import { createAsyncThunk } from '@reduxjs/toolkit';
import { billOfMaterialService } from 'api/index';

const fetchAllBillOfMaterial = createAsyncThunk('bom/all/fetch', (_, { rejectWithValue }) =>
  billOfMaterialService.fetchAllBillOfMaterial().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchBillOfMaterial = createAsyncThunk('bom/fetch', ({ id }, { rejectWithValue }) =>
  billOfMaterialService.fetchBillOfMaterial(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateBillOfMaterial = createAsyncThunk('bom/create/fetch', ({ body }, { rejectWithValue }) =>
  billOfMaterialService.fetchCreateBillOfMaterial(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateMaterialQuantity = createAsyncThunk('bom/material/update/fetch', ({ id, quantity }, { rejectWithValue }) =>
  billOfMaterialService.fetchUpdateMaterialQuantity(id, quantity).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateMaterial = createAsyncThunk('bom/update/fetch', ({ body }, { rejectWithValue }) =>
  billOfMaterialService.fetchUpdateMaterial(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteBillOfMaterial = createAsyncThunk('bom/delete/fetch', ({ id }, { rejectWithValue }) =>
  billOfMaterialService.fetchDeleteBillOfMaterial(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export {
  fetchAllBillOfMaterial,
  fetchBillOfMaterial,
  fetchCreateBillOfMaterial,
  fetchUpdateMaterialQuantity,
  fetchUpdateMaterial,
  fetchDeleteBillOfMaterial
};
